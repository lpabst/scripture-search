import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import EmailVerificationToken from "../data/entities/EmailVerificationToken";
import { Repository } from "typeorm";
import { randomId, randomString } from "../utils/helpers";

export default class EmailVerificationTokenRepo {
  ctx: Context;
  repo: Repository<EmailVerificationToken>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(EmailVerificationToken);
    this.cache = {};
  }

  async createEmailVerificationToken(userId: string): Promise<string> {
    const token = randomString(64);

    await this.repo.save({
      id: randomId(),
      userId,
      token,
    });

    return token;
  }

  async getEmailVerificationTokenById(
    id: string
  ): Promise<EmailVerificationToken | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }
}
