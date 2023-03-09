import {Inject, Service} from 'typedi';
import {TaskRepository} from "../repositories/TaskRepository";
import {CreateTaskDto, TaskDto, TasksListDto, UpdateTaskDto} from "../types/task.dto";
import {FilterQuery} from "../types/task.schema";
import {MaintenanceTaskHydrator} from "../../utils/Helpers";

@Service()
/**
 * Task Service
 */
export default class TaskService {
  taskRepository: TaskRepository;

  taskHydrator: MaintenanceTaskHydrator

  constructor(@Inject() taskRepository: TaskRepository,
              @Inject() taskHydrator: MaintenanceTaskHydrator) {
    this.taskRepository = taskRepository;
    this.taskHydrator = taskHydrator;
  }

  /**
   * Create new task
   *
   * @param taskData
   */
  createTask = async (taskData: CreateTaskDto): Promise<TaskDto> => {
    /**
     * @TODO do the business logic related to tasks here.
     */
    const createdTask = await this.taskRepository.create(taskData);

    return this.taskHydrator.hydrate(createdTask.get());
  }

  /**
   * Update task
   *
   * @param taskData
   */
  updateTask = async (taskData: UpdateTaskDto): Promise<TaskDto> => {
    /**
     * @TODO do the business logic related to tasks here.
     */
    const updatedTask = await this.taskRepository.update(taskData.id, taskData);
    return this.taskHydrator.hydrate(updatedTask.get());
  }

  /**
   * Get all teh tasks
   *
   * @param filters
   */
  getTasks = async (filters: FilterQuery): Promise<TasksListDto> => {
    const retrievedTasks = await this.taskRepository.getAll(filters.offset, filters.limit);

    const hydratedTasks = retrievedTasks.map((task: any) => {
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
