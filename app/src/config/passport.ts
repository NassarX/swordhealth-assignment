import passportJwt from 'passport-jwt';
import Env from "../config/app.config";
import {Container} from "typedi";
import {UserRepository} from "../api/repositories/UserRepository";

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const userRepository = Container.get(UserRepository);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Env.config().appSecret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload: any, done) => {
  await userRepository.getUserByUserName(jwt_payload.username.toLowerCase)
    .then((user) => { return done(null, user); })
    .catch((error) => { return done(error, false); });
});

export default jwtStrategy;

/**
 * passport-local The local authentication strategy authenticates users using a username and password.
 * The strategy requires a verify callback, which accepts these credentials and calls done providing a user.
 *
 * passport-jwt This module lets you authenticate endpoints using a JSON web token.
 * It is intended to be used to secure RESTful endpoints without sessions.
 */
