"use strict";

import { Client } from "@elastic/elasticsearch";
import { Context } from "../context";
import { ProductSearchData } from "../types/services/ProductSearchData";
import { ElasticsearchPaginationParams } from "../types/repos/ElasticsearchPaginationParams";

// Interacts with elasticsearch rather than mysql
export default class SearchRepo {
  ctx: Context;
  private elasticSearchClient: Client;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.elasticSearchClient = new Client({
      node: process.env.ELASTICH_SEARCH_CONNECTION_URL,
    });
  }

  async indexProduct(product: ProductSearchData) {
    const documentToIndex = {
      id: product.id,
      name: product.name,
      tags: product.tags,
    };
    console.log(documentToIndex);
    await this.elasticSearchClient.index({
      index: "products",
      document: documentToIndex,
    });
  }

  // TODO: paginate this
  async searchProducts(
    query: string,
    paginationParams: ElasticsearchPaginationParams
  ) {
    const products = await this.elasticSearchClient.search({
      index: "products",
      from: paginationParams.offset,
      size: paginationParams.limit,
      query: {
        multi_match: {
          query: query,
          fields: ["name", "tags"],
        },
      },
    });
    console.log(products);
    return products;
  }
}
