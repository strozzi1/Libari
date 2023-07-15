import express from 'express'
import multer from "multer";
import crypto from "crypto";
import { googleLogin, googleRegister, login, register } from "../controllers/auth.js"

const router = express.Router();

const imageTypes = {
    "image/jpeg": "jpg",
    "image/png": "png"
};

const storage = multer.memoryStorage({
    filename: (req, file, callback) => {
        const filename = crypto.pseudoRandomBytes(16).toString('hex');
        const extension = imageTypes[file.mimetype];
        callback(null, `${filename}.${extension}`);
    }
})
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, callback) => {
        callback(null, !!imageTypes[file.mimetype]);
    }, 
})

// @endpoint "/auth/register/"
router.post("/register", upload.single('picture'), register);

// @endpoint: "/auth/login"
router.post("/login", login);

// @endpoint "/auth/register/"
router.post("/googleRegister", googleRegister);

// @endpoint: "/auth/login"
router.post("/googleLogin", googleLogin);

export default router;