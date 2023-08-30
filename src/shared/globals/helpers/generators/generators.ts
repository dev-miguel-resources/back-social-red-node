import Logger from 'bunyan';
import { logger } from '@configs/configLogs';

const log: Logger = logger.createLogger('generators');

export class Generators {
	static parseJson(property: string) {
		try {
			JSON.parse(property);
		} catch (error) {
			log.error(error);
			return property;
		}

		return JSON.parse(property);
	}
}
