import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";

declare global {
    namespace Express {
        interface Request {
        user: {
            id: string;
            username: string;
        };
        }
    }
    }
export const getAllUsers = async (req: Request, res: Response, next: Function) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { firstName, lastName, username, email } = req.body;

    const updated = await prisma.user.update({
        where: { id: req.userId },
        data: { firstName, lastName, username, email },
    });
    res.json(updated);
};

export const updatePassword = async (req: Request, res: Response) :Promise<void >=> {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: { id: req.userId },
    });
     if (!user) {
         res.status(404).json({ error: "User not found" });
         return;
     }

     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
           res.status(401).json({ error: "Invalid current password" });
           return;
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { password: hashedNewPassword },
        });
        res.json({ message: "Password updated successfully" });
    };

    export const getUserBlogs = async (req: Request, res: Response) => {
        const blogs = await prisma.blog.findMany({
            where: { authorId: req.userId,
            isDeleted: false,
            },
        });

        res.json(blogs);
    }