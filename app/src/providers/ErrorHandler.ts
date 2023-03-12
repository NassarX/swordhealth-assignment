import { Request, Response, NextFunction, Application } from 'express';
import { ApiError } from '../lib/ApiError';
import Logger from '../lib/Logger';

class ErrorHandler {
	static handle = (_express: Application): Application => {
		const handler = async(err: ApiError, req: Request, res: Response, next: NextFunction) => {
			const statusCode = err.statusCode || 500;
			Logger.error(`${statusCode} - ${err.toString()}`);
			res.status(statusCode).send({
				success: false,
				message: err.message,
				rawErrors: err.rawErrors?.length ? err.rawErrors : undefined,
				stack: err.stack
			});
		};

		_express.use(handler);

		return _express;
	};

	static initializeUnhandledException = () => {
		process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
			Logger.error(`${reason.name}: ${reason.message}`);
			Logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
			process.exitCode = 1;
		});

		process.on('uncaughtException', (err: Error) => {
			Logger.error(`${err.name}: ${err.message}`);
			Logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
			process.exitCode = 1;
		});
	};
}

export default ErrorHandler;
