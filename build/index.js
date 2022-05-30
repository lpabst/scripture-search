"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router_1 = __importDefault(require("./router"));
const addContext_1 = __importDefault(require("./middleware/addContext"));
const dataSource_1 = require("./data/dataSource");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(addContext_1.default);
        app.use(router_1.default);
        yield dataSource_1.AppDataSource.initialize().catch(e => {
            console.log('Error connecting to DB');
            throw e;
        });
        console.log('DB connected');
        const PORT = process.env.PORT || 8012;
        app.listen(PORT, () => {
            console.log(`Express server is listening at ${PORT}`);
        });
    });
}
startServer();
