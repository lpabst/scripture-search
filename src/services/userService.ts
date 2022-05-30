import { Context } from "../context";
import { CreateUserDTO } from "../types/dtos/CreateUserDTO";
import bcrypt from "bcrypt";
import { ResourceConflictError } from "../middleware/errorHandler";

export default class UserService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createUser(userInfo: CreateUserDTO): Promise<void> {
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

    // TODO: send an email verification email out with a link with the EmailVerificationToken in it
    console.log(
      `Until we send out an email with the verificaiton token in it, we'll have to verify it manually in the api. Here is the token: ${emailVerificationToken}`
    );
  }

  async validateEmailNotInUse(email: string): Promise<void> {
    const emailInUse = await this.ctx.repos.user.getUserByEmail(email);
    if (!!emailInUse) {
      throw ResourceConflictError("Email is already in use");
    }
  }

  async getUserById(id: string) {
    return this.ctx.repos.user.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return this.ctx.repos.user.getUserById(email);
  }
}
