import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllBlogs = async (_req: Request, res: Response) => {
    try {
        const blogs = await prisma.blog.findMany({
            where: { isDeleted: false },
            include: { author: true },
        });
        res.status(200).json({
            message: 'Blogs retrieved successfully. Please view them',
            blogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong, try again later"});
    }
};

export const getBlogById = async (req: Request, res: Response)=> {
    const { blogId } = req.params;

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });

    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    res.json(blog);
};

export const createBlog = async (req: Request, res: Response) => {
   try {
    const { featuredImg, title, synopsis, content } = req.body;
    console.log("USER ID:", req.userId);
    const newBlog = await prisma.blog.create({
        data: {
            featuredImg,
            title,
            synopsis,
            content,
            authorId: req.userId!,
        },
    });

    res.status(201).json({
        message: "Blog created successfully",
        newBlog
    });
   } catch (error) {
    console.error('Error creation blog:', error);
    res.status(500).json({ message: "Something went wrong, please try again"});
   }

};

export const updateBlog = async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const { featuredImg, title, synopsis, content } = req.body;
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    if (req.userId !== blog.authorId) {
        res.status(403).json({ message: "You are not authorized to update this blog" });
        return;
    }
    const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: {
            featuredImg,
            title,
            synopsis,
            content,
        },
    });
    res.json(updatedBlog);
};

export const deleteBlog = async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.isDeleted) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    if (req.userId !== blog.authorId) {
        res.status(403).json({ message: "You are not authorized to delete this blog" });
        return;
    }
    await prisma.blog.update({
        where: { id: blogId },
        data: { isDeleted: true },
    });
    res.json({ message: "Blog deleted successfully" });
};