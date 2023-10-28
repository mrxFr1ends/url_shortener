import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors";

/* eslint-disable  @typescript-eslint/no-unused-vars */
export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err.statusCode) console.error(err);
  res.status(err.statusCode || 500).send({
    message: err.statusCode ? err.message : "Internal Server Error",
  });
};
