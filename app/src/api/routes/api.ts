import {Request, Response, Router} from 'express';
import { validate } from "../middlewares/validate";
import { Container } from "typedi";
import {
  createTaskSchema,
  deleteTaskParamSchema,
  getTaskQuerySchema,
  getTasksQuerySchema, getUserTasksQuerySchema,
  updateTaskSchema
} from "../types/task.schema";
import {
  registerSchema,
  loginSchema
} from "../types/user.schema";

import TaskController from "../controller/TaskController"
import AuthController from "../controller/AuthController"
import auth from "../middlewares/auth";
import authorizedTo from "../middlewares/authorizedTo";

const router = Router();
const taskController = Container.get(TaskController);
const authController = Container.get(AuthController);

// Auth routes
router.route('/auth/register').post(validate(registerSchema), authController.register);
router.route('/auth/login').post(validate(loginSchema), authController.login);

// Tasks collection routes
router.route('/tasks')
  .get(validate(getTasksQuerySchema),
    auth,
    authorizedTo(['view_tasks']),
    taskController.getTasks) // view all tasks -> manager
  .post(validate(createTaskSchema),
    auth,
    authorizedTo(['create_task']),
    taskController.createTask); // create task -> technician

router.route('/tasks/:id')
   .get(validate(getTaskQuerySchema),
     auth,
     authorizedTo(['view_task']),
     taskController.getTask) // view task -> only task owner
   .put(validate(updateTaskSchema),
     auth,
     authorizedTo(['update_task']),
     taskController.updateTask) // update task -> only task owner
   .delete(validate(deleteTaskParamSchema),
     auth,
     authorizedTo(['delete_task'], { skipOwnershipCheck: false }),
     taskController.deleteTask); // delete task // only manager

router.route('/users/:userId/tasks')
   .get(validate(getUserTasksQuerySchema),
     auth,
     authorizedTo(['view_user_tasks']),
     taskController.getUserTasks); // view user tasks -> only manager


router.get("/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});


router.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});


export default router;
