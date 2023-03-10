import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/ApiError';
import { UserDto } from "../types/user.dto";
import TaskService from "../services/TaskService";
import {Container} from "typedi";

const taskService = Container.get(TaskService);

const hasAccessTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as UserDto;
    const taskId = parseInt(req.params.id);
    const task = await taskService.getTask(taskId);

    console.log(user.id, task.userId);

    if (user.id !== task.userId) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have access to this task!'));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default hasAccessTask;
