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
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({message: "No token provided, Please login again"});
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.userId;
        next();
     } catch (err) {
        res.status(403).json({message: "Invalid token, Please try again"});
        return;
     }
    };