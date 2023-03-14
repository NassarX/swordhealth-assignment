import { Service } from 'typedi';
import TokenService from "./TokenService";
import { LoginUserDto } from "../../types/dtos/user.dto";
import { HydratorInterface } from "../../utils/Helpers";
import { UserRepositoryInterface } from "../../types/interfaces/user.repository.interface";

@Service()
/**
 * User Service
 */
export default class AuthService {
  userRepository: UserRepositoryInterface;
  tokenService: TokenService;
  userHydrator: HydratorInterface

  constructor(userRepository: UserRepositoryInterface, tokenService: TokenService, userHydrator: HydratorInterface) {
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
