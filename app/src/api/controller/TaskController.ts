import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import TaskService from '../services/TaskService';
import {Service, Inject, Container} from "typedi";
import { CreateTaskDto, UpdateTaskDto } from "../types/dtos/task.dto";
import { FilterQuery } from "../types/schemas/task.schema";
import { ApiError } from "../../lib/ApiError";
import { UserDto } from "../types/dtos/user.dto";
import {MaintenanceTaskHydrator, UserHydrator} from "../utils/Helpers";
import {TaskRepository} from "../repositories/TaskRepository";
import {TaskServiceInterface} from "../types/interfaces/task.service.interface";
import NotificationService from "../services/NotificationService";
import {NotificationServiceInterface} from "../types/interfaces/notification.service.interface";

@Service()
export default class TaskController {
  taskService: TaskServiceInterface;

  constructor() {
    this.taskService =
      new TaskService(Container.get(TaskRepository),
        Container.get(MaintenanceTaskHydrator), Container.get(NotificationService))
  }

  getTasks = (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authUser = req.user as UserDto;
    if (!authUser) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate!');
    }

    const filterQuery: FilterQuery = {
      limit: parseInt(req.query.limit as string, 10) || 10,
      offset: parseInt(req.query.offset as string, 10) || 0,
    };

    try {
      const response = await this.taskService.getTasks(filterQuery);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  });

  getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const filterQuery: FilterQuery = {
      limit: parseInt(req.query.limit as string, 10) || 10,
      offset: parseInt(req.query.offset as string, 10) || 0,
    };

    try {
      const response = await this.taskService.getUserTasks(parseInt(userId), filterQuery);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  }

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as UserDto;
    if (!authUser) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate!');
    }

    const createTaskDto: CreateTaskDto = { ...req.body, userId: authUser.id }
    try {
      const response = await this.taskService.createTask(createTaskDto);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as UserDto;
    if (!authUser) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate!');
    }
    const updateTaskDto: UpdateTaskDto = { id: req.params.id, ...req.body, userId: authUser.id }

    try {
      const response = await this.taskService.updateTask(updateTaskDto);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.taskService.getTask(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.taskService.deleteTask(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }
}

