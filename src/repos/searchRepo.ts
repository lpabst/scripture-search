"use strict";

import { Client } from "@elastic/elasticsearch";
import { Context } from "../context";
import { ScriptureSearchData } from "../types/services/ScriptureSearchData";
import { ElasticsearchPaginationParams } from "../types/repos/ElasticsearchPaginationParams";
import path from "path";
import fs from "fs";

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
    console.log(query);
    console.log(
      JSON.stringify(
        query.split(" ").map((word) => ({
          span_multi: {
            match: {
              fuzzy: {
                text: {
                  fuzziness: 2,
                  value: word,
                },
              },
            },
          },
        }))
      )
    );
    // https://github.com/kkevilus/bible_elasticsearch
    const scriptures = await this.elasticSearchClient.search({
      index: "scriptures",
      from: paginationParams.offset,
      size: paginationParams.limit,
      // The should array allows multiple searches to be combined into a single set of paginated results!
      // span near allows me to fuzzy search each word in the query, as well as checking that they show up in the right order. This allows super relevant results to rise right to the top of the results with huge relevance scores.
      // after that we also do a query_string search so that any verses that include any of the words in the query will also show up in the results, just not as high in the relevance sorting as ones with words in the proper order.
      // We could theoretically add a 3rd search to the should array that fuzzy searches the words individually, but I'm not sure if that would cause more harm than good since they might show up above the query_string results if they have higher relevance scores
      query: {
        bool: {
          should: [
            {
              span_near: {
                clauses: query.split(" ").map((word) => ({
                  span_multi: {
                    match: {
                      fuzzy: {
                        text: {
                          fuzziness: 2,
                          value: word,
                        },
                      },
                    },
                  },
                })),
                slop: 1,
                in_order: true,
              },
            },
            {
              query_string: {
                query,
                fields: ["text"],
              },
            },
          ],
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
