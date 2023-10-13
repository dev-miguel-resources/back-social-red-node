import express, { Router } from 'express';

class CurrentUserRoutes {

	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {

		this.router.get('/currentUser');

		return this.router;
	}
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
