import { Request, Response } from 'express';
import crypto from 'crypto';
import publicIp from 'ip';
import moment from 'moment';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@configs/configEnvs';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/emailAndPassword';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { Generators } from '@helpers/generators/generators';
import { authService } from '@services/db/auth.service';
import { forgotPasswordTemplate } from '@services/emails/templates/forgot-password/forgot-password';
import { emailQueue } from '@services/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/resetPassword.interface';
import { resetPasswordTemplate } from '@services/emails/templates/reset-password/reset-password-template';

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
		const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
		//emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: config.SENDER_EMAIL!, subject: 'Reset your password' });
		emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email, subject: 'Reset your password' });
		res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
	}

	@joiValidation(passwordSchema)
	public async updatePassword(req: Request, res: Response): Promise<void> {
		const { password, confirmPassword } = req.body;
		const passwordHash = await Generators.hash(password);
		const { token } = req.params;
		if (password !== confirmPassword) {
			throw new BadRequestError('Passwords do not match');
		}

		const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
		if (!existingUser) {
			throw new BadRequestError('Reset token has expired or invalid.');
		}

		existingUser.password = passwordHash;
		existingUser.passwordResetExpires = undefined;
		existingUser.passwordResetToken = undefined;
		await existingUser.save();

		const templateParams: IResetPasswordParams = {
			username: existingUser.username,
			email: existingUser.email,
			ipaddress: publicIp.address(),
			date: moment().format('DD/MM/YYYY HH:mm:ss')
		};

		const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
		emailQueue.addEmailJob('forgotPasswordEmail', {
			template,
			//receiverEmail: config.SENDER_EMAIL!,
			receiverEmail: existingUser.email,
			subject: 'Password Reset Confirmation'
		});
		res.status(HTTP_STATUS.OK).json({ message: 'Password updated successfully.' });
	}
}
