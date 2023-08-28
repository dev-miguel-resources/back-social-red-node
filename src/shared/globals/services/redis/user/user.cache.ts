import { BaseCache } from '../base.cache';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { ServerError } from '@helpers/errors/serverError';
// transformadores pendientes

const log: Logger = logger.createLogger('userCache');

export class UserCache extends BaseCache {

	constructor() {
		super('userCache');
	}

	public async saveToUserCache(key: string, userUid: string, createdUser: IUserDocument): Promise<void> {
		//
	}

	public async getUserFromCache(userId: string): Promise<void> {
		//
	}
}
