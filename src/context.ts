export class Repositories {
  ctx: Context;
  
  constructor(ctx: Context) {
    this.ctx = ctx;
  }
}export 

class Services {
  ctx: Context;
  
  constructor(ctx: Context) {
    this.ctx = ctx;
  }
}export 

class Controllers {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }
}export 

class Context {
  repos: Repositories;
  services: Services;
  controllers: Controllers;

  constructor() {
    this.services = new Services(this);
    this.controllers = new Controllers(this);
    this.repos = new Repositories(this);
  }
}