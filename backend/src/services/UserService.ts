import { query } from "../db/db";
import bcrypt from "bcryptjs";
export class UserService {

  async getAllUsers() {
    const res = await query(
      "SELECT id, name, email FROM users"
    );
    return res.rows;
  }
  async getUserById(id: number) {
  const res = await query(
    "SELECT id, name, email FROM users WHERE id=$1",
    [id]
  );

  if (!res.rows.length) {
    throw new Error("User not found");
  }

  return res.rows[0];
}
  async updateUser(
    id: number,
    name: string,
    email: string,
    password?: string
  ) {
    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const res = await query(
      password
        ? "UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, name, email, role"
        : "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role",
      password
        ? [name, email, hashedPassword, id]
        : [name, email, id]
    );

    if (!res.rows.length) {
      throw new Error("User not found");
    }

    return res.rows[0];
  }
  // delete user
 async deleteUser(id: number) {
  const res = await query(
    "DELETE FROM users WHERE id=$1 RETURNING id",
    [id]
  );
  if (!res.rows.length) {
    throw new Error("User not found");
  }
  return { message: "User deleted successfully" };
}
} 
