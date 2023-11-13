import { Response } from 'express';
import { IJWT } from './interfaces/jwt.interface';
import { IAuthMock } from './interfaces/auth.interface';
import { AuthPayload } from '@auth/interfaces/authPayload.interface';

// mock del request
export const authMockRequest = (
	sessionData: IJWT,
	body: IAuthMock,
	currentUser?: AuthPayload | null,
	params?: unknown
) => ({
	session: sessionData,
	body,
	currentUser,
	params
});

// mock del response
export const authMockResponse = (): Response => {
	const res: Response = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

// SIMPLE MOCKS
export const PASSWORD = 'facdev';
export const USERNAME = 'Facu';
export const WRONG_USERNAME = 'fa';
export const LONG_USERNAME = 'facudevelopermaximum';
export const WRONG_PASSWORD = 'fac';
export const LONG_PASSWORD = 'facdevelopermax';
export const JWT = '12djddj34';
export const INVALID_EMAIL = 'facugmail.com';
export const WRONG_EMAIL = 'test@gmail.com';
export const CORRECT_EMAIL = 'facdev@gmail.com';
