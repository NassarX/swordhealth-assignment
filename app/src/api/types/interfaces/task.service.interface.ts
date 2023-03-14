import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import {TaskDto, TasksListDto} from "../dtos/task.dto";
import {FilterQuery} from "../schemas/task.schema";

export interface TaskServiceInterface {

  createTask(taskData: CreateTaskDto): Promise<TaskDto>;

  updateTask(taskData: UpdateTaskDto): Promise<TaskDto>;

  getTasks(filters: FilterQuery): Promise<TasksListDto>;

  getTask(taskId: number): Promise<TaskDto>;

  getUserTasks(userId: number, filters: FilterQuery): Promise<TasksListDto>;

  deleteTask(taskId: number): Promise<any>;
}
