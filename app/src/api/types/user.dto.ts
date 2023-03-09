type BaseUserDto = {
  username: string,
  email: string
}

type CreateUserDto = BaseUserDto & {
  roleId: number,
  password: string
}

type UpdateUserDto = BaseUserDto & {
  roleId: number,
  id: number
};

type LoginUserDto = {
  username: string,
  password: string
}

type UserDto = BaseUserDto & {
  id: number,
  role: string,
  permissions?: string[]
}

type UsersListDto = {
  offset?: number,
  limit?: number
  users?: UserDto[];
}

export {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  UsersListDto,
  UserDto
}
