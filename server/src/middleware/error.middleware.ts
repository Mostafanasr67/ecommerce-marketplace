import type { Request, Response, NextFunction } from "express";

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  res.status(500).json({ error: "Internal Server Error" });
}

export default errorHandler;