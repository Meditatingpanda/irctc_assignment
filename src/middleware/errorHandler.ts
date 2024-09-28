import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: CustomError = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};
