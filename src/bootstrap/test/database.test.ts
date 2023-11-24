import mongoose, { connect } from 'mongoose';
import { FAILED_PATH_DB } from '@mocks/database.mock';
import { config } from '@configs/configEnvs';
import { redisConnection } from '@services/redis/redis.connection';

jest.useFakeTimers();
jest.mock('@configs/configEnvs');
jest.mock('@services/redis/redis.connection');

describe('Database connections', () => {
	beforeEach((done: jest.DoneCallback) => {
		jest.resetAllMocks();
		done();
	});

	afterEach((done: jest.DoneCallback) => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		mongoose.connection.close();
		done();
	});

	// INTEGRATION TEST 1
	it('Should throw an error if database does not connect', () => {
		// GIVEN
		mongoose.connect = jest.fn(() => {
			throw new Error('Error connecting to database');
		});
		const expectedUrl = FAILED_PATH_DB;

		// THEN
		expect(() => {
			connect(expectedUrl);
		}).toThrowError(/Error connecting to database/);
	});

	// INTEGRATION TEST 2
	it('Should must be connect to database mongo connection and call redis connection', done => {

		// GIVEN
		const spy = jest.spyOn(mongoose, 'connect');
		const expectedUrl = `${config.DATABASE_URL}`;
		//const badPath = FAILED_PATH_DB;

		// WHEN -> previous execution spy
		connect(expectedUrl);
		jest.spyOn(redisConnection, 'connect');

		// THEN
		expect(spy).toHaveBeenCalledWith(expectedUrl);
		expect(spy).toHaveBeenCalledTimes(1);
		done();
	});
});

