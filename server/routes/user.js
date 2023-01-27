import express from "express"
import { getUserByUsername, deleteUserByUsername } from "../controllers/user.js"
import { getListByUsername } from "../controllers/list.js"


const router = express.Router()

//@endpoint: /user/:username
//GET user by username
router.get("/:username", getUserByUsername) 

//@endpoint: /user/:username
//DELETE user by username, and their list/lists
//require auth
router.delete("/:username", deleteUserByUsername)

//@endpoint: /user/:username/booklist
//router.get("/:username/booklist")
router.get("/:username/booklist", getListByUsername)


export default router;