import {TaskDto, TaskNotificationDto} from "../types/dtos/task.dto";
import { Service } from "typedi";
import { UserDto } from "../types/dtos/user.dto";
import Permission from "../models/Permission";
import User from "../models/User";
import {Anonymizer} from "../../lib/anonymizer";

export interface HydratorInterface {
  hydrate(data: any, optional?: any): any;

  hydrateMessage(data: any): any;
}

@Service()
export class MaintenanceTaskHydrator implements HydratorInterface {
	hydrate(data: { [key: string]: any }): TaskDto {
    const anonymizer = new Anonymizer(data?.id ?? '1000');
		return {
			id: data?.id ?? null,
			title: data?.title ?? '',
			summary: anonymizer.anonymize(data?.summary ?? ''),
			userId: data?.userId ?? null,
			userName: data?.user?.username ?? null,
			performedAt: this.hydrateDate(data?.performedAt)?.toDateString(),
			createdAt: this.hydrateDate(data?.createdAt)?.toLocaleString()
		};
	}

  hydrateMessage(task: TaskDto): TaskNotificationDto {
    return {
      //The tech X performed the task Y on date Z
      content: `The tech ${task.userName} performed the task ${task.title} on date ${task.performedAt}`,
      channels: ['email', 'sms']
    }
  }

	private hydrateDate(date?: null): Date | null {
		if (!date) {
			return null;
		}
		// @TODO Parse the formatted date string into a new Date object
		return new Date(date);
	}
}

@Service()
export class UserHydrator implements HydratorInterface {
	async hydrate(userData: User): Promise <UserDto> {
		const userPermissions = await userData.role.getPermissions();

		return {
			id: userData?.id ?? null,
			username: userData?.username ?? '',
			email: userData?.email ?? '',
			role: userData?.role.get().name ?? '',
			permissions: this.hydrateUserPermissions(userPermissions)
		};
	}

  hydrateMessage(task: TaskDto): any {
    return {} //@TODO can be used later to hydrate users notification messages
  }

	private hydrateUserPermissions(permissions: Permission[] | undefined): string[] {
		let permissionsArray: string[] = [];

		if (permissions) {
			permissionsArray = permissions.map(permission => permission.name);
		}
		return permissionsArray;
	}
}
