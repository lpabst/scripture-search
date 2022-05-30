"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
function addContext(req, res, next) {
    req.ctx = new context_1.Context();
    next();
}
exports.default = addContext;
