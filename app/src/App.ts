import 'reflect-metadata';

import path from 'path';
import dotenv from 'dotenv';
import Logger from './utils/Logger';

class App {

	// Loads your dotenv file
	public loadConfiguration (): void {
    Logger.info('Configuration :: Booting @ Master...');

    dotenv.config({ path: path.join(__dirname, '../../.env') });
  }

}

export default new App;
