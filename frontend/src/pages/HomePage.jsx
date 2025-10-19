import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import toast from "react-hot-toast";
import api from "../axios";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes"); // ✅ Correct: uses your custom axios instance
        console.log("Notes data:", res.data);
        
        // Ensure notes is always an array
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          console.error("Expected array but got:", typeof res.data);
          setNotes([]);
          toast.error("Invalid data format from server");
        }
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.code === 'ERR_NETWORK') {
          toast.error("Backend server not running. Start it with: cd backend && npm run dev");
        } else {
          toast.error("Failed to load notes");
        }
        setNotes([]);
      } finally {
        setLoading(false); 
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-blue-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">
            Loading Notes...
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard 
                key={note._id} 
                note={note} 
                setNotes={setNotes} // ✅ Essential for delete functionality
              />
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No notes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;