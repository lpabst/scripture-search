import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import Shop from "../data/entities/Shop";
import { CreateShopDTO } from "../types/repos/CreateShopDTO";
import { UpdateShopDTO } from "../types/repos/UpdateShopDTO";
import { Repository } from "typeorm";
import { randomId } from "../utils/helpers";

export default class ShopRepo {
  ctx: Context;
  repo: Repository<Shop>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(Shop);
    this.cache = {};
  }

  async createShop(shopInfo: CreateShopDTO): Promise<string> {
    const shopId = randomId();
    await this.repo.save({
      id: shopId,
      userId: shopInfo.userId,
      name: shopInfo.name,
      description: shopInfo.description,
    });
    return shopId;
  }

  async getShopById(id: string): Promise<Shop | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }

  async getShopByUserId(userId: string): Promise<Shop | null> {
    if (!this.cache[userId]) {
      this.cache[userId] = await this.repo.findOneBy({ userId });
    }
    return this.cache[userId];
  }

  async getShopByName(name: string): Promise<Shop | null> {
    // Someone could theoretically give their shop a name that's the same as some other shop's id, so I don't want to cache the getByName results in the same cache as I'm caching the getById results
    const shop = await this.repo.findOneBy({ name });
    return shop;
  }

  async updateShop(id: string, updates: UpdateShopDTO) {
    await this.repo.update(id, updates);
  }
}
