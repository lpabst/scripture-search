"use strict";

import { Client } from "@elastic/elasticsearch";
import { Context } from "../context";
import { ScriptureSearchData } from "../types/services/ScriptureSearchData";
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

  async indexScripture(scripture: ScriptureSearchData) {
    const documentToIndex = {
      id: scripture.id,
      book: scripture.book,
      chapter: scripture.chapter,
      verse: scripture.verse,
      text: scripture.text,
      tags: scripture.tags,
    };
    await this.elasticSearchClient.index({
      index: "scriptures",
      document: documentToIndex,
    });
  }

  async searchScriptures(
    query: string,
    paginationParams: ElasticsearchPaginationParams
  ) {
    console.time("search");
    const scriptures = await this.elasticSearchClient.search({
      index: "scriptures",
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
          fields: ["id", "book", "text", "tags"],
        },
      },
    });
    console.timeEnd("search");
    console.log(await this.totalIndexCount());
    return scriptures;
  }

  // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html
  async bulkIndexScriptures(scriptures: ScriptureSearchData[]) {
    const operations = scriptures.flatMap((doc) => [
      { index: { _index: "scriptures" } },
      doc,
    ]);
    await this.elasticSearchClient.bulk({
      refresh: true,
      operations,
    });
  }

  // I'm not using this anywhere right now, but it's cool to have
  async totalIndexCount(indexName: string = "scriptures") {
    return this.elasticSearchClient.count({
      index: indexName,
    });
  }
}
