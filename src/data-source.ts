import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  synchronize: process.env.NODE_ENV === "development",
  logging: ['info'],
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  ssl: {
    rejectUnauthorized: false
  }
});