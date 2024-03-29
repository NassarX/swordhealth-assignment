import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import { Service, Container } from "typedi";
import { CreateUserDto, UpdateUserDto } from "../types/dtos/user.dto";
import { FilterQuery } from "../types/schemas/user.schema";
import { UserRepository } from "../repositories/UserRepository";
import { UserHydrator } from "../utils/Helpers";

@Service()
export default class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService(Container.get(UserRepository), Container.get(UserHydrator));
  }

  //@manager
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const filterQuery: FilterQuery = {
      limit: parseInt(req.query.limit as string, 10) || 10,
      offset: parseInt(req.query.offset as string, 10) || 1,
    };

    try {
      const response = await this.userService.getUsers(filterQuery);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const createUserDto: CreateUserDto = { ...req.body }

    try {
      const response = await this.userService.createUser(createUserDto);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const updateUserDto: UpdateUserDto = { id: req.params.id, ...req.body }

    try {
      const response = await this.userService.updateUser(updateUserDto);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.getUser(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.deleteUser(parseInt(req.params.id));
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }
}
