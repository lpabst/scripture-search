import UserRepo from './repos/userRepo';
import UserService from './services/userService';

export class Repos {
  ctx: Context;
  user: UserRepo
  
  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserRepo(ctx);
  }
} 

export class Services {
  ctx: Context;
  user: UserService;
  
  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserService(ctx);
  }
} 

export class Context {
  services: Services;
  repos: Repos;

  constructor() {
    this.services = new Services(this);
    this.repos = new Repos(this);
  }
}