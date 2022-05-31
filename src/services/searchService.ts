import { Context } from "../context";
import { ElasticsearchPaginationParams } from "../types/repos/ElasticsearchPaginationParams";
import { ProductSearchData } from "../types/services/ProductSearchData";

// knows how to interact with the elasticsearch docker container
export default class SearchService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async indexProduct(product: ProductSearchData) {
    await this.ctx.repos.search.indexProduct(product);
  }

  async searchProducts(
    query: string,
    paginationParams: ElasticsearchPaginationParams
  ) {
    const searchResults = await this.ctx.repos.search.searchProducts(
      query,
      paginationParams
    );
    const productIds = searchResults.hits.hits.map((result: any) => {
      console.log(result);
      return result._source.id;
    });
    const products = await Promise.all(
      productIds.map((productId) =>
        this.ctx.repos.product.getProductById(productId)
      )
    );
    return products;
  }
}
