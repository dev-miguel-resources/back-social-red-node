import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	preset: 'ts-jest', // responsable de ejecutar los archivos de tests con extensiones .ts files
	testEnvironment: 'node', // verificador de confianza con un entorno de node
	verbose: true, // me entrega feedback de los resultados por la terminal
	coverageDirectory: 'coverage', // directorio que aloja los reportes de los tests
	collectCoverage: true, // recolector de informes para el directorio de cobertura
	testPathIgnorePatterns: ['/node_modules/'], // ignorar el directorio de node_modules
	transform: {
		'^.+\\.ts?$': 'ts-jest' // ya le doy la función al ts-jest para que resuelva las extensiones de tests
	},
	testMatch: ['<rootDir>/src/**/test/*.ts'], // se define donde se irán a ejecutar tus archivos de tests
	collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'], // le notificas al recoletor donde si y donde no ir a buscar para generar los reportes
	coverageThreshold: { // definir el alcance de verificaciones de los tests para los reportes
		global: {
			branches: 1,
			functions: 1,
			lines: 1,
			statements: 1
		}
	},
	coverageReporters: ['text-summary', 'lcov'], // archivo de lectura como reporte
	moduleNameMapper: { // registro de directorios de tests sumado a su decorador de alias como representación
		'@bootstrap/(.*)': ['<rootDir>/src/bootstrap/$1'],
    '@configs/(.*)': ['<rootDir>/src/configs/$1'],
    '@auth/(.*)': ['<rootDir>/src/features/auth/$1'],
    '@user/(.*)': ['<rootDir>/src/features/user/$1'],
    '@interfaces/(.*)': ['<rootDir>/src/interfaces/$1'],
    '@decorators/(.*)': ['<rootDir>/src/shared/globals/decorators/$1'],
    '@helpers/(.*)': ['<rootDir>/src/shared/globals/helpers/$1'],
    '@services/(.*)': ['<rootDir>/src/shared/globals/services/$1'],
    '@socket/(.*)': ['<rootDir>/src/shared/globals/sockets/$1'],
    '@workers/(.*)': ['<rootDir>/src/shared/globals/workers/$1'],
		'@mocks/(.*)': ['<rootDir>/src/shared/globals/mocks/$1'],
    '@root/(.*)': ['<rootDir>/src/$1']
	}
};

export default config;

