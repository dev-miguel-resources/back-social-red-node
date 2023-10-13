import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { userService } from '@services/db/user.service';
import { UserCache } from '@services/redis/user/user.cache';

const userCache: UserCache = new UserCache();

export class CurrentUserController {

	public async getCurrentUser(req: Request, res: Response): Promise<void> {
		let isUser = false;
		let token = null;
		let user = null;

		const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser?.userId}`)) as IUserDocument;
		const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser?.userId}`);
		if (Object.keys(existingUser).length) {
			isUser = true;
			token = req.session?.jwt;
			user = existingUser;
		}

		res.status(HTTP_STATUS.OK).json({ token, isUser, user });
	}
}
