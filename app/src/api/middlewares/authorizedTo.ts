import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../lib/ApiError';
import { UserDto } from "../types/dtos/user.dto";
import TaskService from "../services/TaskService";
import {Container} from "typedi";

const taskService = Container.get(TaskService);

const hasAccessTo = (user: UserDto, requiredRights: string[]) => {
  return new Promise((resolve: (value?: unknown) => void, reject: (err: ApiError) => void) => {
    //check if user has the right to access to specific route|service
    if (requiredRights.length) {
      const hasRequiredRights = requiredRights.some((requiredRight) => user.permissions?.includes(requiredRight));
      if (!hasRequiredRights) {
        return reject(new ApiError(StatusCodes.FORBIDDEN, `Forbidden! You don't have access to ${requiredRights}!`));
      }
    }

    resolve();
  });
}

const hasAccessOn = async (user: UserDto, resourceId: any) => {
  const task = await taskService.getTask(parseInt(resourceId));

  //check if user has the right to access on specific resource
  //@TODO make it more dynamic by send resource ownership critira to check on
  if (user.id !== task.userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden!, You do not have access on this resource!');
  }
}

const authorizedTo = (requiredRights: string[], options?: { skipOwnershipCheck?: boolean }) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as UserDto;
    await hasAccessTo(user, requiredRights)
    if (req.params.id && !options?.skipOwnershipCheck) {
      await hasAccessOn(user, req.params.id);
    }

    next();
  } catch (err) {
    next(err);
  }
}

export default authorizedTo;
