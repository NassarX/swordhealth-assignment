type BaseTaskDto = {
  title: string;
  summary: string;
  performedAt?: Date | string;
}

type CreateTaskDto = BaseTaskDto & {
    userId: number;
}

type UpdateTaskDto = BaseTaskDto & {
  id: number;
};

type TaskDto = BaseTaskDto & {
  id: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

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
  TaskDto
}
