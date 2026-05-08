import { app } from "./app";
import { pool } from "./db/db";


async function startServer() 
{
  try {
    await pool.query("SELECT 1");
    console.log("DB Connected");
    app.listen(process.env.BPORT, () => {
      console.log(`Server running on http://localhost:${process.env.BPORT}`);
    });
  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  }
}
startServer();