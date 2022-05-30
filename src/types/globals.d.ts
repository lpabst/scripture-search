import { Request } from 'express';
import { Context } from "../utils/context";

declare global {
  namespace Express {
    interface Request {
      ctx?: Context,
      userId?: string,
      token?: string,
    }
  }
}

export {};