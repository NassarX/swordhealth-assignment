import { Service } from 'typedi';
import {UserDto} from "../../types/user.dto";
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
   * @param user
   **/
  generateAuthTokens = async (user: UserDto) => {
    const accessTokenExpires = moment().add(Env.config().jwtExpiresIn, 'minutes');
    const accessToken = this.generateToken(user.username, accessTokenExpires.unix(), 'access');
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
   * @param username
   * @param expires
   * @param type
   * @param secret
   *
   * @returns string
   * */
  generateToken = (username: string, expires: number, type: string = 'access', secret = Env.config().appSecret): string => {
    const payload = {
      sub: username,
      iat: moment().unix(),
      exp: expires,
      type,
    };
    return jwt.sign(payload, secret);
  };
}
