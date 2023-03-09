import User from '../models/User';
import { CreateUserDto, UpdateUserDto } from "../types/user.dto";
import { Service } from "typedi";
import { ApiError, NotFoundError } from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import {Op} from "sequelize";
import Role from "../models/Role";
import Permission from "../models/Permission";

@Service()
export class UserRepository {
  create = async (payload: CreateUserDto): Promise<User> => {
    return await User.create(payload);
  };

  update = async (id: number, payload: UpdateUserDto): Promise<User> => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`User with id ${id}`);
    }
    return await (user as User).update(payload);
  };

  getAll = async (offset = 1, limit = 10): Promise<User[]> => {
    return await User.findAll({
      offset: offset,
      limit: limit,
      subQuery: false
    });
  }

  get = async (id: number): Promise<User> => {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          include: [Permission]
        },
      ]
    });
    if (!user) {
        throw new NotFoundError(`User with id ${id}`);
    }
    return user;
  }

  getUserByUserName = async (username: string): Promise<User> => {
    const user = await User.findOne({ where: { username: username },
      include: [
        {
          model: Role,
          include: [Permission]
        },
      ]
    });
    if (!user) {
        throw new NotFoundError(`User with username ${username}`);
    }
    return user;
  }

  delete = async (id: number): Promise<boolean> => {
    const user = await User.destroy({
      where: {id}
    });
    if (!user) {
        throw new NotFoundError(`User with id ${id}`);
    }

    return !!user;
  }

  isEmailTaken = async (email: string, id?: number) => {
    const where: any = { email };
    if (id) {
      where[Op.and] = [{ id: { [Op.ne]: id } }];
    }
    const user = await User.findOne({ where });
    if (user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
    }
  }

  isUserNameTaken = async (username: string, id?: number) => {
    const where: any = { username };
    if (id) {
      where[Op.and] = [{ id: { [Op.ne]: id } }];
    }
    const user = await User.findOne({ where });
    if (user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
    }
  }

  isPasswordMatched = async (user: User, password: string) => {
    if (!user || !(await user.validPassword(password))) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect username/email or password');
    }
  }
}
