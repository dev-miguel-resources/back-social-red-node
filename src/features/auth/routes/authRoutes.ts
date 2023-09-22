import express, { Router } from 'express';
import { SignUp } from '@auth/controllers/signup';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		//this.router.post('/signup', SignUp.create()); // design pattern: bind prototype

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
