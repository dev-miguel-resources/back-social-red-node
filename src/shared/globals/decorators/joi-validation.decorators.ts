import { JoiRequestValidationError } from '@helpers/errors/joiValidateError';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type JoiDecorator = (target: unknown, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): JoiDecorator {
	// lógica del decorador
	return (_target: unknown, _key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		// array de args -> properties
		descriptor.value = async function (...args: [Request]) {
			const req: Request = args[0]; // destructurar la propiedad req
			const { error } = await Promise.resolve(schema.validate(req.body));
			if (error?.details) {
				throw new JoiRequestValidationError(error.details[0].message);
			}
			return originalMethod.apply(this, args); // retorna todo de manera normal -> cuando no haya errores
		};
		return descriptor; // propage su persistencia con su contexto final
	};
}
