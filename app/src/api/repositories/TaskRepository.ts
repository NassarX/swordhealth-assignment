import Task from '../models/Task';
import { CreateTaskDto, UpdateTaskDto } from "../types/task.dto";
import { Service } from "typedi";
import { NotFoundError } from "../../lib/ApiError";
import User from "../models/User";

@Service()
export class TaskRepository {
  create = async (payload: CreateTaskDto): Promise<Task> => {
    return await Task.create(payload);
  };

  update = async (id: number, payload: UpdateTaskDto): Promise<Task> => {
    const task = await Task.findByPk(id, { include: [User] });
    if (!task) {
        throw new NotFoundError(`Task with id ${id}`);
    }
    return await (task as Task).update(payload);
  };

  getAll = async (offset = 0, limit = 10): Promise<Task[]> => {
    return await Task.findAll({
      include: [User],
      offset: offset,
      limit: limit,
      subQuery: false
    });
  }

  get = async (id: number): Promise<Task> => {
    const task = await Task.findByPk(id, { include: [User]});
    if (!task) {
        throw new NotFoundError(`Task with id ${id}`);
    }
    return task;
  }

  getUserTasks = async (userId: number, offset = 1, limit = 10): Promise<Task[]> => {
    return await Task.findAll({
      where: {
        userId: userId
      },
      offset: offset,
      limit: limit,
      subQuery: false
    });
  }

  delete = async (id: number): Promise<boolean> => {
    const task = await Task.destroy({
      where: {id}
    });
    if (!task) {
        throw new NotFoundError(`Task with id ${id}`);
    }

    return !!task;
  }
}
