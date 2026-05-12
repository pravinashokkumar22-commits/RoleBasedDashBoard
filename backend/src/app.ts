import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { ContactController } from "./controllers/ContactController";
import { AdminController } from "./controllers/AdminController";
export const app = createExpressServer({
   cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }, 
  controllers: [
    AuthController,
    UserController,
    ContactController,
    AdminController
  ]
});