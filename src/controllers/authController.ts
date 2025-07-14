import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      res
        .status(400)
        .json({
          message: "Username or email is already taken, try another one.",
        });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
export const login = async (req: Request, res: Response, next: Function) => {

  try {
    const { username, email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (!user) {
      res.status(400).json({ message: "Invalid login credentials." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid login credentials." });
      return;
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
        },
      });
    return;
  } catch (err) {
    next(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
