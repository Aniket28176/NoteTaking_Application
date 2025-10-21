import express from "express";
import { 
    getAllNotes, 
    getNoteById, 
    CreateNote, 
    UpdateNote, 
    deleteNote 
} from "../controllers/notesController.js";

const router = express.Router();

// No authentication required
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", CreateNote);
router.put("/:id", UpdateNote);
router.delete("/:id", deleteNote);

export default router;