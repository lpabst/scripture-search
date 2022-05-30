"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});
const PORT = process.env.PORT || 8012;
app.listen(PORT, () => {
    console.log(`Express server is listening at ${PORT}`);
});
