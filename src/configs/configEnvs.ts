import dotenv from 'dotenv';
import { logger } from './configLogs';
import Logger from 'bunyan';

dotenv.config({});

const log: Logger = logger.createLogger('logEnvs');

class Config {
	public DATABASE_URL: string | undefined;
	public JWT_TOKEN: string | undefined;
	public NODE_ENV: string | undefined;
	public SECRET_KEY_ONE: string | undefined;
	public SECRET_KEY_TWO: string | undefined;
	public CLIENT_URL: string | undefined;
	public SERVER_PORT: string | undefined;
	public REDIS_HOST: string | undefined;
	public CLOUD_NAME: string | undefined;
	public CLOUD_API_KEY: string | undefined;
	public CLOUD_API_SECRET: string | undefined;
	public CLOUD_DOMAIN: string | undefined;
	public SALT_ROUND: string | undefined;
	public BASE_PATH: string | undefined;
	public SENDER_EMAIL: string | undefined;
	public SENDER_EMAIL_PASSWORD: string | undefined;
	public RANDOM_BYTES: string | undefined;

	constructor() {
		this.DATABASE_URL = process.env.DATABASE_URL;
		this.JWT_TOKEN = process.env.JWT_TOKEN;
		this.NODE_ENV = process.env.NODE_ENV;
		this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
		this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
		this.CLIENT_URL = process.env.CLIENT_URL;
		this.SERVER_PORT = process.env.SERVER_PORT;
		this.REDIS_HOST = process.env.REDIS_HOST;
		this.CLOUD_NAME = process.env.CLOUD_NAME;
		this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
		this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
		this.CLOUD_DOMAIN = process.env.CLOUD_DOMAIN;
		this.SALT_ROUND = process.env.SALT_ROUND;
		this.BASE_PATH = process.env.BASE_PATH;
		this.SENDER_EMAIL = process.env.SENDER_EMAIL;
		this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
		this.RANDOM_BYTES = process.env.RANDOM_BYTES;
	}

	public validateConfig(): void {
		console.log(this);
		for (const [key, value] of Object.entries(this)) {
			if (value === undefined) {
				//throw new Error(`Configuration ${key} is undefined`);
				log.error(`Configuration ${key} is undefined`);
			}
		}
	}
}

export const config: Config = new Config();
