import { Request, Response } from 'express';
import { config } from '@configs/configEnvs';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { loginSchema } from '@auth/schemes/signin';
import { authService } from '@services/db/auth.service';

export class SignInController {
	@joiValidation(loginSchema)
	public async login(req: Request, res: Response): Promise<void> {
		const { username, password } = req.body;
		const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials for this user.');
		}

		const passwordMatch: boolean = await existingUser.comparePassword(password);
		if (!passwordMatch) {
			throw new BadRequestError('Invalid credentials for this user.');
		}

		const userJwt: string = JWT.sign(
			{
				userId: existingUser._id,
				uId: existingUser.uId,
				email: existingUser.email,
				username: existingUser.username,
				avatarColor: existingUser.avatarColor
			},
			config.JWT_TOKEN!
		);

		req.session = { jwt: userJwt };
		res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: existingUser, token: userJwt });
	}
}
