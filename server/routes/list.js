import  express  from "express";
import { addBook } from "../controllers/list.js";
import { requireAuthentication } from "../middleware/auth.js";

const router = express.Router()

// @endpoint /booklist/:listId
// add book to list
router.post("/:listId", requireAuthentication, addBook);



export default router