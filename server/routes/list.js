import  express  from "express";
import {  getListByUsername } from "../controllers/list.js";
import { requireAuthentication } from "../middleware/auth.js";

const router = express.Router()


//@endpoint /booklist/:username
//DONE
router.get("/", getListByUsername);


export default router