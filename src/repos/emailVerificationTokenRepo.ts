import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import EmailVerificationToken from "../data/entities/EmailVerificationToken";
import { Repository } from "typeorm";
import { randomId, randomString } from "../utils/randomization";

export default class EmailVerificationTokenRepo {
  ctx: Context;
  repo: Repository<EmailVerificationToken>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(EmailVerificationToken);
    this.cache = {};
  }

  async createEmailVerificationToken(
    userId: string
  ): Promise<EmailVerificationToken> {
    const token = {
      id: randomId(),
      userId,
      token: randomString(64),
    };
    const tokenDbRecord = await this.repo.save(token);
    return tokenDbRecord;
  }

  async getDbRecordForToken(
    token: string
  ): Promise<EmailVerificationToken | null> {
    if (!this.cache[token]) {
      this.cache[token] = await this.repo.findOneBy({ token });
    }
    return this.cache[token];
  }

  async deleteDbRecordForToken(token: string): Promise<void> {
    await this.repo.delete({ token });
  }
}
