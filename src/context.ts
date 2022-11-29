import ScriptureRepo from "./repos/scriptureRepo";
import SearchRepo from "./repos/searchRepo";
import ScriptureService from "./services/scriptureService";
import SearchService from "./services/searchService";

export class Repos {
  ctx: Context;
  scripture: ScriptureRepo;
  search: SearchRepo;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.scripture = new ScriptureRepo(ctx);
    this.search = new SearchRepo(ctx);
  }
}

export class Services {
  ctx: Context;
  scripture: ScriptureService;
  search: SearchService;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.scripture = new ScriptureService(ctx);
    this.search = new SearchService(ctx);
  }
}

export class Context {
  services: Services;
  repos: Repos;

  constructor() {
    this.services = new Services(this);
    this.repos = new Repos(this);
  }
}
