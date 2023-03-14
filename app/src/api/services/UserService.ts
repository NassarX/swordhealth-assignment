import {Inject, Service} from 'typedi';
import {CreateUserDto, UpdateUserDto, UserDto, UsersListDto} from "../types/dtos/user.dto";
import {FilterQuery} from "../types/schemas/user.schema";
import {HydratorInterface, UserHydrator} from "../utils/Helpers";
import {UserServiceInterface} from "../types/interfaces/user.service.interface";
import {UserRepositoryInterface} from "../types/interfaces/user.repository.interface";

@Service()
/**
 * User Service
 */
export default class UserService implements UserServiceInterface {
  userRepository: UserRepositoryInterface;

  userHydrator: HydratorInterface

  constructor(userRepository: UserRepositoryInterface, userHydrator: HydratorInterface) {
    this.userRepository = userRepository;
    this.userHydrator = userHydrator;
  }

  /**
   * Create new user
   *
   * @param userData
   */
  createUser = async (userData: CreateUserDto): Promise<UserDto> => {
    // Validate if email | username exists
    await this.userRepository.isEmailTaken(userData.email);
    await this.userRepository.isUserNameTaken(userData.username);

    // Create new user
    const createdUser = await this.userRepository.create(userData);

    // Attach role & permission
    const user = await this.userRepository.get(createdUser.id);

    return this.userHydrator.hydrate(user);
  }

  /**
   * Update User
   *
   * @param userData
   */
  updateUser = async (userData: UpdateUserDto): Promise<UserDto> => {
    /**
     * @TODO do the business logic related to users here.
     */

    await this.userRepository.isEmailTaken(userData.email, userData.id);
    await this.userRepository.isUserNameTaken(userData.username, userData.id);

    const updatedUser = await this.userRepository.update(userData.id, userData);
    return this.userHydrator.hydrate(updatedUser);
  }

  /**
   * Get all teh users
   *
   * @param filters
   */
  getUsers = async (filters: FilterQuery): Promise<UsersListDto> => {
    const users = await this.userRepository.getAll(filters.offset, filters.limit);

    const hydratedUsers = await Promise.all(users.map(async (user: any) => {
      return await this.userHydrator.hydrate(user);
    }));

    return {
      offset: filters.offset,
      limit: filters.limit,
      users: hydratedUsers
    };
  }

  getUser = async (userId: number): Promise<UserDto> => {
    const user = await this.userRepository.get(userId);

    return this.userHydrator.hydrate(user);
  }

  getUserByUserName = async (username: string): Promise<UserDto> => {
    const user = await this.userRepository.getUserByUserName(username);

    return this.userHydrator.hydrate(user);
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
