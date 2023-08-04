import { createClient } from 'redis';
import Logger from 'bunyan';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';

export type RedisClient = ReturnType<typeof createClient>;

// Singleton
/*export abstract class BaseCache {
	client: RedisClient;
	log: Logger;

	constructor() {
		//
	}
}*/