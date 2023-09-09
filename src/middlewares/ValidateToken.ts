import { Request, Response, NextFunction } from "express";
import { decodeToken, validateRole } from "../helpers/Utils";
import jwt from "jsonwebtoken";

export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token: ", token);

    const decodedToken = await decodeToken(req);
    if (!validateRole(decodedToken)) {
      return res
        .status(400)
        .json({ message: "The current user doesnt have permissions" });
    }
    if (!token) return res.status(401).json({ message: "Access Denied" });
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.body.user = verified;
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};
