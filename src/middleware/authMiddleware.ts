import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    }

    declare global {
        namespace Express {
          interface Request {
            userId?: string;
          }
        }
      }

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({message: "No token provided, Please login again"});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.userId;
        next();
     } catch (err) {
        res.status(403).json({message: "Invalid token, Please try again"});
        return;
     }
    };