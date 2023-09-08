import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { signupSchema } from '../schemes/signup';

export class SignUp {

	@joiValidation(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;

	}
}
