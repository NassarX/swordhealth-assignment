import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from "../../lib/ApiError";
import {UserDto} from "../types/dtos/user.dto";

const verifyCallback = (
  req: Request,
  resolve: (value?: unknown) => void,
  reject: (err: ApiError) => void
) => async (err: Error, user: UserDto, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate first!'));
  }
  req.user = user;

  resolve();
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  }).then(() => next())
    .catch((err: Error) => next(err));
};

export default auth;
