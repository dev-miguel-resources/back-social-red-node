import { Request, Response } from 'express';
import { PasswordController } from '../password.controller';
import { CORRECT_EMAIL, INVALID_EMAIL, PASSWORD, WRONG_EMAIL, authMockRequest, authMockResponse } from '@mocks/auth.mock';
import { CustomError } from '@helpers/errors/customError';
import { emailQueue } from '@services/queues/email.queue';
import { authService } from '@services/db/auth.service';
import { authMock } from '@mocks/interfaces/authPayloadResolved';
//import { mailTransport } from '@services/emails/mail.transport';

jest.mock('@services/db/auth.service');
jest.mock('@services/queues/base.queue');
jest.mock('@services/queues/email.queue');

jest.useFakeTimers();

describe('PasswordController', () => {
	beforeEach(() => {
		//jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	// UNITARY TEST 1
	it('Should throw an error when the email is invalid', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { email: INVALID_EMAIL }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await PasswordController.prototype.requestReinstatement(req, res).catch((error: CustomError) => {
			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Email must be a valid format');
		});
	});

	// INTEGRATION TEST 1
	it('Should throw an error of "Invalid Credentials" if email does not exist for user', async () => {

		// GIVEN
		const req: Request = authMockRequest({}, { email: WRONG_EMAIL }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValueOnce(null!);
		await PasswordController.prototype.requestReinstatement(req, res).catch((error: CustomError) => {

		// THEN
		expect(error.statusCode).toEqual(400);
		expect(error.serializeErrors().message).toEqual('Invalid credentials');

		});
	});

	// INTEGRATION TEST 2
	it('Should send correct json response for password reset email', async () => {

		// GIVEN
		const req: Request = authMockRequest({}, { email: CORRECT_EMAIL }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(authMock);
		const spyEmailQueue =  jest.spyOn(emailQueue, 'addEmailJob');
		await PasswordController.prototype.requestReinstatement(req, res);

		// THEN
		expect(spyEmailQueue).toHaveBeenCalled(); // complemento opcional
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Password reset email sent.'
		});
	});

	describe('Handler Update Password', () => {

		// UNITARY TEST 2
		it('Should throw an error if password is empty', async () => {

			// GIVEN
			const req: Request = authMockRequest({}, { password: '' }) as Request;
			const res: Response = authMockResponse();

			// WHEN
			await PasswordController.prototype.updatePassword(req, res).catch((error: CustomError) => {

			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Password is a required field');
			});
		});

		// UNITARY TEST 3
		it('Should throw an error if password and confirmPassword are different', async () => {

			// GIVEN
			const req: Request = authMockRequest({}, { password: PASSWORD, confirmPassword: `${PASSWORD}2` }) as Request;
			const res: Response = authMockResponse();

			// WHEN
			await PasswordController.prototype.updatePassword(req, res).catch((error: CustomError) => {

			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Passwords should match');
			});
		});

		// INTEGRATION TEST 3
		it('Should throw an error if reset token has expired or invalid', async () => {

			// GIVEN
			const req: Request = authMockRequest({}, { password: PASSWORD, confirmPassword: PASSWORD }, null, {
				token: ''
			}) as Request;
			const res: Response = authMockResponse();

			// WHEN
			jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(null!);
			await PasswordController.prototype.updatePassword(req, res).catch((error: CustomError) => {

			// THEN
			expect(error.statusCode).toEqual(400);
			expect(error.serializeErrors().message).toEqual('Reset token has expired or invalid.');
			});
		});

		// INTEGRATION TEST 4
		it('Should send correct json response with update succesfully password through email', async () => {

			// GIVEN
			const req: Request = authMockRequest({}, { password: PASSWORD, confirmPassword: PASSWORD }, null, {
				token: '12sde3'
			}) as Request;
			const res: Response = authMockResponse();

			// WHEN
			jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(authMock);
			const spyEmailQueue = jest.spyOn(emailQueue, 'addEmailJob');

			await PasswordController.prototype.updatePassword(req, res);

			// THEN
			expect(spyEmailQueue).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Password updated successfully.'
			});
		});
	});
});
