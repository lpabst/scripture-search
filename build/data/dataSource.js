"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3006,
    username: "username",
    password: "password",
    database: "db",
    synchronize: true,
    logging: true,
    entities: ["./entities"],
    subscribers: [],
    migrations: [],
});
