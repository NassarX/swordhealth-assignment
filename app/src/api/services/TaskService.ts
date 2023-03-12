import {Inject, Service} from 'typedi';
import {TaskRepository} from "../repositories/TaskRepository";
import {CreateTaskDto, TaskDto, TasksListDto, UpdateTaskDto} from "../types/task.dto";
import {FilterQuery} from "../types/task.schema";
import {MaintenanceTaskHydrator} from "../utils/Helpers";
import NotificationService from "./NotificationService";

@Service()
/**
 * Task Service
 */
export default class TaskService {
  private taskRepository: TaskRepository;
  private taskHydrator: MaintenanceTaskHydrator
  private notificationService: NotificationService

  constructor(@Inject() taskRepository: TaskRepository,
              @Inject() taskHydrator: MaintenanceTaskHydrator,
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
      const notification = this.taskHydrator.hydrateNotification(hydratedTask);
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
