import { Request, Response, NextFunction } from "express";
import { isValidEmailFormat } from "../utils/regex";
import { BadRequestError } from "./errorHandler";

export default function validateEmailFormatInBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.email || !isValidEmailFormat(req.body.email)) {
    throw BadRequestError("Invalid Email Format");
  }
  next();
}
