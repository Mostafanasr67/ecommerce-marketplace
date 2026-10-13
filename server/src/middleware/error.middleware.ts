import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import AppError from "../utils/appError.js";


function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      "error": "A record with this value already exists"
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({
      "error": "Record not found"
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    return res.status(409).json({
      "error": "This category cannot be deleted because it is referenced by other records"
    });
  }

  if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    error: err.message,
  });
}

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
}

export default errorHandler;