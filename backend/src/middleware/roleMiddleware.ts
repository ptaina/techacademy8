import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/jwtPayload";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as JwtPayload;

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Administrators only" });
  }

  next();
};
