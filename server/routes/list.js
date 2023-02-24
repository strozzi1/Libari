import  express  from "express";
import { addBook, getListByUsername } from "../controllers/list.js";
import { requireAuthentication } from "../middleware/auth.js";

const router = express.Router()

// @endpoint /booklist/
// add book to list
router.post("/", requireAuthentication, addBook);

//@endpoint /booklist/:username
router.get("/:username", getListByUsername)



export default router