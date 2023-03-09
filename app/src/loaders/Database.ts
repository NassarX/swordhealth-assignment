import SequelizeClient from '../lib/SequelizeClient';
import Databases, { DatabaseConfig } from '../config/db.config';

class Database {

	private static configs: DatabaseConfig[] = [];

	/**
   * Initialize database connections pool
   */
	public static async init() {
		this.filterEnabledDatabases();

		try {
      const connections = this.configs.map(config => new SequelizeClient(config));

      await Promise.all(connections.map(connection => connection.connect()));
      console.log('All database connections established successfully.');

      console.log('All models being synchronized now .....');
      await Promise.all(connections.map((connection) => connection.syncModels()));
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Unable to initialize the databases:', error);
    }
  }

	private static filterEnabledDatabases(): void {
		Object.values(Databases.databases)
			.filter(dbConfig => dbConfig.enable === 'true')
			.forEach(dbConfig => {
				Database.configs.push(dbConfig);
			});
	}
}

export default Database;
