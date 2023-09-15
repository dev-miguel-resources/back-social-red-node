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

const userCache: UserCache = new UserCache();

export class SignUp extends SignUpUtility {
	@joiValidation(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;
		const checkIfUserExist = await authService.getUserByUsernameOrEmail(username, email);
		if (checkIfUserExist) {
			throw new BadRequestError('Invalid credentials for this user');
		}

		const authObjectId: ObjectId = new ObjectId();
		const userObjectId: ObjectId = new ObjectId();
		const uId = `${Generators.generateRandomIntegers(12)}`;
		const passwordHash = await Generators.hash(password);
		const authData: IAuthDocument = SignUp.prototype.signUpData({
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

		// preparar los manejos a la bdd, cache, colas, etc...
		// pendiente de explicar el prototype
		const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
		userDataForCache.profilePicture = `${config.CLOUD_DOMAIN}/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
		await userCache.saveToUserCache(`${userObjectId}`, uId, userDataForCache);
	}
}
