import express from "express"
import multer from "multer";
import crypto from "crypto";

import { 
    getUserByUsername, 
    deleteUserByUsername, 
    deleteUserById, 
    getListByUsername, 
    updateUserById, 
    updateUserPassword, 
    updateUsername,
    addFollowing,
    removeFollowing,
    updateEmail,
    getUsers
 } from "../controllers/user.js"

import { requireAuthentication, checkAuthentication } from "../middleware/auth.js"



const router = express.Router()

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


/* ROUTES NOT REQUIRING AUTHORIZATION */

//@endpoint: /user/:username
//GET user by username
//DONE
router.get("/:username", getUserByUsername) 


//@endpoint: /user/:username/booklist
//router.get("/:username/booklist")
//Done
router.get("/:username/booklist", getListByUsername)

router.get("/", getUsers)


/* ROUTES REQUIRING AUTHORIZATION */



/* UPDATE ROUTES */
router.patch("/updatePassword", requireAuthentication, updateUserPassword)

router.patch("/updateUsername", requireAuthentication, updateUsername)

router.patch("/followUser", requireAuthentication, addFollowing)

router.patch("/unfollowUser", requireAuthentication, removeFollowing)

router.patch("/updateEmail", requireAuthentication, updateEmail)

router.patch("/updateProfile", upload.single('picture'), requireAuthentication, updateUserById);

//@endpoint: /user
//get user._id from body
router.patch("/", requireAuthentication, updateUserById)

//@endpoint: /user/:username
//DELETE user by username, and their list/lists
//require AUTH
//TODO: delete List, list entries, and lower book reader's count by one
router.delete("/:username", requireAuthentication, deleteUserByUsername)

//@endpoint: /user
//DELETE currently logged in user
//require AUTH
router.delete("/", requireAuthentication, deleteUserById)



export default router;