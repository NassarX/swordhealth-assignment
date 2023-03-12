import SequelizeClient from '../lib/SequelizeClient';
import { getDatabases, DatabaseConfig } from '../config/db.config';

class Database {

	private static configs: DatabaseConfig[] = [];

	/**
   * Initialize database connections pool
   */
	public static async init() {
		this.filterEnabledDatabases();

		try {
			const connections = this.configs.map(config => new SequelizeClient(config));

			Promise.all(connections.map(connection => connection.connect()))
				.then(() => {
					console.log('All database connections established successfully.');
					return Promise.all(connections.map(connection => connection.syncModels()));
				}).then(() => {
					console.log('All models were synchronized successfully.');
				});
		} catch (error) {
			console.error('Unable to initialize the databases:', error);
		}
	}

	private static filterEnabledDatabases(): void {
		Object.values(getDatabases().databases)
			.filter(dbConfig => dbConfig.enable === 'true')
			.forEach(dbConfig => {
				Database.configs.push(dbConfig);
			});
	}
}

export default Database;
