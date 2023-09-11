import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { ISignUpData } from '@auth/interfaces/signUpData.interface';
import { Generators } from '@helpers/generators/generators';

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
}
