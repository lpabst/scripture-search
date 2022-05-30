import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import RefreshToken from "../data/entities/RefreshToken";
import { Repository } from "typeorm";
import { randomId, randomString } from "../utils/helpers";

export default class RefreshTokenRepo {
  ctx: Context;
  repo: Repository<RefreshToken>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(RefreshToken);
    this.cache = {};
  }

  async createRefreshToken(userId: string): Promise<string> {
    const refreshToken = randomString(32);
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);

    await this.repo.save({
      id: randomId(),
      userId,
      token: refreshToken,
      expires: expirationDate,
    });

    return refreshToken;
  }

  async getRefreshTokenById(id: string): Promise<RefreshToken | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }
}
