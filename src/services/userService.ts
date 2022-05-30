import { Context } from "../context";
import { CreateUserDTO } from '../types/dtos/CreateUserDTO';
import bcrypt from 'bcrypt';
import { ResourceConflictError } from "../middleware/errorHandler";

export default class UserService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createUser(userInfo: CreateUserDTO): Promise<void> {
    const emailInUse = await this.ctx.repos.user.getUserByEmail(userInfo.email);
    if (!!emailInUse) {
      throw ResourceConflictError('Email is already in use');
    }

    const passwordHash = await bcrypt.hash(userInfo.password!, 10);
    await this.ctx.repos.user.createUser({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      passwordHash: passwordHash,
    });
  }

  async getUserById(id: string) {
    return this.ctx.repos.user.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return this.ctx.repos.user.getUserById(email);
  }
}