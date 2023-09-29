import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joi-validation.decorators';
import { signupSchema } from '../schemes/signup';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { ObjectId } from 'mongodb';
import { Generators } from '@helpers/generators/generators';
import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { SignUpUtility } from './utilities/signup.utility';
import { uploads } from '@helpers/cloudinary/cloudinaryUploads';
import { UploadApiResponse } from 'cloudinary';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { config } from '@configs/configEnvs';
import { UserCache } from '@services/redis/user/user.cache';
import { omit } from 'lodash';
import { authQueue } from '@services/queues/auth.queue';
import { userQueue } from '@services/queues/user.queue';
import HTTP_STATUS from 'http-status-codes';

const userCache: UserCache = new UserCache();

export class SignUpController extends SignUpUtility {
	@joiValidation(signupSchema)
	public async register(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;
		const checkIfUserExist = await authService.getUserByUsernameOrEmail(username, email);
		if (checkIfUserExist) {
			throw new BadRequestError('Invalid credentials for this user');
		}

		const authObjectId: ObjectId = new ObjectId();
		const userObjectId: ObjectId = new ObjectId();
		const uId = `${Generators.generateRandomIntegers(12)}`;
		const passwordHash = await Generators.hash(password);
		const authData: IAuthDocument = SignUpController.prototype.signUpData({
			_id: authObjectId,
			uId: uId,
			username,
			email,
			password: passwordHash,
			avatarColor
		});

		const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`)) as UploadApiResponse;
		if (!result?.public_id) {
			throw new BadRequestError('File upload: Error ocurred. Try again.');
		}

		const userDataForCache: IUserDocument = SignUpController.prototype.userData(authData, userObjectId);
		userDataForCache.profilePicture = `${config.CLOUD_DOMAIN}/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
		await userCache.saveToUserCache(`${userObjectId}`, uId, userDataForCache);

		authQueue.addAuthUserJob('addAuthUserToDB', { value: userDataForCache });
		omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
		userQueue.addUserJob('addUserToDB', { value: userDataForCache });

		const userJwt: string = SignUpController.prototype.signToken(authData, userObjectId);
		req.session = { jwt: userJwt };

		res
			.status(HTTP_STATUS.CREATED)
			.json({ message: 'User created succesfully', user: userDataForCache, token: userJwt });
	}
}
