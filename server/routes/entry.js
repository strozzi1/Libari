import express from "express";
import { addNewBookEntryToList, getEntryById, removeBookEntry } from "../controllers/entry.js";
import { requireAuthentication } from "../middleware/auth.js";

const router = express.Router()

//@endpoint /entry/:entryId
router.get("/:id", getEntryById);

//@endpoint /entry
router.post("/", requireAuthentication, addNewBookEntryToList)

//@endpoint /entry/:id
router.delete("/:id", requireAuthentication, removeBookEntry);



export default router;