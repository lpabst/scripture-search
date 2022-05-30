import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import User from "../data/entities/User";
import { CreateUserDTO } from '../types/dtos/CreateUserDTO';
import { Repository } from 'typeorm';
import { randomId } from '../utils/helpers';

export default class UserRepo {
  ctx: Context;
  repo: Repository<User>;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(User);
  }

  async createUser(userInfo: CreateUserDTO): Promise<void> {
    await this.repo.save({
      id: randomId(),
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      passwordHash: userInfo.passwordHash
    })
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ email });
    return user;
  }
}