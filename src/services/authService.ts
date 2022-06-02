import { Context } from "../context";
import { ForbiddenError } from "../middleware/errorHandler";
import { LoginDTO } from "../types/repos/LoginDTO";
import { UserTokens } from "../types/services/UserTokens";
import { promiseTimeout } from "../utils/helpers";
import { randomNumber } from "../utils/randomization";

export default class AuthService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async login({ email, password }: LoginDTO): Promise<UserTokens> {
    const user = await this.getUserOrThrowForbiddenError(email);
    await user.throwErrorIfEmailNotVerified();
    await user.validatePassword(password);
    const jwtTokens = user.generateJwtTokens();
    const { token: refreshToken } =
      await this.ctx.repos.refreshToken.createRefreshToken(user.id);

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
