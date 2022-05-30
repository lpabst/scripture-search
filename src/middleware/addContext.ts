import { Request, Response, NextFunction } from "express";
import { Context } from "../context";

export default function addContext(req: Request, res: Response, next: NextFunction) {
  req.ctx = new Context();
  next();
}