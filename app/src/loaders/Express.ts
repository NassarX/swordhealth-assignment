import express from 'express';

import Env from '../config/app.config';
import Routes from './Routes';
import ErrorHandler from './ErrorHandler';
import Bootstrap from './Kernel';

class Express {
	/**
	 * Create the express object
	 */
	public express: express.Application;

	/**
	 * Initializes the express server
	 */
	constructor() {
		this.express = express();

		this.mountMiddlewares();
		this.mountRoutes();
		this.mountErrorHandler();
	}

	/**
	 * Mounts all the defined middlewares
	 */
	private mountMiddlewares(): void {
		this.express = Bootstrap.init(this.express);
	}

	/**
	 * Mounts all the defined routes
	 */
	private mountRoutes(): void {
		this.express = Routes.mountApi(this.express);
	}

	/**
	 * Registering Exception / Error Handlers
	 */
	private mountErrorHandler(): void {
		ErrorHandler.initializeUnhandledException();
		this.express = ErrorHandler.handle(this.express);
	}

	/**
	 * Starts the express server
	 */
	public init(): any {
		const port: number = Env.config().port;
		const startServer = async() => {
			this.express.listen(port, () => {
				return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		  }).on('error', _error => {
			  return console.log('Error occurred: ', _error.message);
			});
		};

		startServer();
	}
}

/** Export the express module */
export default new Express();
