import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}

export function authenticate(req:Request, res:Response, next:NextFunction) {
    const authHeader = req.headers['authorization'];
    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET as string, (err:any, userData:any) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid or expired token' });
                }
                req.user = userData;
                
                console.log(req.user);
                
                next();
            });
        } else {
            return res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        
        res.status(500)
        console.log(error);
        
    }
}

