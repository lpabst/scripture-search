import { Context } from "../context";
import Product from "../data/entities/Product";
import Shop from "../data/entities/Shop";
import {
  NotFoundError,
  ResourceConflictError,
} from "../middleware/errorHandler";
import { CreateShopDTO } from "../types/repos/CreateShopDTO";
import { QueryPaginationParams } from "../types/repos/QueryPaginationParams";
import { UpdateShopDTO } from "../types/repos/UpdateShopDTO";

export default class ShopService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createShop(shopInfo: CreateShopDTO): Promise<Shop> {
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

    const shop = await this.ctx.repos.shop.createShop(shopInfo);
    return shop;
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

  async queryProductsForShop(
    shopId: string,
    queryPaginationParam: QueryPaginationParams
  ): Promise<Partial<Product>[]> {
    return this.ctx.repos.product.queryProductsByShopId(
      shopId,
      queryPaginationParam
    );
  }

  async queryProductsPublicInfoForShop(
    shopId: string,
    queryPaginationParam: QueryPaginationParams
  ): Promise<Partial<Product>[]> {
    const products = await this.ctx.repos.product.queryProductsByShopId(
      shopId,
      queryPaginationParam
    );
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      weightOunces: product.weightOunces,
      createdAt: product.createdAt,
      // TODO: image urls?
    }));
  }
}
