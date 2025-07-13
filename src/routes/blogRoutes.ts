import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:blogId", getBlogById);

router.post("/", authenticate , createBlog);
router.patch("/:blogId", authenticate, updateBlog);
router.delete("/:blogId", authenticate, deleteBlog);

export default router;