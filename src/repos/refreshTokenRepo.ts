import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import RefreshToken from "../data/entities/RefreshToken";
import { Repository } from "typeorm";
import { randomId } from "../utils/helpers";
import { CreateRefreshTokenDTO } from "../types/dtos/CreateRefreshTokenDTO";

export default class RefreshTokenRepo {
  ctx: Context;
  repo: Repository<RefreshToken>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(RefreshToken);
    this.cache = {};
  }

  async createRefreshToken({
    userId,
    refreshToken,
  }: CreateRefreshTokenDTO): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);

    await this.repo.save({
      id: randomId(),
      userId,
      token: refreshToken,
      expires: expirationDate,
    });
  }

  async getRefreshTokenById(id: string): Promise<RefreshToken | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }
}
