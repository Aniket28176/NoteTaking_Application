import mongoose from "mongoose"

const noteschema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
},
{timestamps:true}
);

const Note = mongoose.model("Note",noteschema);

export default Note;