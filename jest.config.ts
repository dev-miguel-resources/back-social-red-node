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
};

export default config;

