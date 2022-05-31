import UserRepo from "./repos/userRepo";
import RefreshTokenRepo from "./repos/refreshTokenRepo";
import EmailVerificationTokenRepo from "./repos/emailVerificationTokenRepo";
import ShopRepo from "./repos/shopRepo";
import UserService from "./services/userService";
import AuthService from "./services/authService";
import NotificationService from "./services/notificationService";
import ShopService from "./services/shopService";

export class Repos {
  ctx: Context;
  user: UserRepo;
  refreshToken: RefreshTokenRepo;
  emailVerificationToken: EmailVerificationTokenRepo;
  shop: ShopRepo;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserRepo(ctx);
    this.refreshToken = new RefreshTokenRepo(ctx);
    this.emailVerificationToken = new EmailVerificationTokenRepo(ctx);
    this.shop = new ShopRepo(ctx);
  }
}

export class Services {
  ctx: Context;
  user: UserService;
  auth: AuthService;
  notification: NotificationService;
  shop: ShopService;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.user = new UserService(ctx);
    this.auth = new AuthService(ctx);
    this.notification = new NotificationService(ctx);
    this.shop = new ShopService(ctx);
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
