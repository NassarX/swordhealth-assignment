import {Request, Response, Router} from 'express';
import { validate } from "../middlewares/validate";
import { Container } from "typedi";
import {
  registerSchema,
  loginSchema
} from "../types/user.schema";

import AuthController from "../controller/AuthController"

const router = Router();
const authController = Container.get(AuthController);


// Auth routes
router.route('/auth/register').post(validate(registerSchema), authController.register);
router.route('/auth/login').post(validate(loginSchema), authController.login);


router.get("/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Sword Health Assignment",
  });
});


router.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});


export default router;
