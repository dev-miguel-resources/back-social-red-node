import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { signupSchema } from '../schemes/signup';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { ObjectId } from 'mongodb';
import { Generators } from '@helpers/generators/generators';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { SignUpUtility } from './utilities/signup.utility';

export class SignUp extends SignUpUtility {
	@joiValidation(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;
		const checkIfUserExist = await authService.getUserByUsernameOrEmail(username, email);
		if (checkIfUserExist) {
			throw new BadRequestError('Invalid credentials for this user');
		}

		const authObjectId: ObjectId = new ObjectId();
		const userObjectId: ObjectId = new ObjectId();
		const uId = `${Generators.generateRandomIntegers(12)}`;
		const passwordHash = await Generators.hash(password);
		const authData: IAuthDocument = SignUp.prototype.signUpData({
			_id: authObjectId,
			uId: uId,
			username,
			email,
			password: passwordHash,
			avatarColor
		});

		const result = '';
	}
}
