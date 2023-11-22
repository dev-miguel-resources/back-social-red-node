import { Request, Response } from 'express';
import { JWT, PASSWORD, USERNAME, authMockRequest, authMockResponse } from '@mocks/auth.mock';
import { authUserPayload } from '@mocks/authPayload.mock';
import { UserCache } from '@services/redis/user/user.cache';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { CurrentUserController } from '../currentUser.controller';
import { existingUser } from '@mocks/existingUser.mock';
import { userService } from '@services/db/user.service';


//jest.mock('@services/redis/user/user.cache');
jest.mock('@services/redis/base.cache');
jest.mock('@services/db/user.service');

jest.useFakeTimers();

describe('CurrentUserController', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});

	describe('Session Current User', () => {
		// INTEGRATION TEST 1
		it('Should send correct json response with token and user null and isUser false', async () => {
			// GIVEN
			const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload) as Request;
			const res: Response = authMockResponse();

			// WHEN
			jest.spyOn(UserCache.prototype, 'getUserFromCache').mockResolvedValue({} as IUserDocument);
			await CurrentUserController.prototype.getCurrentUser(req, res);

			// THEN
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				token: null,
				isUser: false,
				user: null
			});
		});

		it('Should set session token and send correct json response from redis or mongo', async () => {

			// GIVEN
			const req: Request = authMockRequest(
				{ jwt: JWT },
				{ username: USERNAME, password: PASSWORD },
				authUserPayload
			) as Request;
			const res: Response = authMockResponse();

			// WHEN
			jest.spyOn(UserCache.prototype, 'getUserFromCache').mockResolvedValue(existingUser) ||
				jest.spyOn(userService, 'getUserById').mockResolvedValue(existingUser);
			await CurrentUserController.prototype.getCurrentUser(req, res);

			// THEN
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				token: req.session?.jwt,
				isUser: true,
				user: existingUser
			});
		});
	});
});
