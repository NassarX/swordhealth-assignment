import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from "../../utils/ApiError";
import {UserDto} from "../types/user.dto";

const verifyCallback = (req: Request, resolve: (value?: unknown) =>
  void, reject: (err: ApiError) => void, requiredRights: string[]) =>
  async (err: Error, user: UserDto, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate first!'));
  }
  req.user = user;

  //check if user has the right to access
  if (requiredRights.length) {
     const hasRequiredRights = requiredRights.some((requiredRight) => user.permissions?.includes(requiredRight));
     if (!hasRequiredRights && parseInt(req.params.id) !== user.id) {
       return reject(new ApiError(StatusCodes.FORBIDDEN, `Forbidden! You don't have access to ${requiredRights}!`));
     }
   }
   resolve();
};

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  }).then(() => next())
    .catch((err: Error) => next(err));
};

export default auth;
