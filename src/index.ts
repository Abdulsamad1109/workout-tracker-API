import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { createApp } from "./createApp";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {

    // Verify environment variables are loaded
    if (!process.env.DB_URL) {
      console.error("❌ Database configuration missing!");
      console.error("Please check your .env file contains DATABASE_URL or DB_HOST");
      process.exit(1);
    }

    // Initialize TypeORM connection
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();