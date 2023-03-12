import { Application } from 'express';
import Env from '../config/app.config';
import Log from '../lib/Logger';
import apiRouter from '../api/routes/api';

class Routes {

	public mountApi(_express: Application): Application {
		const apiPrefix = Env.config().apiPrefix;
		Log.info('Routes :: Mounting API Routes...');

		return _express.use(`/${apiPrefix}`, apiRouter);
	}
}

export default new Routes;
