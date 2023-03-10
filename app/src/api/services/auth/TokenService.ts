import { Service } from 'typedi';
import Env from "../../../config/app.config";
import jwt from 'jsonwebtoken';
import moment from 'moment';

@Service()
/**
 * User Service
 */
export default class TokenService {

  /***
   * Generate auth tokens
   *
   * @param userIdentifier
   **/
  generateAuthTokens = async (userIdentifier: string) => {
    const accessTokenExpires = moment().add(Env.config().jwtExpiresIn, 'minutes');
    const accessToken = this.generateToken(userIdentifier, accessTokenExpires.unix(), 'access');
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      }
    }
  };

  /**
   * Generate token
   *
   * @param identifier
   * @param expires
   * @param type
   * @param secret
   *
   * @returns string
   * */
  generateToken = (identifier: string, expires: number, type: string = 'access', secret = Env.config().appSecret): string => {
    const payload = {
      sub: identifier,
      iat: moment().unix(),
      exp: expires,
      type,
    };
    return jwt.sign(payload, secret);
  };

  /**
   * Refresh auth tokens
   *
   * @param refreshToken
   **/
  refreshAuth = (refreshToken: string) => {
    //@TODO
  }
}
