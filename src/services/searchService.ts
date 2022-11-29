import { Context } from "../context";
import { ElasticsearchPaginationParams } from "../types/repos/ElasticsearchPaginationParams";
import { ScriptureSearchData } from "../types/services/ScriptureSearchData";

// knows how to interact with the elasticsearch docker container
export default class SearchService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async indexScripture(scripture: ScriptureSearchData) {
    await this.ctx.repos.search.indexScripture(scripture);
  }

  async searchScriptures(
    query: string,
    paginationParams: ElasticsearchPaginationParams
  ) {
    const searchResults = await this.ctx.repos.search.searchScriptures(
      query,
      paginationParams
    );
    return searchResults.hits.hits.map((obj: any) => obj._source);
  }
}
