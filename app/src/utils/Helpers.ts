import { TaskDto } from "../api/types/task.dto";
import { Service } from "typedi";
import { UserDto } from "../api/types/user.dto";
import Permission from "../api/models/Permission";
interface Hydrator {
  hydrate(taskData: { [key: string]: any }, optional?: any): any;
}
@Service()
export class MaintenanceTaskHydrator implements Hydrator {
  hydrate(taskData: { [key: string]: any }): TaskDto {
    return {
        id: taskData?.id ?? null,
        title: taskData?.title ?? '',
        summary: taskData?.summary ?? '',
        userId: taskData?.userId ?? null,
        performedAt: this.hydrateDate(taskData?.performedAt)?.toLocaleString(),
        createdAt: this.hydrateDate(taskData?.createdAt)?.toLocaleString()
      };
  }
  private hydrateDate(date?: null): Date | null {
    if (!date) {
      return null;
    }
    //@TODO Parse the formatted date string into a new Date object
    return new Date(date);
  }
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
