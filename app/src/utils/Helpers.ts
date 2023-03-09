import { Service } from "typedi";
import { UserDto } from "../api/types/user.dto";
import Permission from "../api/models/Permission";
interface Hydrator {
  hydrate(taskData: { [key: string]: any }, optional?: any): any;
}

@Service()
export class UserHydrator implements Hydrator {
  hydrate(userData: { [key: string]: any }, userPermissions?: any): UserDto {
    return {
      id: userData?.id ?? null,
      username: userData?.username ?? '',
      email: userData?.email ?? '',
      role: userData?.role.get().name ?? '',
      permissions: this.hydrateUserPermissions(userPermissions),
    };
  }

  private hydrateUserPermissions(permissions: Permission[] | undefined): string[] {
    let permissionsArray: string[] = [];

    if (permissions) {
      permissionsArray = permissions.map(permission => permission.name);
    }
    return permissionsArray;
  }
}
