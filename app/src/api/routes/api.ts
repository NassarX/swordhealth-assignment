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
import hasAccessTask from "../middlewares/hasAccessTask";

const router = Router();
const taskController = Container.get(TaskController);
const authController = Container.get(AuthController);

// Tasks collection routes
router.route('/tasks')
  .get(auth('view_tasks'), validate(getTasksQuerySchema), taskController.getTasks) // view all tasks -> manager
  .post(auth('create_task'), validate(createTaskSchema), taskController.createTask); // create task -> technician

router.route('/tasks/:id')
   .get(auth('view_task'), hasAccessTask, validate(getTaskQuerySchema), taskController.getTask) // view task -> only task owner
   .put(auth('update_task'), hasAccessTask, validate(updateTaskSchema), taskController.updateTask) // update task -> only task owner
   .delete(auth('delete_task'), validate(deleteTaskParamSchema), taskController.deleteTask); // delete task // only manager

router.route('/users/:userId/tasks')
   .get(auth('view_user_tasks'), validate(getUserTasksQuerySchema), taskController.getUserTasks); // view user tasks -> only manager



// Auth routes
router.route('/auth/register').post(validate(registerSchema), authController.register);
router.route('/auth/login').post(validate(loginSchema), authController.login);


router.post('/greeting', (req, res) => {
  const name = req.body;
  console.log(name)
  res.send(`Hello, ${name.toString()}!`);
});



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
