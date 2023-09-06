import { BaseQueue } from './base.queue';
import { userWorker } from '@workers/user.worker';

class UserQueue extends BaseQueue {

	constructor() {
		super('user');
		this.processJob('addUserToDB', 5, userWorker.addUserToDB);
	}

}
