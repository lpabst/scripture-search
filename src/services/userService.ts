import { Context } from "../context";
import { UserInfoInput } from "../types/services/UserInfoInput";
import bcrypt from "bcrypt";
import {
  NotFoundError,
  ResourceConflictError,
} from "../middleware/errorHandler";
import User from "../data/entities/User";

export default class UserService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createUser(userInfo: UserInfoInput): Promise<void> {
    await this.validateEmailNotInUse(userInfo.email);
    const passwordHash = await bcrypt.hash(userInfo.password!, 10);
    const userId = await this.ctx.repos.user.createUser({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      passwordHash: passwordHash,
    });
    const emailVerificationToken =
      await this.ctx.repos.emailVerificationToken.createEmailVerificationToken(
        userId
      );

    await this.ctx.services.notification.sendEmailVerificationEmail(
      userInfo.email
    );

    // TODO: see if the sendgrid emails ever start working? If so, remove this console log
    console.log(
      `So far my sendgrid emails aren't coming through, so for now we'll have to verify it manually in the api. Here is the token: ${emailVerificationToken}`
    );
  }

  async getUserById(id: string) {
    return this.ctx.repos.user.getUserById(id);
  }

  async getUserByIdOrFail(id: string): Promise<User> {
    const user = await this.ctx.repos.user.getUserById(id);
    if (!user) {
      throw NotFoundError("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return this.ctx.repos.user.getUserById(email);
  }

  async validateEmailNotInUse(email: string): Promise<void> {
    const emailInUse = await this.ctx.repos.user.getUserByEmail(email);
    if (!!emailInUse) {
      throw ResourceConflictError("Email is already in use");
    }
  }

  async verifyUserEmail(emailVerificationToken: string): Promise<boolean> {
    const tokenDbRecord =
      await this.ctx.repos.emailVerificationToken.getDbRecordForToken(
        emailVerificationToken
      );

    if (!tokenDbRecord) {
      console.log("Invalid email verification token attempted");
      return false;
    }

    await Promise.all([
      this.ctx.repos.user.updateUser(tokenDbRecord.userId, {
        emailVerified: true,
      }),
      this.ctx.repos.emailVerificationToken.deleteDbRecordForToken(
        emailVerificationToken
      ),
    ]);

    return true;
  }
}
