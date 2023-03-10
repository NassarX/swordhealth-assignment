import { Application } from 'express';
import passport from 'passport';
import jwtStrategy from "../../config/passport";
import Http from './Http';

class Kernel {
	public static init (_express: Application): Application {

		// Mount basic express apis middleware
		_express = Http.mount(_express);

    // Loads the passport configuration || jwt authentication
    passport.initialize();
    passport.use('jwt', jwtStrategy);

		return _express;
	}
}

export default Kernel;
