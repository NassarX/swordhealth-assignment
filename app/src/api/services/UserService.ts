import { Inject, Service } from 'typedi';
import { UserRepository } from "../repositories/UserRepository";
import {CreateUserDto, UpdateUserDto, UserDto, UsersListDto} from "../types/user.dto";
import { FilterQuery } from "../types/task.schema";
import { UserHydrator } from "../../utils/Helpers";

@Service()
/**
 * User Service
 */
export default class UserService {
  userRepository: UserRepository;

  userHydrator: UserHydrator

  constructor(@Inject() userRepository: UserRepository, @Inject() userHydrator: UserHydrator) {
    this.userRepository = userRepository;
    this.userHydrator = userHydrator;
  }

  /**
   * Create new user
   *
   * @param userData
   */
  createUser = async (userData: CreateUserDto): Promise<UserDto> => {
    /**
     * @TODO do the business logic related to users here.
     */

    // Validate if email | username exists
    await this.userRepository.isEmailTaken(userData.email);
    await this.userRepository.isUserNameTaken(userData.username);

    // Create new user
    const createdUser = await this.userRepository.create(userData);

    // Attach role & permission
    const user = await this.userRepository.get(createdUser.id);
    const userPermissions = await user.role.getPermissions();

    return this.userHydrator.hydrate(user.get(), userPermissions);
  }

  /**
   * Update task
   *
   * @param userData
   */
  updateUser = async (userData: UpdateUserDto): Promise<UserDto> => {
    /**
     * @TODO do the business logic related to tasks here.
     */

    await this.userRepository.isEmailTaken(userData.email, userData.id);
    await this.userRepository.isUserNameTaken(userData.username, userData.id);

    const updatedTask = await this.userRepository.update(userData.id, userData);
    return this.userHydrator.hydrate(updatedTask.get());
  }

  /**
   * Get all teh users
   *
   * @param filters
   */
  getUsers = async (filters: FilterQuery): Promise<UsersListDto> => {
    const retrievedUsers = await this.userRepository.getAll(filters.offset, filters.limit);

    const hydratedUsers = retrievedUsers.map((user: any) => {
      return this.userHydrator.hydrate(user);
    });

    return {
      offset: filters.offset,
      limit: filters.limit,
      users: hydratedUsers
    };
  }

  getUser = async (userId: number): Promise<UserDto> => {
    const retrievedUser = await this.userRepository.get(userId);

    return this.userHydrator.hydrate(retrievedUser.get());
  }

  deleteUser = async (userId: number): Promise<any> => {
    await this.userRepository.delete(userId);

    return {
      'userId': userId,
      'status': 'Deleted',
      'message': 'User Deleted Successfully!'
    }
  }
}
