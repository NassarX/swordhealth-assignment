import {Container, Inject, Service} from 'typedi';
import { CreateTaskDto, TaskDto, TasksListDto, UpdateTaskDto } from "../types/dtos/task.dto";
import { FilterQuery } from "../types/schemas/task.schema";
import { HydratorInterface } from "../utils/Helpers";
import NotificationService from "./NotificationService";
import { TaskRepositoryInterface } from "../types/interfaces/task.repository.interface";
import { TaskServiceInterface } from "../types/interfaces/task.service.interface";

@Service()
/**
 * Task Service
 */
export default class TaskService implements TaskServiceInterface {
  private taskRepository: TaskRepositoryInterface;
  private taskHydrator: HydratorInterface
  private notificationService: NotificationService

  constructor(taskRepository: TaskRepositoryInterface, taskHydrator: HydratorInterface,
              notificationService: NotificationService
  ) {
    this.taskRepository = taskRepository;
    this.taskHydrator = taskHydrator;
    this.notificationService = notificationService;
  }

  /**
   * Create new task
   *
   * @param taskData
   */
  createTask = async (taskData: CreateTaskDto): Promise<TaskDto> => {
    const createdTask = await this.taskRepository.create(taskData);

    return this.taskHydrator.hydrate(createdTask.get());
  }

  /**
   * Update task
   *
   * @param taskData
   */
  updateTask = async (taskData: UpdateTaskDto): Promise<TaskDto> => {
    const updatedTask = await this.taskRepository.update(taskData.id, taskData);
    const hydratedTask = this.taskHydrator.hydrate(updatedTask.get());
    if (hydratedTask.performedAt) {
      const notification = this.taskHydrator.hydrateMessage(hydratedTask);
      this.notificationService.send(notification);
    }
    return this.taskHydrator.hydrate(updatedTask.get());
  }

  /**
   * Get all teh tasks
   *
   * @param filters
   */
  getTasks = async (filters: FilterQuery): Promise<TasksListDto> => {
    const tasks = await this.taskRepository.getAll(filters.offset, filters.limit);
    const hydratedTasks = tasks.map((task: any) => {
      return this.taskHydrator.hydrate(task);
    });

    return {
      offset: filters.offset,
      limit: filters.limit,
      tasks: hydratedTasks
    };
  }

  getTask = async (taskId: number): Promise<TaskDto> => {
    const retrievedTask = await this.taskRepository.get(taskId);

    return this.taskHydrator.hydrate(retrievedTask.get());
  }

  getUserTasks = async (userId: number, filters: FilterQuery): Promise<TasksListDto> => {
    const retrievedTasks = await this.taskRepository.getUserTasks(userId, filters.offset, filters.limit);

    const hydratedTasks = retrievedTasks.map((task: any) => {
      return this.taskHydrator.hydrate(task);
    });

    return {
      userId: userId,
      offset: filters.offset,
      limit: filters.limit,
      tasks: hydratedTasks
    };
  }

  deleteTask = async (taskId: number): Promise<any> => {
    await this.taskRepository.delete(taskId);

    return {
      'taskId': taskId,
      'status': 'Deleted',
      'message': 'Task Deleted Successfully!'
    }
  }
}
