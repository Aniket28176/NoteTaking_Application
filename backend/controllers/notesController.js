import Note from "../models/Note.js"

export async function getAllNotes(req,res){
    try {
        const notes = await Note.find({}).sort({createdAt:-1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getNoteById(req,res){
    try {
        const notes = await Note.findById(req.params.id);
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function CreateNote(req,res){
    try {
        const {title,content} = req.body
        const note = new Note({title,content})

       const SavedNote = await note.save()
        res.status(201).json({SavedNote})
    } catch (error) {
        console.error("Error in createNotes controller",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function UpdateNote(req,res){
    try {
        const {title,content} = req.body;
        const updatedNote= await Note.findByIdAndUpdate(req.params.id,{title,content});
        res.status(200).json({updatedNote})
    } catch (error) {
        console.error("Error in updatedNotes controller",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteNote(req,res){
    try {
         await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Note deleted sucessfully"})
    } catch (error) {
         console.error("Error in deletedNotes controller",error)
        res.status(500).json({message:"Internal server error"});
    }
}