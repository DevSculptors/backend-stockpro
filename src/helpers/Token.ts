import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config";
import { Request, Response, NextFunction } from "express";
import { GenerateTokenPayload } from "interfaces/User";

export const GenerateToken = (
  payload: GenerateTokenPayload
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token as string);
      }
    );
  });
};


export const verifyToken = (token: string): Promise<any> =>{
  return new Promise((resolve, reject) =>{
    jwt.verify(token, TOKEN_SECRET, (error, decodedToken) =>{
      if (error) reject(error);
      resolve(decodedToken);
    })
  });
}
