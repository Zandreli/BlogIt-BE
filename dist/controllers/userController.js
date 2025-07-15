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
exports.getUserBlogs = exports.updatePassword = exports.updateProfile = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany();
        res.json(users);
    }
    catch (err) {
        next(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, username, email } = req.body;
    const updated = yield prisma_1.default.user.update({
        where: { id: req.userId },
        data: { firstName, lastName, username, email },
    });
    res.json(updated);
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: req.userId },
    });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid current password" });
        return;
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: req.userId },
        data: { password: hashedNewPassword },
    });
    res.json({ message: "Password updated successfully" });
});
exports.updatePassword = updatePassword;
const getUserBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield prisma_1.default.blog.findMany({
        where: { authorId: req.userId,
            isDeleted: false,
        },
    });
    res.json(blogs);
});
exports.getUserBlogs = getUserBlogs;
