import { Context } from "../context";
import { ResourceConflictError } from "../middleware/errorHandler";
import { CreateShopDTO } from "../types/repos/CreateShopDTO";

export default class ShopService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createShop(shopInfo: CreateShopDTO): Promise<void> {
    const shopNameInUse = await this.ctx.repos.shop.getShopByName(
      shopInfo.name
    );
    if (!!shopNameInUse) {
      throw ResourceConflictError("Shop name already in use");
    }

    await this.ctx.repos.shop.createShop(shopInfo);
  }
}
