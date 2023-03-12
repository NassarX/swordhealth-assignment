import {TaskDto, TaskNotificationDto} from "../types/task.dto";
import { Service } from "typedi";
import { UserDto } from "../types/user.dto";
import Permission from "../models/Permission";
import User from "../models/User";
import {Anonymizer} from "../../lib/anonymizer";

interface Hydrator {
  hydrate(data: any, optional?: any): any;
}
@Service()
export class MaintenanceTaskHydrator implements Hydrator {
	hydrate(taskData: { [key: string]: any }): TaskDto {
    const anonymizer = new Anonymizer(taskData?.id ?? '1000');
		return {
			id: taskData?.id ?? null,
			title: taskData?.title ?? '',
			summary: anonymizer.anonymize(taskData?.summary ?? ''),
			userId: taskData?.userId ?? null,
			userName: taskData?.user?.username ?? null,
			performedAt: this.hydrateDate(taskData?.performedAt)?.toDateString(),
			createdAt: this.hydrateDate(taskData?.createdAt)?.toLocaleString()
		};
	}

  hydrateNotification(task: TaskDto): TaskNotificationDto {
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
export class UserHydrator implements Hydrator {
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

	private hydrateUserPermissions(permissions: Permission[] | undefined): string[] {
		let permissionsArray: string[] = [];

		if (permissions) {
			permissionsArray = permissions.map(permission => permission.name);
		}
		return permissionsArray;
	}
}
