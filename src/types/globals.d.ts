import { Request } from 'express';
import { Context } from "../context";

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