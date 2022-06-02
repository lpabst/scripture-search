import { Context } from "../context";
import Product from "../data/entities/Product";
import { BadRequestError, NotFoundError } from "../middleware/errorHandler";
import { ProductInfoInput } from "../types/services/ProductInfoInput";
import { UpdateProductDTO } from "../types/repos/UpdateProductDTO";
import { QueryPaginationParams } from "../types/repos/QueryPaginationParams";

export default class ProductService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createProduct(productInfo: ProductInfoInput): Promise<Product> {
    const shop = await this.ctx.repos.shop.getShopByUserId(productInfo.userId);
    if (!shop) {
      throw BadRequestError(
        "User does not have a shop yet. Must create shop before creating product listings"
      );
    }

    // Mysql expects tags to be a string with max length 128. Elasticsearch also expects a string
    const tagsString = productInfo.tags.join(" ");

    const product = await this.ctx.repos.product.createProduct({
      ...productInfo,
      shopId: shop.id,
      tags: tagsString,
    });
    await this.ctx.services.search.indexProduct({
      id: product.id,
      name: productInfo.name,
      tags: tagsString,
    });

    return product;
  }

  async getProductById(id: string) {
    return this.ctx.repos.product.getProductById(id);
  }

  async getProductByIdOrFail(id: string): Promise<Product> {
    const product = await this.ctx.repos.product.getProductById(id);
    if (!product) {
      throw NotFoundError(`No product found for productId: ${id}`);
    }
    return product;
  }

  async updateProductById(
    id: string,
    updates: UpdateProductDTO
  ): Promise<void> {
    return this.ctx.repos.product.updateProductById(id, updates);
  }

  async getRecentProducts(
    queryPaginationParams: QueryPaginationParams
  ): Promise<Product[]> {
    return this.ctx.repos.product.queryAllProducts(queryPaginationParams);
  }
}
