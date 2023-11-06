import { Request, Response } from 'express';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { userQueue } from '@services/queues/user.queue';
import { authQueue } from '@services/queues/auth.queue';
import * as cloudinaryUploads from '@helpers/cloudinary/cloudinaryUploads';
import { UserCache } from '@services/redis/user/user.cache';
import { SignUpController } from '../signup.controller';
import { authService } from '@services/db/auth.service';
import { IJWT } from '@mocks/interfaces/jwt.interface';
import { imageMock } from '@mocks/interfaces/imagePayload.interface';
import { authMockRequest, authMockResponse } from '@mocks/auth.mock';
import { authMock } from '@mocks/interfaces/authPayloadResolved';
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

	// UNITARY TEST 1
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

	// UNITARY TEST 2
	it('Should throw an error if username length is less than minium length', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'fa',
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
			expect(error.serializeErrors().message).toEqual('Username must be at least four characters');
		});
	});

	// UNITARY TEST 3
	it('Should throw an error if username length is greater than maximum length', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facundo2023',
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
			expect(error.serializeErrors().message).toEqual('Username must be at most eight characters');
		});
	});

	// UNITARY TEST 4
	it('Should throw an error if email is not available', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facdev',
				email: '',
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
			expect(error.serializeErrors().message).toEqual('Email is a required field');
		});
	});

	// UNITARY TEST 5
	it('Should throw an error if email is not valid', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facdev',
				email: 'facugmail.com',
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
			expect(error.serializeErrors().message).toEqual('Email must be valid');
		});
	});

	// UNITARY TEST 6
	it('Should throw an error if password is not available', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facdev',
				email: 'facu@gmail.com',
				password: '',
				avatarColor: 'red',
				avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
			}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignUpController.prototype.register(req, res).catch((error: CustomError) => {
			// THEN -> ASSERTION
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password is a required field');
		});
	});

	// UNITARY TEST 7
	it('Should throw an error if password length is less than minium length', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facdev',
				email: 'facu@gmail.com',
				password: 'fa',
				avatarColor: 'red',
				avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
			}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignUpController.prototype.register(req, res).catch((error: CustomError) => {
			// THEN -> ASSERTION
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password must be at least four characters');
		});
	});

	// UNITARY TEST 8
	it('Should throw an error if password length is greater than maximum length', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'facdev',
				email: 'facu@gmail.com',
				password: 'faasasasasasaass',
				avatarColor: 'red',
				avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
			}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignUpController.prototype.register(req, res).catch((error: CustomError) => {
			// THEN -> ASSERTION
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password must be at most eight characters');
		});
	});

	// INTEGRATION TEST 1
	it('Should throw an error is user already exist', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'Facu',
				email: 'facdev@gmail.com',
				password: 'asasaa',
				avatarColor: 'red',
				avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
			}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
		await SignUpController.prototype.register(req, res).catch((error: CustomError) => {
			// THEN -> ASSERTION
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Invalid credentials for this user');
		});
	});

	// INTEGRATION TEST 2
	it('Should set session data for valid credentials and send correct json response for use create succesfully', async () => {
		// GIVEN
		const req: Request = authMockRequest(
			{},
			{
				username: 'Facu',
				email: 'facdev@gmail.com',
				password: 'asasaa',
				avatarColor: 'red',
				avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
			}
		) as Request;
		const res: Response = authMockResponse();

		// WHEN
		jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null!);
		jest
			.spyOn(cloudinaryUploads, 'uploads')
			.mockImplementation(() =>
				Promise.resolve<UploadApiResponse | UploadApiErrorResponse | undefined | Iimage>(imageMock)
			);
		const userSpy = jest.spyOn(UserCache.prototype, 'saveToUserCache');
		jest.spyOn(userQueue, 'addUserJob');
		jest.spyOn(authQueue, 'addAuthUserJob');
		await SignUpController.prototype.register(req, res);

		// THEN -> ASSERTION
		expect(req.session?.jwt as IJWT).toBeDefined();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User created succesfully',
			user: userSpy.mock.calls[0][2],
			token: req.session?.jwt
		});
	});
});
