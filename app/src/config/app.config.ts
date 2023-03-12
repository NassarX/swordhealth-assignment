import dotenv from "dotenv";
import path from "path";
import fs from "fs";

class Env {

  constructor() {
    const envDir = path.join(__dirname, '../../env');
    const envFiles = fs.readdirSync(envDir)
      .filter(file => file.endsWith('.env'))
      .map(file => path.join(envDir, file));

    for (const envFile of envFiles) {
      dotenv.config({ path: envFile });
    }
  }

	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	// @TODO Apply Config validation using Joi | Zod for early error detection of configurations.
	public config(): any {
    const port = process.env.PORT || 3000;
		const base_url = process.env.APP_URL || 'http://localhost';
    const url = `${base_url}:${port}`;
		const appEnv = process.env.APP_ENV || 'development';
		const appSecret = process.env.APP_SECRET || 'qwerty!';
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '5000';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '5000';
		const isCORSEnabled = process.env.CORS_ENABLED || true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 60;
		const apiPrefix = process.env.API_PREFIX || 'api';

    // AMQP configs
    const tasksExchange = process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE;
    const tasksQueue = process.env.AMQP_MAINTENANCE_TASKS_MANAGER_QUEUE;

		return {
			appSecret,
			apiPrefix,
			isCORSEnabled,
			jwtExpiresIn,
			maxUploadLimit,
			maxParameterLimit,
			port,
			appEnv,
			url,
      tasksExchange,
      tasksQueue
		};
	}
}

export default new Env;
