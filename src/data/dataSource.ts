import { DataSource, DataSourceOptions } from "typeorm";
import Scripture from "./entities/Scripture";

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
  entities: [Scripture],
  subscribers: [],
  migrations: [],
};
console.log(dataSourceOptions);

export const AppDataSource = new DataSource(dataSourceOptions);
