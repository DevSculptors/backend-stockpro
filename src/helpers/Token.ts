import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { GenerateTokenPayload } from "interfaces/User";

export const GenerateToken = (
  payload: GenerateTokenPayload
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      {
        expiresIn: 86400,
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
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decodedToken) =>{
      if (error) reject(error);
      resolve(decodedToken);
    })
  });
}
