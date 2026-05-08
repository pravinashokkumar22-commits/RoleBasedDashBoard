import { ExpressMiddlewareInterface } from "routing-controllers";
import { Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser";

export class RoleMiddleware implements ExpressMiddlewareInterface {
  use(req: RequestWithUser, res: Response, next: NextFunction): void {
    if (!req.user || req.user.role !== "admin") {
      throw new Error("Forbidden");
    }
    next();
  }
}