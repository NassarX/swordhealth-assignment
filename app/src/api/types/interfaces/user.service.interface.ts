import {CreateUserDto, UpdateUserDto, UserDto, UsersListDto} from "../dtos/user.dto";
import {FilterQuery} from "../schemas/user.schema";

export interface UserServiceInterface {
  createUser(userData: CreateUserDto): Promise<UserDto>;

  updateUser(userData: UpdateUserDto): Promise<UserDto>;

  getUsers(filters: FilterQuery): Promise<UsersListDto>;

  getUser(userId: number): Promise<UserDto>;

  getUserByUserName(username: string): Promise<UserDto>;

  deleteUser(userId: number): Promise<any>;
}
