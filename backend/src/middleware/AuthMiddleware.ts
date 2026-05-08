import { ExpressMiddlewareInterface } from "routing-controllers";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../types/RequestWithUser";

export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: RequestWithUser, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("AuthMiddleware - Token:", token);
    if (!token){
      throw new Error("No token provided");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: string;
      };
      req.user = decoded;
      next();
    } catch {
      throw new Error("Invalid token");
    }
  }
}