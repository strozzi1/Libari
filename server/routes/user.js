import express from "express"
import { getUserByUsername, deleteUserByUsername, deleteUserById } from "../controllers/user.js"
import { getListByUsername } from "../controllers/list.js"

import { requireAuthentication, checkAuthentication } from "../middleware/auth.js"


const router = express.Router()

//@endpoint: /user/:username
//GET user by username
router.get("/:username", getUserByUsername) 


//@endpoint: /user/:username/booklist
//router.get("/:username/booklist")
router.get("/:username/booklist", getListByUsername)

//@endpoint: /user/:username
//DELETE user by username, and their list/lists
//require AUTH
router.delete("/:username", requireAuthentication, deleteUserByUsername)

//@endpoint: /user
//DELETE user by userId in req.body
//require AUTH
router.delete("/", requireAuthentication, deleteUserById)


export default router;