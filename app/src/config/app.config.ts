import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

class Env {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	// @TODO Apply Config validation using Joi | Zod for early error detection of configurations.
	public static config(): any {
		dotenv.config({ path: path.join(__dirname, '../../.env') });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const appEnv = process.env.APP_ENV || 'development';
		const port = process.env.PORT || 3000;
		const appSecret = process.env.APP_SECRET || 'qwerty!';
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '5000';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '5000';

		const isCORSEnabled = process.env.CORS_ENABLED || true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		const apiPrefix = process.env.API_PREFIX || 'api';

		const logDays = process.env.LOG_DAYS || 10;

		return {
			appSecret,
			apiPrefix,
			isCORSEnabled,
			jwtExpiresIn,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			port,
			appEnv,
			url
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static init(_express: Application): Application {
		_express.locals.app = this.config();
		return _express;
	}
}

export default Env;
