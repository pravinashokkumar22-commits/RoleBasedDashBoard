import { JsonController, Post, Body } from "routing-controllers";
import { AuthService } from "../services/AuthService";
import { RegisterDTO,LoginDTO }from "../dto/AuthDTO";
 
@JsonController("/auth")
export class AuthController {
  private service = new AuthService();

  @Post("/register")
  async register(@Body() body: RegisterDTO) {
    const user = await this.service.register(
      body.name,
      body.email,
      body.password
    );

    return {
      success: true,
      message: "User registered successfully",
      data: user
    };
  }
  
  @Post("/login")
  async login(@Body() body: LoginDTO) {
    const result = await this.service.login(
      body.email,
      body.password
    );

    return {
      success: true,
      message: "Login successful",
      data: result
    };
  }
}