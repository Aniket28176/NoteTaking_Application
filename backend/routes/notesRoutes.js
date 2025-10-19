import express from "express"
import { CreateNote, deleteNote, getAllNotes, UpdateNote,getNoteById } from "../controllers/notesController.js";
const router = express.Router();

router.get('/',getAllNotes)
router.get('/:id',getNoteById)
router.post('/',CreateNote)
router.put('/:id',UpdateNote)
router.delete('/:id',deleteNote)

export default router