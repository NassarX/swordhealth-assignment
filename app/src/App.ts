import 'reflect-metadata';

import path from 'path';
import dotenv from 'dotenv';
import Database from './loaders/Database';
import Express from './loaders/Express';
import Logger from './utils/Logger';

class App {

	// Loads your dotenv file
	public loadConfiguration (): void {
    Logger.info('Configuration :: Booting @ Master...');

    dotenv.config({ path: path.join(__dirname, '../../.env') });
  }

  	// Loads the Database Pool
	public loadDatabase (): void {
		Logger.info('Database :: Booting @ Master...');

		Database.init();
	}


	// Loads your Server
	public loadServer (): void {
    Logger.info('Server :: Booting @ Master...');

    Express.init();
	}

}

export default new App;