import { Request, Response } from 'express';
import {
	LONG_PASSWORD,
	PASSWORD,
	USERNAME,
	WRONG_PASSWORD,
	WRONG_USERNAME,
	authMockRequest,
	authMockResponse
} from '@mocks/auth.mock';
import { SignInController } from '../signin.controller';
import { CustomError } from '@helpers/errors/customError';
import { authService } from '@services/db/auth.service';
import { Generators } from '@helpers/generators/generators';
import { authMock } from '@mocks/interfaces/authPayloadResolved';
import { IJWT } from '@mocks/interfaces/jwt.interface';

jest.useFakeTimers();

describe('SignIn Controller', () => {
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
		const req: Request = authMockRequest({}, { username: '', password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Username is a required field');
		});
	});

	// UNITARY TEST 2
	it('Should throw an error if username is less than minium length', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: WRONG_USERNAME, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Username must be at least four characters');
		});
	});

	// UNITARY TEST 3
	it('Should throw an error if username is greater than maximum length', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: LONG_PASSWORD, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Username must be at most eight characters');
		});
	});

	// UNITARY TEST 4
	it('Should throw an error if password is not available', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: '' }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password is a required field');
		});
	});

	// UNITARY TEST 5
	it('Should throw an error if password is less than minium length', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: WRONG_PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password must be at least four characters');
		});
	});

	// UNITARY TEST 6
	it('Should throw an error if password is greater than maximum length', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: LONG_PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password must be at most eight characters');
		});
	});

	// INTEGRATION TEST 1
	it('Should throw an error of "Invalid credentials" if username does not exist', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		//jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValue(null!);
		const userSpy = jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValueOnce(null!);
		await SignInController.prototype.login(req, res).catch((error: CustomError) => {
			// THEN
			expect(userSpy).toHaveBeenCalledWith(Generators.firstLetterUppercase(req.body.username));
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Invalid credentials for this user.');
		});
	});

	// INTEGRATION TEST 2
	it('Should set session data for valid credentials and sent correct json response for login successfully', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		authMock.comparePassword = () => Promise.resolve(true);
		jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValue(authMock);
		await SignInController.prototype.login(req, res);

		// THEN
		expect(req.session?.jwt as IJWT).toBeDefined();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'User login successfully',
			user: authMock,
			token: req.session?.jwt
		});
	});
});
