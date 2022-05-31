import { DataSource, DataSourceOptions } from "typeorm";
import User from "./entities/User";
import RefreshToken from "./entities/RefreshToken";
import EmailVerificationToken from "./entities/EmailVerificationToken";
import Shop from "./entities/Shop";
import Product from "./entities/Product";

const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  // set logging to true to see what typeorm is doing under the hood
  logging: false,
  entities: [User, RefreshToken, EmailVerificationToken, Shop, Product],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
