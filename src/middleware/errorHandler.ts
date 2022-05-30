import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const msg = err.msg || "Unexpected Server Error";

  return res.status(statusCode).send(msg);
}

export function BadRequestError(msg: string = "") {
  return {
    msg: msg || "Bad Request",
    statusCode: 400,
  };
}

export function UnauthenticedError(msg: string = "") {
  return {
    msg: msg || "Login Required",
    statusCode: 401,
  };
}

export function ForbiddenError(msg: string = "") {
  return {
    msg: msg || "Forbidden",
    statusCode: 403,
  };
}

export function NotFoundError(msg: string = "") {
  return {
    msg: msg || "Not Found",
    statusCode: 404,
  };
}

export function ResourceConflictError(msg: string = "") {
  return {
    msg: msg || "Resource Conflict",
    statusCode: 409,
  };
}
