import { Inject, Service } from 'typedi';
import TokenService from "./TokenService";
import {LoginUserDto, UserDto} from "../../types/user.dto";
import {UserRepository} from "../../repositories/UserRepository";
import {UserHydrator} from "../../../utils/Helpers";

@Service()
/**
 * User Service
 */
export default class AuthService {
  userRepository: UserRepository;
  tokenService: TokenService;
  userHydrator: UserHydrator

  constructor(@Inject() userRepository: UserRepository, @Inject() tokenService: TokenService, @Inject() userHydrator: UserHydrator) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.userHydrator = userHydrator;
  }

  authUser = async (user: LoginUserDto) => {
    const userInstance = await this.userRepository.getUserByUserName(user.username);
    await this.userRepository.isPasswordMatched(userInstance, user.password)

    // get and attach user permissions
    const userPermissions = await userInstance.role.getPermissions();
    const userDto = this.userHydrator.hydrate(userInstance.get(), userPermissions);

    // generate auth tokens
    const tokens = await this.tokenService.generateAuthTokens(userDto);
    return {
      user: userDto,
      tokens: tokens
    }
  }



  /**
   * Refresh auth tokens
   *
   * @param refreshToken
   **/
  refreshAuth = (refreshToken: string) => {
    //@TODO
  }



}
