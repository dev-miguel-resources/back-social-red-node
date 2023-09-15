import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { ISignUpData } from '@auth/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { ObjectId } from 'mongodb';

export abstract class SignUpUtility {
	protected signUpData(data: ISignUpData): IAuthDocument {
		const { _id, username, email, uId, password, avatarColor } = data;
		return {
			_id,
			uId,
			username: Generators.firstLetterUppercase(username),
			email: Generators.lowerCase(email),
			password,
			avatarColor,
			createdAt: new Date()
		} as IAuthDocument;
	}

	protected userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
		const { _id, username, email, uId, password, avatarColor } = data;
		return {
			_id: userObjectId,
			authId: _id,
			uId,
			username: Generators.firstLetterUppercase(username),
			email,
			password,
			avatarColor,
			profilePicture: '',
			blocked: [],
			work: '',
			location: '',
			school: '',
			quote: '',
			bgImageVersion: '',
			bgImageId: '',
			followersCount: 0,
			followingCount: 0,
			postsCount: 0,
			notifications: {
				messages: true,
				reactions: true,
				comments: true,
				follows: true
			},
			social: {
				facebook: '',
				instagram: '',
				twitter: '',
				youtube: ''
			}
		} as unknown as IUserDocument;
	}
}
