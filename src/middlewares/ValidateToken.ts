import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config";

export const authRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.body.user = verified;    
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

