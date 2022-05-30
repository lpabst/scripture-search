import { NextFunction, Request, Response } from "express";

export default function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err);

  if (res.headersSent) {
    return next(err)
  }

  const statusCode = err.statusCode || 500;
  const msg = err.msg || 'Unexpected Server Error';
  
  return res.status(statusCode).send(msg);
}

export function BadRequestError(msg: string = '') {
  return {
    isCustomError: true,
    msg: msg || 'Bad Request',
    statusCode: 400,
  }
}

export function ResourceConflictError(msg: string = '') {
  return {
    isCustomError: true,
    msg: msg || 'Resource Conflict',
    statusCode: 409,
  }
}