import express from "express";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import { getUser, getAllUsers } from "../controllers/user.js";

const router = express.Router();

// Get user profile (protected route)
router.get("/:id", verifyUser, getUser);

// Admin-only: get all users
router.get("/admin/all", verifyAdmin, getAllUsers);

export default router;