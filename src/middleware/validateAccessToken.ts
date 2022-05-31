import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "./errorHandler";

export default function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["authorization"]) {
    throw UnauthenticatedError("Must provide an access token");
  }

  let decodedAccessToken: any;
  try {
    decodedAccessToken = jwt.verify(
      req.headers["authorization"],
      process.env.JWT_SECRET!
    );
  } catch (e) {
    throw UnauthenticatedError((e as any).message);
  }

  if (decodedAccessToken.tokenType !== "accessToken") {
    throw UnauthenticatedError("Invalid Token Type");
  }

  req.userId = decodedAccessToken.userId;
  req.accessToken = req.headers["authorization"];
  req.decodedAccessToken = decodedAccessToken;
  next();
}
