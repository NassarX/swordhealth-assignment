import { z } from 'zod';

// Task title
const taskTitleSchema = z.string({
  required_error: "Title is required",
  invalid_type_error: "Title must be a string"
});

// Task summary
const taskSummarySchema = z.string({
  required_error: "Summary is required",
  invalid_type_error: "Summary must be a text"
}).max(2500, "Summary max: 2500 characters");

// Task performed date validation can't be after now or before 10 years
const now = new Date();
const tenYearsAgo = new Date(`${now.getFullYear() - 10}-01-01`);
const taskPerformedAtSchema = z.coerce.date({
  required_error: "Performed Date is required",
  invalid_type_error: "Performed Date must be a date (format: yyyy-mm-dd)",
}).min(tenYearsAgo, "Performed Date must be at least 10 years ago")
  .max(now, "Performed Date cannot be in the future" );

// Task|User ID, can be updated to a string or any type in future
const idSchema = z.string()
  .transform((val) => val.trim())
  .refine((val) => !isNaN(+val), {
    message: 'Id must be a valid number',
  });

const taskQueryParamSchema = z.object({
  id: idSchema
});

// For pagination purpose
const filterSchema = z.object({
  limit: z.string().transform((val) => val.trim())
    .refine((val) => !isNaN(+val), {
      message: 'Limit must be a valid number'
    }),
  offset: z.string().transform((val) => val.trim())
    .refine((val) => !isNaN(+val), {
      message: 'offset must be a valid number'
    }),
}).partial();

const createTaskSchema = z.object({
  body: z.object({
    title: taskTitleSchema,
    summary: taskSummarySchema,
    performedAt: taskPerformedAtSchema
  })
});

const updateTaskSchema = z.object({
  params: taskQueryParamSchema,
  body: z.object({
    title: taskTitleSchema,
    summary: taskSummarySchema,
    performedAt: taskPerformedAtSchema
  }).partial(),
});

const getTasksQuerySchema = z.object({
  query: filterSchema
});

const getTaskQuerySchema = z.object({
  params: taskQueryParamSchema
});

const userQueryParamSchema = z.object({
  userId: idSchema
});

const getUserTasksQuerySchema = z.object({
  params: userQueryParamSchema,
  query: filterSchema
});

const deleteTaskParamSchema = z.object({
  params: taskQueryParamSchema
});

type FilterQuery = {
  limit?: number;
  offset?: number;
};

export {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
  getTaskQuerySchema,
  deleteTaskParamSchema,
  getUserTasksQuerySchema,
  FilterQuery,
}
