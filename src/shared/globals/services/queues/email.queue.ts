import { BaseQueue } from './base.queue';
import { emailWorker } from '@workers/email.worker';
import { IEmailJob } from '@user/interfaces/emailJob.interface';

class EmailQueue extends BaseQueue {

	constructor() {
		super('emails');
		this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail);
	}

	public addEmailJob(name: string, data: IEmailJob): void {
		this.addJob(name, data);
	}
}

export const emailQueue: EmailQueue = new EmailQueue();
