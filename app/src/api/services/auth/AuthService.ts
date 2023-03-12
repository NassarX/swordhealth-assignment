import { Inject, Service } from 'typedi';
import TokenService from "./TokenService";
import {LoginUserDto} from "../../types/user.dto";
import {UserRepository} from "../../repositories/UserRepository";
import {UserHydrator} from "../../utils/Helpers";

@Service()
/**
 * User Service
 */
export default class AuthService {
  userRepository: UserRepository;
  tokenService: TokenService;
  userHydrator: UserHydrator

  constructor(@Inject() userRepository: UserRepository, @Inject() tokenService: TokenService, @Inject() userHydrator: UserHydrator) {
    this.userRepository  = userRepository;
    this.tokenService = tokenService;
    this.userHydrator = userHydrator;
  }

  authUser = async (loginUser: LoginUserDto) => {
    const user = await this.userRepository.getUserByUserName(loginUser.username);

    // compare hashed passwords
    await this.userRepository.isPasswordMatched(user, loginUser.password)

    // generate auth tokens
    const tokens = await this.tokenService.generateAuthTokens(user.username);

    return {
      user: await this.userHydrator.hydrate(user),
      tokens: tokens
    }
  }

  logout = async () => {
    //@TODO
  }
}
