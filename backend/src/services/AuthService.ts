import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db/db";

export class AuthService {
  
  async register(name: string, email: string, password: string) {
    try {
      const hashed = await bcrypt.hash(password, 10);
      const result = await query(
        "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,email",
        [name, email, hashed]
      );
      return result.rows[0];
    } catch (error: any) {
      console.error("Register Error:", error);
      // Handle duplicate email
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }
      throw new Error("Failed to register user");
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      if (!user.rows.length) {
        throw new Error("User not found");
      }
      const valid = await bcrypt.compare(password,user.rows[0].password);
      if (!valid) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" } 
      );
      return { token };
    } catch (error: any) {
      console.error("Login Error:", error);
      // Preserve known errors
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        throw error;
      }
      throw new Error("Login failed");
    }
  }
}