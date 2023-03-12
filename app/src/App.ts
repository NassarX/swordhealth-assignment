import 'reflect-metadata';

import Database from './providers/Database';
import Express from './providers/Express';
import Logger from './lib/Logger';
import { AmqpProvider } from "./providers/AmqpProvider";

class App {
	// Loads your dotenv file
	public loadConfiguration (): void {
    Logger.info('Configuration :: Booting @ Master...');
  }

  // Loads the Database Pool
	public loadDatabase (): void {
    Logger.info('Database :: Booting @ Master...');

		Database.init();
	}

  // Loads amqp Server connection
	public loadAmqp (): void {
    Logger.info('Server :: Booting @ Master...');

    AmqpProvider.init();
	}

	// Loads your Server
	public loadServer (): void {
    Logger.info('Server :: Booting @ Master...');

    Express.init();
	}

}

export default new App;
