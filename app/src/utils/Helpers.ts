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
        performedAt: this.hydrateDate(taskData?.performedAt),
        createdAt: this.hydrateDate(taskData?.createdAt)
      };
  }
  private hydrateDate(date?: string): Date | string {
    if (!date) {
      return (new Date()).toDateString();
    }
    const dateObj = new Date(date);

    //@TODO Parse the formatted date string into a new Date object
    return dateObj.toLocaleString();
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
