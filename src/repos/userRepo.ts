import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import User from "../data/entities/User";
import { CreateUserDTO } from "../types/repos/CreateUserDTO";
import { UpdateUserDTO } from "../types/repos/UpdateUserDTO";
import { Repository } from "typeorm";
import { randomId } from "../utils/randomization";

export default class UserRepo {
  ctx: Context;
  repo: Repository<User>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(User);
    this.cache = {};
  }

  async createUser(userInfo: CreateUserDTO): Promise<string> {
    const userId = randomId();
    await this.repo.save({
      id: userId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      passwordHash: userInfo.passwordHash,
    });
    return userId;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.cache[email]) {
      this.cache[email] = await this.repo.findOneBy({ email });
    }
    return this.cache[email];
  }

  async updateUser(id: string, updates: UpdateUserDTO) {
    await this.repo.update(id, updates);
  }
}
