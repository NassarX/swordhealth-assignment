import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import TaskService from '../services/TaskService';
import { Service, Inject } from "typedi";
import {CreateTaskDto, UpdateTaskDto} from "../types/task.dto";
import {FilterQuery} from "../types/task.schema";

@Service()
export default class TaskController {
  taskService: TaskService;

  constructor(@Inject() taskService: TaskService) {
    this.taskService = taskService;
  }

  //@manager
  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = 1; // from auth service we get current auth user id

    const filterQuery: FilterQuery = {
      limit: parseInt(req.query.limit as string, 10) || 10,
      offset: parseInt(req.query.offset as string, 10) || 1,
    };

    try {
      const response = await this.taskService.getTasks(filterQuery);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  //@manager
  getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const filterQuery: FilterQuery = {
      limit: parseInt(req.query.limit as string, 10) || 10,
      offset: parseInt(req.query.offset as string, 10) || 1,
    };

    try {
      const response = await this.taskService.getUserTasks(parseInt(userId), filterQuery);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  }

  //@manager || tech
  createTask = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 1; // from auth service we get current auth user id
    const createTaskDto: CreateTaskDto = { ...req.body, userId: userId }

    try {
      const response = await this.taskService.createTask(createTaskDto);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 1; // from auth service we get current auth user id
    const updateTaskDto: UpdateTaskDto = { id: req.params.id, ...req.body, userId: userId }

    try {
      const response = await this.taskService.updateTask(updateTaskDto);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = 1; // from auth service we get current auth user id

    try {
      const response = await this.taskService.getTask(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = 1; // from auth service we get current auth user id

    try {
      const response = await this.taskService.deleteTask(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }
}

