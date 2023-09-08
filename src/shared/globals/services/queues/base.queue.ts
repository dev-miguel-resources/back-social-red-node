import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { ExpressAdapter, createBullBoard, BullAdapter } from '@bull-board/express';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';
import { IUserJob } from '@user/interfaces/userJob.interface';
import { IAuthJob } from '@auth/interfaces/authJob.interface';

type IBaseJobData = IUserJob | IAuthJob;

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

// Singleton
export abstract class BaseQueue {
	queue: Queue.Queue;
	log: Logger;

	constructor(queueName: string) {
		this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
		bullAdapters.push(new BullAdapter(this.queue));
		bullAdapters = [...new Set(bullAdapters)];
		serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath('/queues');

		createBullBoard({
			queues: bullAdapters,
			serverAdapter
		});

		// eventos a escuchar -> observabilidad
		this.log = logger.createLogger(`${queueName}Queue`);

		this.queue.on('completed', (job: Job) => {
			//job.remove(); pendiente por descomentar
		});

		this.queue.on('global:completed', (jobId: string) => {
			this.log.info(`Job ${jobId} completed`);
		});

		this.queue.on('global:stalled', (jobId: string) => {
			this.log.info(`Job ${jobId} is stalled`);
		});
	}

	protected addJob(name: string, data: IBaseJobData): void {
		this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
	}

	protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
		this.queue.process(name, concurrency, callback);
	}
}
