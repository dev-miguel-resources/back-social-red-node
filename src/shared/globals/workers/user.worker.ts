import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { userService } from '@services/db/user.service';

const log: Logger = logger.createLogger('userWorker');

class UserWorker {
	public async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			//
		} catch (error) {
			//
		}
	}
}

export const userWorker: UserWorker = new UserWorker();
