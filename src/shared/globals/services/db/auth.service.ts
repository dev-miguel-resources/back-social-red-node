import { IAuthDocument } from '@auth/interfaces/authDocument.interface';
import { AuthModel } from '@auth/models/auth.schema';

class AuthService {
	public async createAuthUser(data: IAuthDocument): Promise<void> {
		await AuthModel.create(data);
	}
}

export const authService: AuthService = new AuthService();

