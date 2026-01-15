import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1a33] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            📒 Your Notes
          </h1>
          <p className="text-gray-300 mt-2">
            All your thoughts, ideas, and reminders in one place
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <span className="loading loading-spinner loading-lg text-sky-400"></span>
          </div>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="flex justify-center py-24">
            <NotesNotFound />
          </div>
        )}

        {/* Notes */}
        {!loading && notes.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

