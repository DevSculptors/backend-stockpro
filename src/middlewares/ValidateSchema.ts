import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.originalUrl);
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {      
      return res.status(400).send(e.errors);
    }
  };

export default validate;