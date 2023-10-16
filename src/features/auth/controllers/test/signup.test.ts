import { Request, Response } from 'express';

jest.useFakeTimers();

describe('SignUp Controller', () => {
	// general rules
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
	});
});
