import { Sequelize } from 'sequelize-typescript';
import { DatabaseConfig } from '../config/db.config';
import User from "../api/models/User";

class SequelizeClient {
	private readonly sequelize: Sequelize;

	constructor(config: DatabaseConfig) {
		this.sequelize = new Sequelize(config.database, config.user, config.password,
			{
				dialect: config.driver,
				host: config.host,
				port: config.port,
				dialectOptions: config.dialectOptions,
				logging: false,
				models: [config.modelsPath]
			});
	}

	public async connect(): Promise<void> {
		try {
			await this.sequelize.authenticate();
			console.log(`Connection to ${this.sequelize.getDatabaseName()} has been established successfully.`);
		} catch (error) {
			console.error(`Unable to connect to the database ${this.sequelize.getDatabaseName()}:`, error);
		}
	}

  public async syncModels(): Promise<void> {
    try {
      await this.sequelize.sync({ force: true });
    } catch (error) {
      console.error('Unable to sync models:', error);
    }
  }

	public getSequelize(): Sequelize {
		return this.sequelize;
	}
}

export default SequelizeClient;
