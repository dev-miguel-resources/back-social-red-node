import bunyan from 'bunyan';

// Design Pattern Singleton: https://refactoring.guru/es/design-patterns/singletons
// SOLID Principle: Single Responsability
class LoggerConfig {
	public createLogger(name: string): bunyan {
		return bunyan.createLogger({ name, level: 'debug' });
	}
}

export const logger: LoggerConfig = new LoggerConfig();
