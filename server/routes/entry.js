import express from "express";
import { addNewBookEntryToList, getEntryById, removeBookEntry, updateEntryById, updateEntryByUserAndBook } from "../controllers/entry.js";
import { requireAuthentication } from "../middleware/auth.js";

const router = express.Router()

//@endpoint /entry/:entryId
router.get("/:id", getEntryById);

//@endpoint /entry
router.post("/", requireAuthentication, addNewBookEntryToList)

//@endpoint /entry/:id
router.patch("/:id", requireAuthentication, updateEntryById)

//@endpoint /entry
router.put("/", requireAuthentication, updateEntryByUserAndBook)

//@endpoint /entry/:id
router.delete("/:id", requireAuthentication, removeBookEntry);





export default router;