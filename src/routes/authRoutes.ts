import { Router } from "express";
import { register, login } from '../controllers/authController';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully." });
});

export default router;