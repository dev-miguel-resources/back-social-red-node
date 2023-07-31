import { Request, Response } from 'express';
import { Application } from 'express';

export default (app: Application) => {
	const routes = () => {
		// parent routes
		app.use('/healthcheck', (_req: Request, res: Response) => res.send('Server is OK!'));
	};
	routes();
};
