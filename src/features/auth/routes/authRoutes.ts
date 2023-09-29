import express, { Router } from 'express';
import { SignUpController } from '@auth/controllers/signup.controller';
import { SignInController } from '@auth/controllers/signin.controller';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		// design pattern: bind prototype
		this.router.post('/signup', SignUpController.prototype.register);
		this.router.post('/signin', SignInController.prototype.login);
		this.router.post('/forgot-password');

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
