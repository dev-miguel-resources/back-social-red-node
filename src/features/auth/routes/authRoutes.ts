import express, { Router } from 'express';
import { SignUp } from '@auth/controllers/signup';
import { SignIn } from '@auth/controllers/signin';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		// design pattern: bind prototype
		this.router.post('/signup', SignUp.prototype.register);
		this.router.post('/signin', SignIn.prototype.login);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
