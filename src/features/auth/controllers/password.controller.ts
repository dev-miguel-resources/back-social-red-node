import { Request, Response } from 'express';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@configs/configEnvs';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/emailAndPassword';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { Generators } from '@helpers/generators/generators';
import { authService } from '@services/db/auth.service';

export class PasswordController {
	@joiValidation(emailSchema)
	public async requestReinstatement(req: Request, res: Response): Promise<void> {
		const { email } = req.body;
		const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials');
		}
	}
}
