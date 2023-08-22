import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
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
	}),
	email: Joi.string().required().email().messages({
		'string.base': 'Email must be of type string',
		'string.empty': 'Email is a required field',
		'string.email': 'Email must be valid'
	}),
	avatarColor: Joi.string().required().messages({
		'string.base': 'Avatar color be of type string',
		'any.required': 'Avatar color is a required field'
	}),
	avatarImage: Joi.string().required().messages({
		'string.base': 'Avatar image be of type string',
		'any.required': 'Avatar image is a required field'
	})
});

export { signupSchema };

