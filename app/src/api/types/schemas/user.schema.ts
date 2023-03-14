import { z } from "zod";

const userUserNameSchema = z.string({
    required_error: "username is required !"
}).min(4, "username must be more than 4 chars");

const userPasswordSchema = z.string({
    required_error: "password is required !"
}).min(6, "password must be more than 6 chars");

const userEmailSchema = z.string({
  required_error: "email is required !"
}).min(5, "email must be more than 4 chars")
  .email("email must be email format !");

const loginSchema = z.object({
  body: z.object({
    username: userUserNameSchema,
    password: userPasswordSchema
  }),
});

const registerSchema = z.object({
  body: z.object({
    username: userUserNameSchema,
    email: userEmailSchema,
    password: userPasswordSchema,
    roleId: z.number({ required_error: "roleId is required!"})
  })
});

type FilterQuery = {
  limit?: number;
  offset?: number;
};

export {
  registerSchema,
  loginSchema,
  FilterQuery
}

