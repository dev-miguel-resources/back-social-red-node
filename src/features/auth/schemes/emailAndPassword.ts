import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		'string.base': 'Email must be a string',
		'string.required': 'Email is a required field',
		'string.email': 'Email must be a valid format'
	})
});

const passwordSchema: ObjectSchema = Joi.object().keys({
	password: Joi.string().required().min(4).max(8).messages({
		'string.base': 'Password must be a string',
		'string.min': 'Password must be at least four characters',
		'string.max': 'Password must be at most eight characters',
		'string.email': 'Email must be valid format'
	}),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.required': 'Confirm password is a required field',
		'any.only': 'Passwords should match'
	})
});

export { emailSchema, passwordSchema };
