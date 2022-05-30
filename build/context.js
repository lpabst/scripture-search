"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.Controllers = exports.Services = exports.Repositories = void 0;
class Repositories {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
exports.Repositories = Repositories;
class Services {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
exports.Services = Services;
class Controllers {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
exports.Controllers = Controllers;
class Context {
    constructor() {
        this.services = new Services(this);
        this.controllers = new Controllers(this);
        this.repos = new Repositories(this);
    }
}
exports.Context = Context;
