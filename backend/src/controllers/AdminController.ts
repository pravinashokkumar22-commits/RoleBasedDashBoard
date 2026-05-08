import { JsonController, Get, UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { RoleMiddleware } from "../middleware/RoleMiddleware";

@JsonController("/admin")
@UseBefore(AuthMiddleware)
export class AdminController {
  @Get("/")
  @UseBefore(RoleMiddleware) 
  adminOnly() {
    return { message: "Admin access granted" };
  }
}