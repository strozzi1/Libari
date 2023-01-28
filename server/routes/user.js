import express from "express"
import { getUserByUsername, deleteUserByUsername, deleteUserById } from "../controllers/user.js"
import { getListByUsername, removeBookIdFromListByUserId } from "../controllers/list.js"

import { requireAuthentication, checkAuthentication } from "../middleware/auth.js"


const router = express.Router()

/* ROUTES NOT REQUIRING AUTHORIZATION */

//@endpoint: /user/:username
//GET user by username
router.get("/:username", getUserByUsername) 


//@endpoint: /user/:username/booklist
//router.get("/:username/booklist")
router.get("/:username/booklist", getListByUsername)



/* ROUTES REQUIRING AUTHORIZATION */

//@endpoint: /user/:username
//DELETE user by username, and their list/lists
//require AUTH
router.delete("/:username", requireAuthentication, deleteUserByUsername)

//@endpoint: /user
//DELETE user by userId in req.body
//require AUTH
router.delete("/", requireAuthentication, deleteUserById)

//@endpoint: /user/:username/booklist
//Delete book from list
//remove book listed in req.body
router.delete("/:userId/booklist/:bookId", requireAuthentication, removeBookIdFromListByUserId)


export default router;