import express from 'express'
import { login, register } from "../controllers/auth.js"

const router = express.Router();

// @endpoint "/auth/register/"
router.post("/register", register);

// @endpoint: "/auth/login"
router.post("/login", login);

export default router;