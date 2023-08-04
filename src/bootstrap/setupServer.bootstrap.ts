import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import Logger from 'bunyan';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import cookieSession from 'cookie-session';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';
import applicationRoutes from '@interfaces/http/routes';
import { IErrorResponse } from '@helpers/errors/errorResponse.interface';
import { CustomError } from '@helpers/errors/customError';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const log: Logger = logger.createLogger('server');

// SOLID Principle: Single Responsability
// SOLID Principle: Open/Closed
export class SocialServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		// inicializaciones de métodos a arrancar cuando se levante la app
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		// manejo de la seguridad del servidor con owasp
		// pendiente de agregar otro middleware personalizado para renovar tiempos de vida del maxAge
		// Design Pattern Synchronized Token: https://medium.com/@kaviru.mihisara/synchronizer-token-pattern-e6b23f53518e
		app.use(
			cookieSession({
				name: 'session',
				keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
				maxAge: 24 * 7 * 3600000, // 1 semana
				secure: config.NODE_ENV !== 'development'
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL,
				optionsSuccessStatus: 200,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			})
		);
	}

	private standardMiddleware(app: Application): void {
		// definiciones de comportamiento general
		app.use(compression());
		app.use(json({ limit: '50mb' }));
		app.use(urlencoded({ extended: true, limit: '50mb' }));
	}

	private routesMiddleware(app: Application): void {
		// definiciones generales para las rutas
		applicationRoutes(app);
	}

	private globalErrorHandler(app: Application): void {
		// manejo de rutas no encontradas
		app.all('*', (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
		});

		// rutas encontradas pero que pueden tener errores internos de negocio
		app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
			log.error(error);
			if (error instanceof CustomError) {
				return res.status(error.statusCode).json(error.serializeErrors());
			}
			next();
		});
	}

	private startHttpServer(httpServer: http.Server): void {
		// config. de un servidor http
		log.info(`Server has started with process ${process.pid}.`);
		const PORT = Number(config.SERVER_PORT);
		httpServer.listen(PORT, () => {
			log.info(`Server running on port ${PORT}.`);
		});
	}

	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		// creación de una instancia de servidor para conexiones en realtime
		const io: Server = new Server(httpServer, {
			cors: {
				origin: config.CLIENT_URL,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			}
		});
		// pub/sub mechanism
		const pubClient = createClient({ url: config.REDIS_HOST });
		const subClient = pubClient.duplicate();
		await Promise.all([pubClient.connect(), subClient.connect()]);
		io.adapter(createAdapter(pubClient, subClient));
		return io;
	}

	private socketIOConnections(io: Server): void {
		// verificador de conexiones con el socket
		log.info(io);
		log.info('SocketIO Connections Ok.');
	}

	private async startServer(app: Application): Promise<void> {
		// la especificación del servidor http con el servidor de sockets
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);
			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			log.error(error);
		}
	}
}
