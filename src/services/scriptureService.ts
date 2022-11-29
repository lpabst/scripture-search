import { Context } from "../context";
import Scripture from "../data/entities/Scripture";
import { ScriptureInfoInput } from "../types/services/ScriptureInfoInput";

export default class ScriptureService {
  ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async createScripture(scriptureInfo: ScriptureInfoInput): Promise<Scripture> {
    const scripture = await this.ctx.repos.scripture.createScripture({
      book: scriptureInfo.book,
      chapter: scriptureInfo.chapter,
      verse: scriptureInfo.verse,
      text: scriptureInfo.text,
    });
    return scripture;
  }

  scanScriptures(limit = 100, offset = 0) {
    return this.ctx.repos.scripture.scanScriptures(limit, offset);
  }
}
