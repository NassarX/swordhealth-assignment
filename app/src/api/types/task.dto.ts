import {Notification} from "../services/NotificationService";

type BaseTaskDto = {
  title: string;
  summary: string;
  performedAt?: Date | null | string;
}

type CreateTaskDto = BaseTaskDto & {
    userId: number;
}

type UpdateTaskDto = BaseTaskDto & {
  id: number;
};

type TaskDto = BaseTaskDto & {
  id: number;
  userId: number | null,
  userName?: string,
  createdAt?: Date | null | string;
  updatedAt?: Date | null | string;
};

type TaskNotificationDto = Notification & {};

type TasksListDto = {
  userId?: number,
  offset?: number;
  limit?: number;
  tasks?: TaskDto[];
}

export {
  CreateTaskDto,
  UpdateTaskDto,
  TasksListDto,
  TaskDto,
  TaskNotificationDto,
}
