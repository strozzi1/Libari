import express from "express"
import { getUserByUsername, deleteUserByUsername, deleteUserById, getListByUsername, updateUserById } from "../controllers/user.js"

import { requireAuthentication, checkAuthentication } from "../middleware/auth.js"


const router = express.Router()

/* ROUTES NOT REQUIRING AUTHORIZATION */

//@endpoint: /user/:username
//GET user by username
//DONE
router.get("/:username", getUserByUsername) 


//@endpoint: /user/:username/booklist
//router.get("/:username/booklist")
//Done
router.get("/:username/booklist", getListByUsername)


/* ROUTES REQUIRING AUTHORIZATION */

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

//@endpoint: /user/:username/booklist
//Delete book from list
//remove book listed in req.body


export default router;