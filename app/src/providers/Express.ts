import express from 'express';

import Env from '../config/app.config';
import Routes from './Routes';
import ErrorHandler from './ErrorHandler';
import Bootstrap from './Kernel';
import {Server} from "http";

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
   * Handle server shutdown gracefully
   *
   */
  private shutdownServer(server: Server): void {
    const shutdown = async () => {
      console.log('Closing server gracefully...');
      await new Promise(resolve => server.close(resolve));
      console.log('Server closed.');
      process.exit(0);
    };

    process.on('SIGINT', async () => {
      console.log('Received SIGINT.');
      await shutdown();
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM.');
      await shutdown();
    });
  }

  /**
   * Starts the express server
   */
  public async init(): Promise<any> {
    const port: number = Env.config().port;
    const startServer = async () => {
      const server = this.express.listen(port, () => {
        console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
      }).on('error', _error => {
        console.log('Error occurred on running Server: ', _error.message);
        process.exit(1);
      });

      // Handle server shutdown gracefully
      this.shutdownServer(server);
    }

    await startServer();
  }

}

/** Export the express module */
export default new Express();
