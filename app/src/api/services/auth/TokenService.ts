import { Service } from 'typedi';
import {UserDto} from "../../types/user.dto";
import Env from "../../../config/app.config";

const jwt = require('jsonwebtoken');
const moment = require('moment');

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
    const accessToken = this.generateToken(user.id, accessTokenExpires, 'access');

    //@TODO implement freshToken logic

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
   * @param userId
   * @param expires
   * @param type
   * @param secret
   *
   * @returns string
   * */
  generateToken = (userId: number, expires: number, type: string = 'access', secret = Env.config().appSecret): string => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: 8400, //expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };
}
