import { authWorker } from '@workers/auth.worker';
import { BaseQueue } from './base.queue';
import { IAuthJob } from '@auth/interfaces/authJob.interface';

class AuthQueue extends BaseQueue {
	constructor() {
		super('auth');
		this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
	}

	public addAuthUserJob(name: string, data: IAuthJob) {
		this.addJob(name, data);
	}
}

export const authQueue: AuthQueue = new AuthQueue();
