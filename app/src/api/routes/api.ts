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

const router = Router();
const taskController = Container.get(TaskController);
const authController = Container.get(AuthController);

// Tasks Crud routes
router.route('/tasks')
  .get(auth('view_all_tasks'), validate(getTasksQuerySchema), taskController.getTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router.route('/tasks/:id')
   .get(validate(getTaskQuerySchema), taskController.getTask)
   .put(validate(updateTaskSchema), taskController.updateTask)
   .delete(validate(deleteTaskParamSchema), taskController.deleteTask);

router.route('/users/:userId/tasks')
   .get(validate(getUserTasksQuerySchema), taskController.getUserTasks);



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
