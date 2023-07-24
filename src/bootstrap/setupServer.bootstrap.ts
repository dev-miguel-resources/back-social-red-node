import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import Logger from 'bunyan';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';

const log: Logger = logger.createLogger('server');

export class SocialServer {

	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start(): void { // inicializaciones de métodos a arrancar cuando se levante la app
		//
	}

	private standardMiddleware(app: Application): void { // definiciones de comportamiento general
		app.use(compression());
		app.use(json( { limit: '50mb' } ));
		app.use(urlencoded({ extended: true, limit: '50mb' }));
	}

	private securityMiddleware(app: Application): void { // manejo de la seguridad del servidor con owasp
		// pendiente para la otra clase
		app.use(hpp());
		app.use(helmet());
		app.use(cors({
			origin: config.CLIENT_URL,
			optionsSuccessStatus: 200,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
		}));
	}

	private routesMiddleware(app: Application): void { // definiciones generales para las rutas
		//
	}

	private globalErrorHandler(app: Application): void { // manejador global de errores de la app
		//
	}

	private async startServer(app: Application): Promise<void> { // la especificación del incialización del server
		//
	}

	private startHttpServer(): void { // config. de un servidor http
		//
	}

	private async createSocketIO(): Promise<void> { // creación de una instancia de servidor para conexiones en realtime
		//
	}

	private socketIOConnections(): void { // verificador de conexiones con el socket
		//
	}
}
