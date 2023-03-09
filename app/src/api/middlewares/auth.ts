import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from "../../utils/ApiError";
const { roleRights } = require('../config/roles');

const verifyCallback = (req: Request, resolve: (value?: unknown) => void, reject: (err: ApiError) => void, requiredRights: string[]) => async (err: Error, user: any, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err: Error) => next(err));
};

export default auth;
