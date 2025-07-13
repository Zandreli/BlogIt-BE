import { Router } from "express";
import {
  getAllUsers,
  updateProfile,
  updatePassword,
  getUserBlogs,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getAllUsers);
router.patch("/", authenticate, updateProfile);
router.patch("/password", authenticate, updatePassword);
router.get("/blogs", authenticate, getUserBlogs);

export default router;