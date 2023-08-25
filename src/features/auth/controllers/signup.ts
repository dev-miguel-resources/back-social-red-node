import { joiValidation } from '@decorators/joi-validation.decorators';
import { signupSchema } from '../schemes/signup';

export class SignUp {

	@joiValidation(signupSchema)
	public async create() {
		// lógica de negocio -> abstracciones de clean code, redis, bdd, transformadores/dtos, colas -> etc...
	}
}
