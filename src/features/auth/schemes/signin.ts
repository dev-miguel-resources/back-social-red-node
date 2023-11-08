import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
	username: Joi.string().required().min(4).max(8).messages({
		'string.base': 'Username must be of type string',
		'string.empty': 'Username is a required field',
		'string.min': 'Username must be at least four characters',
		'string.max': 'Username must be at most eight characters'
	}),
	password: Joi.string().required().min(4).max(8).messages({
		'string.base': 'Password must be of type string',
		'string.empty': 'Password is a required field',
		'string.min': 'Password must be at least four characters',
		'string.max': 'Password must be at most eight characters'
	})
});

export { loginSchema };
