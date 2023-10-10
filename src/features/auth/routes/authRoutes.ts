import express, { Router } from 'express';
import { SignUpController } from '@auth/controllers/signup.controller';
import { SignInController } from '@auth/controllers/signin.controller';
import { PasswordController } from '@auth/controllers/password.controller';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		// design pattern: bind prototype
		this.router.post('/signup', SignUpController.prototype.register);
		this.router.post('/signin', SignInController.prototype.login);
		this.router.post('/forgot-password', PasswordController.prototype.requestReinstatement);
		this.router.post('/reset-password/:token', PasswordController.prototype.updatePassword);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
