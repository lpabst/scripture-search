import { Context } from "../context";
import Shop from "../data/entities/Shop";
import {
  NotFoundError,
  ResourceConflictError,
} from "../middleware/errorHandler";
import { CreateShopDTO } from "../types/repos/CreateShopDTO";
import { UpdateShopDTO } from "../types/repos/UpdateShopDTO";

export default class ShopService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createShop(shopInfo: CreateShopDTO): Promise<void> {
    const [shopNameInUse, userAlreadyHasShop] = await Promise.all([
      this.ctx.repos.shop.getShopByName(shopInfo.name),
      this.ctx.repos.shop.getShopByUserId(shopInfo.userId),
    ]);
    if (!!shopNameInUse) {
      throw ResourceConflictError("Shop name already in use");
    }
    if (!!userAlreadyHasShop) {
      throw ResourceConflictError("User already has a shop");
    }

    await this.ctx.repos.shop.createShop(shopInfo);
  }

  async getShopById(id: string) {
    return this.ctx.repos.shop.getShopById(id);
  }

  async getShopByIdOrFail(id: string): Promise<Shop> {
    const shop = await this.ctx.repos.shop.getShopById(id);
    if (!shop) {
      throw NotFoundError(`No shop found for shopId: ${id}`);
    }
    return shop;
  }

  async getShopByUserId(userId: string) {
    return this.ctx.repos.shop.getShopByUserId(userId);
  }

  async getShopByUserIdOrFail(userId: string): Promise<Shop> {
    const shop = await this.ctx.repos.shop.getShopByUserId(userId);
    if (!shop) {
      throw NotFoundError(`No shop found for userId ${userId}`);
    }
    return shop;
  }

  async updateShopByUserId(
    userId: string,
    updates: UpdateShopDTO
  ): Promise<void> {
    return this.ctx.repos.shop.updateShopByUserId(userId, updates);
  }
}
