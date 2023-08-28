import { Request, Response } from 'express';
import { Application } from 'express';
import { authRoutes } from '@auth/routes/authRoutes';
import { config } from '@configs/configEnvs';

export default (app: Application) => {
	const routes = () => {
		// parent routes
		app.use('/healthcheck', (_req: Request, res: Response) => res.send('Server is OK!'));
		app.use(config.BASE_PATH!, authRoutes.routes());
	};
	routes();
};
