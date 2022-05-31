import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import Product from "../data/entities/Product";
import { CreateProductDTO } from "../types/repos/CreateProductDTO";
import { UpdateProductDTO } from "../types/repos/UpdateProductDTO";
import { Repository } from "typeorm";
import { randomId } from "../utils/randomization";

export default class ProductRepo {
  ctx: Context;
  repo: Repository<Product>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(Product);
    this.cache = {};
  }

  async createProduct(productInfo: CreateProductDTO): Promise<Product> {
    const product = {
      id: randomId(),
      userId: productInfo.userId,
      shopId: productInfo.shopId,
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price,
      weightOunces: productInfo.weightOunces,
    };
    const productDbRecord = await this.repo.save(product);
    return productDbRecord;
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!this.cache[id]) {
      this.cache[id] = await this.repo.findOneBy({ id });
    }
    return this.cache[id];
  }

  async updateProductById(
    id: string,
    updates: UpdateProductDTO
  ): Promise<void> {
    await this.repo.update({ id }, updates);
  }

  async queryProductsByUserId(userId: string): Promise<Product[]> {
    const products = await this.repo.findBy({ userId });
    return products;
  }

  async queryProductsByShopId(shopId: string): Promise<Product[]> {
    const products = await this.repo.findBy({ shopId });
    return products;
  }
}
