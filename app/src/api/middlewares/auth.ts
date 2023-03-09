import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from "../../utils/ApiError";
import {Container} from "typedi";
import {UserHydrator} from "../../utils/Helpers";

const userHydrator = Container.get(UserHydrator);

const verifyCallback = (req: Request, resolve: (value?: unknown) => void, reject: (err: ApiError) => void, requiredRights: string[]) => async (err: Error, user: any, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate first!'));
  }
  // set user role permission
  const userPermissions = await user.role.getPermissions();
  const userDto = userHydrator.hydrate(user.get(), userPermissions);

  // set user object
  req.user = userDto;

  // check if user has the right to access
  if (requiredRights.length) {
    const hasRequiredRights = requiredRights.some((requiredRight) => userDto.permissions?.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(StatusCodes.FORBIDDEN, "Forbidden! You don't have access !"));
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
