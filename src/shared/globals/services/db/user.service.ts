import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { UserModel } from '@user/models/user.schema';

class UserService {
	public async addUserData(data: IUserDocument): Promise<void> {
		await UserModel.create(data);
	}

	public async getUserById(userId: string): Promise<IUserDocument> {
		// vamos a seguir trabajando con operators de mongo -> avanzados
		// $match, $lookup, $unwind, $project, aggregate -> escenario de query
	}
}

export const userService: UserService = new UserService();
