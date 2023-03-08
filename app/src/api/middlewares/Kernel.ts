import { Application } from 'express';

import Http from './Http';

class Kernel {
	public static init (_express: Application): Application {

		// Mount basic express apis middleware
		_express = Http.mount(_express);

    // Loads the passport configuration
		//_express = Passport.mountPackage(_express);
    // jwt authentication
    //app.use(passport.initialize());
    //passport.use('jwt', jwtStrategy);


		return _express;
	}
}

export default Kernel;
