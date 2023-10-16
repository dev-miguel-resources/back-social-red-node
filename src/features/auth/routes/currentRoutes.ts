import express, { Router } from 'express';
import { authMiddleware } from '@helpers/middlewares/auth-midleware';
import { CurrentUserController } from '@auth/controllers/currentUser.controller';

class CurrentUserRoutes {

	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {

		this.router.get('/currentUser', authMiddleware.checkAuthentication, CurrentUserController.prototype.getCurrentUser);

		return this.router;
	}
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
