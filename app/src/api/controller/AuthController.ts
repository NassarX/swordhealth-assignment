import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import AuthService from '../services/auth/AuthService';
import { Service, Inject } from "typedi";
import {CreateUserDto, LoginUserDto, UpdateUserDto} from "../types/user.dto";

@Service()
export default class AuthController {
  userService: UserService;
  authService: AuthService;

  constructor(@Inject() userService: UserService, @Inject() authService: AuthService) {
    this.userService = userService;
    this.authService = authService;
  }

  //@manager || tech
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



// const httpStatus = require('http-status');
// const catchAsync = require('../utils/catchAsync');
// const { authService, userService, tokenService, emailService } = require('../services');
//
// const register = catchAsync(async (req, res) => {
//   const user = await userService.createUser(req.body);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.status(httpStatus.CREATED).send({ user, tokens });
// });
//
// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });
//
// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });
//
// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// const sendVerificationEmail = catchAsync(async (req, res) => {
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// const verifyEmail = catchAsync(async (req, res) => {
//   await authService.verifyEmail(req.query.token);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// module.exports = {
//   register,
//   login,
//   logout,
//   refreshTokens,
//   forgotPassword,
//   resetPassword,
//   sendVerificationEmail,
//   verifyEmail,
// };
