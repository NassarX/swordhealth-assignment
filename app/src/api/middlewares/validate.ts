import { Request, Response, NextFunction } from 'express';
import * as z from 'zod';
import { BadRequestError } from '../../lib/ApiError';
import Logger from '../../lib/Logger';


export const validate =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues.map((issue) => issue.message).join(', ');
        Logger.error(message);
        next(new BadRequestError(message, error.issues.map((issue) => issue.message)));
      } else {
        next(error);
      }
    }
  };
