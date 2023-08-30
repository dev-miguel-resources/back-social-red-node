import { BaseCache } from '../base.cache';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { ServerError } from '@helpers/errors/serverError';
import { Generators } from '@helpers/generators/generators';

const log: Logger = logger.createLogger('userCache');

export class UserCache extends BaseCache {
	constructor() {
		super('userCache');
	}

	public async saveToUserCache(key: string, userUid: string, createdUser: IUserDocument): Promise<void> {
		const createdAt = new Date();
		const {
			_id,
			uId,
			username,
			email,
			avatarColor,
			blocked,
			blockedBy,
			postsCount,
			profilePicture,
			followersCount,
			followingCount,
			notifications,
			social,
			work,
			location,
			school,
			quote,
			bgImageVersion,
			bgImageId
		} = createdUser;

		const dataToSave = {
			_id: `${_id}`,
			uId: `${uId}`,
			username: `${username}`,
			email: `${email}`,
			avatarColor: `${avatarColor}`,
			createdAt: `${createdAt}`,
			postsCount: `${postsCount}`,
			blocked: JSON.stringify(blocked),
			blockedBy: JSON.stringify(blockedBy),
			profilePicture: `${profilePicture}`,
			followersCount: `${followersCount}`,
			followingCount: `${followingCount}`,
			notifications: JSON.stringify(notifications),
			social: JSON.stringify(social),
			work: `${work}`,
			location: `${location}`,
			school: `${school}`,
			quote: `${quote}`,
			bgImageVersion: `${bgImageVersion}`,
			bgImageId: `${bgImageId}`
		};

		try {
			// observable que se encargue de verificar el cliente de redis
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			await this.client.ZADD('user', { score: parseInt(userUid, 10), value: `${key}` });
			for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
				await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
			}
		} catch (error) {
			log.error(error);
			throw new ServerError('Server Redis error. Try Again.');
		}
	}

	public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
			response.createdAt = new Date(Generators.parseJson(`${response.createdAt}`));
			response.postsCount = Generators.parseJson(`${response.postsCount}`);
			// faltan aún por recuperar

			return response;
		} catch (error) {
			log.error(error);
			throw new ServerError('Server Redis error. Try Again.');
		}
	};
}
