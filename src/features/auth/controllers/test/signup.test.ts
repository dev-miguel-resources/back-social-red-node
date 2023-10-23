import { Request, Response } from 'express';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { userQueue } from '@services/queues/user.queue';
import { authQueue } from '@services/queues/auth.queue';
import * as cloudinaryUploads from '@helpers/cloudinary/cloudinaryUploads';
import { UserCache } from '@services/redis/user/user.cache';
import { SignUpController } from '../signup.controller';
import { authService } from '@services/db/auth.service';
import {  IJWT } from '@mocks/interfaces/jwt.interface';
import { imageMock } from '@mocks/interfaces/imagePayload.interface';
import { authMockRequest, authMockResponse } from '@mocks/auth.mock';
import { Iimage } from '@helpers/cloudinary/imageResult.interface';
import { CustomError } from '@helpers/errors/customError';

jest.useFakeTimers();
jest.mock('@services/queues/base.queue');
jest.mock('@helpers/cloudinary/cloudinaryUploads');
jest.mock('@services/redis/user/user.cache');
jest.mock('@services/queues/user.queue');
jest.mock('@services/queues/auth.queue');

describe('SignUp Controller', () => {
	// general rules
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	// UNITARY TEST
	it('Should throw an error if username is not available', async () => {

		// GIVEN
		const req: Request = authMockRequest(
		{},
		{
			username: '',
			email: 'facu@gmail.com',
			password: 'facdev',
			avatarColor: 'red',
			avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
		}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignUpController.prototype.register(req, res).catch((error: CustomError) => {

		// THEN -> ASSERTION
		expect(error.statusCode).toEqual(400);
		expect(error.serializeErrors().message).toEqual('Username is a required field');
		});
	});
});
