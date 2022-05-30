import UserRepo from "./repos/userRepo";
import RefreshTokenRepo from "./repos/refreshTokenRepo";
import EmailVerificationTokenRepo from "./repos/emailVerificationTokenRepo";
import UserService from "./services/userService";
import AuthService from "./services/authService";

export class Repos {
  ctx: Context;
  user: UserRepo;
  refreshToken: RefreshTokenRepo;
  emailVerificationToken: EmailVerificationTokenRepo;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserRepo(ctx);
    this.refreshToken = new RefreshTokenRepo(ctx);
    this.emailVerificationToken = new EmailVerificationTokenRepo(ctx);
  }
}

export class Services {
  ctx: Context;
  user: UserService;
  auth: AuthService;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserService(ctx);
    this.auth = new AuthService(ctx);
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
