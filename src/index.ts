import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { createApp } from "./createApp";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
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