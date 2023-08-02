import { IError } from './error.interface';

// Singleton of Custom Errors
export abstract class CustomError extends Error {
	// Design Pattern Facade: https://refactoring.guru/es/design-patterns/facade
	abstract statusCode: number;
	abstract status: string;

	constructor(message: string) {
		super(message);
	}

	serializeErrors(): IError {
		return {
			message: this.message,
			status: this.status,
			statusCode: this.statusCode
		};
	}
}
