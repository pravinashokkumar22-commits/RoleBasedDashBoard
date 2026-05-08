import { query } from "../db/db";

export class ContactService {
  async createContact(full_name: string, email: string, message: string) {
    try {
      const res = await query(
        "INSERT INTO contact_submissions(full_name,email,message) VALUES($1,$2,$3) RETURNING *",
        [full_name, email, message]
      );

      return res.rows[0];

    } catch (error: any) {
      console.error("Create Contact Error:", error);
      // handle specific DB errors
      if (error.code === "23502") {
        // NOT NULL violation
        throw new Error("All fields are required");
      }
      throw new Error("Failed to create contact");
    }
  }
}