import { Dialect } from "sequelize";
import path from "path";

export interface DatabaseConfig {
  enable?: 'true' | 'false',
  driver: Dialect,
  host: string,
  user: string,
  password: string,
  database: string,
  port: number
  dialectOptions?: object,
  migrationsDir?: string,
  modelsDir: string,
}

interface DatabasesConfig {
  databases: Record<string, DatabaseConfig>;
}

// @TODO Apply Config validation using Joi | Zod for early error detection of configurations.
export const getDatabases = (): DatabasesConfig => {
	return {
		"databases": {
			"swordhealth_maintenance": {
				'enable': process.env.MAINTENANCE_DB_ENABLE! as 'true' | 'false',
				'driver': process.env.MAINTENANCE_DB_DIALECT! as Dialect,
				'host': process.env.MAINTENANCE_DB_HOST! as string,
				'user': process.env.MAINTENANCE_DB_USER! as string,
				'password': process.env.MAINTENANCE_DB_PASSWORD! as string,
				'database': process.env.MAINTENANCE_DB_NAME! as string,
				'port': parseInt(process.env.MAINTENANCE_DB_PORT! || '3306', 10),
				'modelsDir': path.join(__dirname, '..', 'api', 'models')
			}
		}
	};
};
