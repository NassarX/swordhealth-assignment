import Task from '../../models/Task';
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export interface TaskRepositoryInterface {
  create(payload: CreateTaskDto): Promise<Task>;

  update(id: number, payload: UpdateTaskDto): Promise<Task>;

  getAll(offset?: number, limit?: number): Promise<Task[]>;

  get(id: number): Promise<Task>;

  getUserTasks(userId: number, offset?: number, limit?: number): Promise<Task[]>;

  delete(id: number): Promise<boolean>;
}
