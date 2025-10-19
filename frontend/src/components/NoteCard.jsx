import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "../axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Delete clicked for note ID:", id); // Debug log
    
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      console.log("Making API call to delete note..."); // Debug log
      await api.delete(`/notes/${id}`);
      console.log("API call successful, updating state..."); // Debug log
      
      // Update the state to remove the deleted note
      setNotes((prev) => {
        const newNotes = prev.filter((note) => note._id !== id);
        console.log("New notes:", newNotes); // Debug log
        return newNotes;
      });
      
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.log("Error in handleDelete:", error);
      console.log("Error details:", error.response?.data); // More detailed error
      toast.error("Failed to delete note");
    }
  };

  return (
    <div
      onClick={() => navigate(`/note/${note._id}`)}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-green-400 cursor-pointer"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <Link
              to={`/edit-note/${note._id}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-ghost btn-xs"
            >
              <PenSquareIcon className="w-4 h-4" />
            </Link>
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;