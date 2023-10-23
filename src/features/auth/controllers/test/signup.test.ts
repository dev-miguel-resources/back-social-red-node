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
import { authMockResponse } from '@mocks/auth.mock';
import { authMockRequest } from '@mocks/auth.mock';
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
});
