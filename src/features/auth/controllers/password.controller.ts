import { Request, Response } from 'express';
import crypto from 'crypto';
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

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(Number(config.RANDOM_BYTES)));
		const randomCharacters: string = randomBytes.toString('hex'); // secuencia definida entre 0 a 9 y de la a la f

		await authService.updatePasswordToken(`${existingUser._id}`, randomCharacters, Date.now() + 60 * 60 * 1000); // recomendación: 30min/1hr
		const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
		//const template: string = '';
	}
}
