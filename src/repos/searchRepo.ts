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

  async searchProducts(
    query: string,
    paginationParams: ElasticsearchPaginationParams
  ) {
    console.time("search");
    const products = await this.elasticSearchClient.search({
      index: "products",
      from: paginationParams.offset,
      size: paginationParams.limit,
      query: {
        // bool: {
        //   should: [
        //     {
        //       fuzzy: {
        //         name: query,
        //       },
        //     },
        //     {
        //       match: {
        //         tags: query,
        //       },
        //     },
        //   ],
        // },
        multi_match: {
          query: query,
          fields: ["name", "tags"],
        },
      },
    });
    console.timeEnd("search");
    console.log(await this.totalIndexCount());
    return products;
  }

  // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html
  async bulkIndexProducts(products: ProductSearchData[]) {
    const operations = products.flatMap((doc) => [
      { index: { _index: "products" } },
      doc,
    ]);
    await this.elasticSearchClient.bulk({
      refresh: true,
      operations,
    });
  }

  // I'm not using this anywhere right now, but it's cool to have
  async totalIndexCount(indexName: string = "products") {
    return this.elasticSearchClient.count({
      index: indexName,
    });
  }
}
