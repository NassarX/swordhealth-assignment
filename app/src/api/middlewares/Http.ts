import cors from 'cors';
import { Application } from 'express';
import compress from 'compression';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import Log from '../../utils/Logger';
import Env from '../../config/app.config';

class Http {

	public static mount(_express: Application): Application {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: Env.config().maxUploadLimit
		}));

    // Enables handling urlencoded form data
		_express.use(bodyParser.urlencoded({
			limit: parseInt(Env.config().maxUploadLimit),
			parameterLimit: parseInt(Env.config().maxParameterLimit),
			extended: false
		}));

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');

		// Enables the CORS
		_express.use(cors());

		// Enables the "gzip" / "deflate" compression for response
		_express.use(compress());

    // Enables HTTP request logger middleware
    if (Env.config().appEnv === "development") _express.use(morgan('dev'));

		return _express;
	}
}

export default Http;
