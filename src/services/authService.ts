import { Context } from "../context";
import { ForbiddenError } from "../middleware/errorHandler";
import { LoginDTO } from "../types/repos/LoginDTO";
import { UserTokens } from "../types/services/UserTokens";
import { promiseTimeout, randomNumber } from "../utils/helpers";

export default class AuthService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async login({ email, password }: LoginDTO): Promise<UserTokens> {
    const user = await this.getUserOrThrowForbiddenError(email);
    await user.throwErrorIfEmailNotVerified();
    let st = Date.now();
    await user.validatePassword(password);
    console.log(st - Date.now());
    const jwtTokens = user.generateJwtTokens();
    const refreshToken = await this.ctx.repos.refreshToken.createRefreshToken(
      user.id
    );
    return {
      ...jwtTokens,
      refreshToken,
    };
  }

  async getUserOrThrowForbiddenError(email: string) {
    const user = await this.ctx.repos.user.getUserByEmail(email);
    if (!user) {
      // wait for a small timeout to simulate the hash algorithm so hackers don't know whether the email or password was wrong
      console.log(`User does not exist: ${email}`);
      const fakeHashDelay = randomNumber(60, 105);
      await promiseTimeout(fakeHashDelay);
      throw ForbiddenError("Invalid email or password");
    }

    return user;
  }
}
