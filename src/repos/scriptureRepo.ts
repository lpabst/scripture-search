import { Context } from "../context";
import { AppDataSource } from "../data/dataSource";
import User from "../data/entities/Scripture";
import { CreateScriptureDTO } from "../types/repos/CreateScriptureDTO";
import { Repository } from "typeorm";
import { randomId } from "../utils/randomization";
import Scripture from "../data/entities/Scripture";

export default class ScriptureRepo {
  ctx: Context;
  repo: Repository<User>;
  cache: any;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.repo = AppDataSource.getRepository(Scripture);
    this.cache = {};
  }

  async createScripture(scriptureInfo: CreateScriptureDTO): Promise<Scripture> {
    const scripture = {
      id: randomId(),
      book: scriptureInfo.book,
      chapter: scriptureInfo.chapter,
      verse: scriptureInfo.verse,
      text: scriptureInfo.text,
    };
    const scriptureDbRecord = await this.repo.save(scripture);
    return scriptureDbRecord;
  }
}
