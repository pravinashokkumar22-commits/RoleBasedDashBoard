import {JsonController,Get,Put,Delete,Param,Body,Req,UseBefore}from "routing-controllers";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import { RequestWithUser } from "../types/RequestWithUser";
import { RegisterDTO } from "../dto/AuthDTO";
@JsonController("/users")
@UseBefore(AuthMiddleware)
export class UserController {
  private service = new UserService();

  // GET all users
  @Get("/")
  @UseBefore(RoleMiddleware)
  getAllUsers() {
    return this.service.getAllUsers();
  }
   // Logged-in user - see their own profile
  @Get("/me")
  getMyProfile(@Req() req:RequestWithUser ) {
    return this.service.getUserById(req.user.id);
  }

  @Put("/:id")
  async updateUser(
  @Param("id") id: number,
  @Body() body: RegisterDTO,
  @Req() req: RequestWithUser
) {
  const loggedInUser = req.user;
  console.log("Logged-in user:", loggedInUser);

  if (loggedInUser.role !== "admin" && loggedInUser.id !== id) {
    throw new Error("You can update only your own profile");
  }

  const updatedUser = await this.service.updateUser(
    id,
    body.name,
    body.email,
    body.password,
    
  );

  // Generate new token (if same user updated)
  let token = null;
  if (loggedInUser.id === id) {
    token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
  }

  return {
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  };
}
  //  DELETE USER
  @Delete("/:id")
  async deleteUser(
    @Param("id") id: number,
    @Req() req: RequestWithUser 
  ) {
    const loggedInUser = req.user;
    if (loggedInUser.role !== "admin" && loggedInUser.id !== id) {
      throw new Error("You can delete only your own account");
    }
    await this.service.deleteUser(id);
    return {
      success: true,
      message: "User deleted successfully"
    };
}
}
