import { NextFunction, Request, Response } from 'express';
import  isUUID from 'uuid-validate';

export const validateUUID = (req: Request, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.id;
        const isValidId: boolean = isUUID(uuid);
        if (!isValidId) return res.status(400).json({message: "Invalid id"});
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});        
    }
}  