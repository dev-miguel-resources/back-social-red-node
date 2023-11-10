import { Request, Response } from 'express';
import { PASSWORD, USERNAME, authMockRequest, authMockResponse } from '@mocks/auth.mock';
import { SignOutController } from '../signout.controller';

jest.useFakeTimers();

describe('SignOut Controller', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	// UNITARY TEST 1
	it('Should set user session to null', async () => {
		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignOutController.prototype.logout(req, res);

		// THEN
		expect(req.session).toBeNull();
	});

	// UNITARY TEST 2
	it('Should send correct json response for logout sucesful', async () => {

		// GIVEN
		const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as Request;
		const res: Response = authMockResponse();

		// WHEN
		await SignOutController.prototype.logout(req, res);

		// THEN
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Logout succesful',
			user: {},
			token: ''
		});
	});
});
