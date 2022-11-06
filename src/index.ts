import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { errors as inputValidationErrors } from "celebrate";
import router from "./router";
import addContext from "./middleware/addContext";
import { AppDataSource } from "./data/dataSource";
import errorHandler from "./middleware/errorHandler";
import ensureRequiredEnvVars from "./middleware/ensureRequiredEnvVars";

async function startServer() {
  ensureRequiredEnvVars();

  await AppDataSource.initialize().catch((e) => {
    console.log("Error connecting to DB");
    throw e;
  });
  console.log("DB connected");

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(addContext);
  app.use(router);
  app.use(inputValidationErrors());
  app.use(errorHandler);

  const PORT = process.env.PORT || 8012;
  app.listen(PORT, () => {
    console.log(`Express server is listening at ${PORT}`);
  });
}

startServer();
