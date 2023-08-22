import { JoiRequestValidationError } from '@helpers/errors/joiValidateError';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type JoiDecorator = (target: unknown, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): JoiDecorator {
	return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		// array de args -> properties
		descriptor.value = async function (...args: [Request]) {
			//
		};
	};
}
