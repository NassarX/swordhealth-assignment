import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import AuthService from '../services/auth/AuthService';
import { Service, Container } from "typedi";
import { CreateUserDto, LoginUserDto } from "../types/dtos/user.dto";
import { UserRepository } from "../repositories/UserRepository";
import { UserHydrator } from "../utils/Helpers";
import TokenService from "../services/auth/TokenService";

@Service()
export default class AuthController {
  userService: UserService;
  authService: AuthService;

  constructor() {
    this.userService = new UserService(Container.get(UserRepository), Container.get(UserHydrator));
    this.authService = new AuthService(Container.get(UserRepository), new TokenService(), Container.get(UserHydrator));
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const createUserDto: CreateUserDto = { ...req.body }
    try {
      const response = await this.userService.createUser(createUserDto);
      res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
      next(error)
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const loginUserDto: LoginUserDto = { ...req.body }

    try {
      const response = await this.authService.authUser(loginUserDto);
      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error)
    }
  }
}
