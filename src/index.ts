    import express from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors';
    import cookieParser from 'cookie-parser';
    import authRoutes from './routes/authRoutes';
    import blogRoutes from './routes/blogRoutes';
    import userRoutes from './routes/userRoutes';
    import uploadRoutes from "./routes/upload"

    dotenv.config();

    const app = express();
    app.use("/api", uploadRoutes)
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));

    app.use("/api/auth", authRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/users", userRoutes);

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err);
        res.status(500).json({ message: "Something went wrong."});
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });