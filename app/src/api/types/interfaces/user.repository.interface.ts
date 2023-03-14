import User from '../../models/User';
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

export interface UserRepositoryInterface {
  create(payload: CreateUserDto): Promise<User>;

  update(id: number, payload: UpdateUserDto): Promise<User>;

  getAll(offset?: number, limit?: number): Promise<User[]>;

  get(id: number): Promise<User>;

  getUserByUserName(username: string): Promise<User>;

  delete(id: number): Promise<boolean>;

  isEmailTaken(email: string, id?: number): Promise<void>;

  isUserNameTaken(username: string, id?: number): Promise<void>;

  isPasswordMatched(user: User, password: string): Promise<void>;
}
