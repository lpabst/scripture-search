import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import RefreshToken from "../data/entities/RefreshToken";
import { Repository } from "typeorm";
import { randomId, randomString } from "../utils/randomization";

export default class RefreshTokenRepo {
  ctx: Context;
  repo: Repository<RefreshToken>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(RefreshToken);
    this.cache = {};
  }

  async createRefreshToken(userId: string): Promise<RefreshToken> {
    const token = randomString(32);
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);

    const refreshToken = {
      id: randomId(),
      userId,
      token,
      expires: expirationDate,
    };
    const refreshTokenDbRecord = await this.repo.save(refreshToken);
    return refreshTokenDbRecord;
  }

  async getRefreshTokenById(id: string): Promise<RefreshToken | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }
}
