"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllBlogs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma_1.default.blog.findMany({
            where: { isDeleted: false },
            include: { author: true },
        });
        res.status(200).json({
            message: "Blogs retrieved successfully. Please view them",
            blogs,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong, try again later" });
    }
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const blog = yield prisma_1.default.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    res.json(blog);
});
exports.getBlogById = getBlogById;
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { featuredImg, title, synopsis, content } = req.body;
        console.log("USER ID:", req.userId);
        const newBlog = yield prisma_1.default.blog.create({
            data: {
                featuredImg,
                title,
                synopsis,
                content,
                authorId: req.userId,
            },
        });
        res.status(201).json({
            message: "Blog created successfully",
            newBlog,
        });
    }
    catch (error) {
        console.error("Error creation blog:", error);
        res.status(500).json({ message: "Something went wrong, please try again" });
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const { featuredImg, title, synopsis, content } = req.body;
    const blog = yield prisma_1.default.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    if (req.userId !== blog.authorId) {
        res
            .status(403)
            .json({ message: "You are not authorized to update this blog" });
        return;
    }
    const updatedBlog = yield prisma_1.default.blog.update({
        where: { id: blogId },
        data: {
            featuredImg,
            title,
            synopsis,
            content,
        },
    });
    res.json(updatedBlog);
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const blog = yield prisma_1.default.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    if (req.userId !== blog.authorId) {
        res
            .status(403)
            .json({ message: "You are not authorized to delete this blog" });
        return;
    }
    yield prisma_1.default.blog.update({
        where: { id: blogId },
        data: { isDeleted: true },
    });
    res.json({ message: "Blog deleted successfully" });
});
exports.deleteBlog = deleteBlog;
