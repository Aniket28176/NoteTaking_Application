import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  FileTextIcon,
  PenLineIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import api from "../axios";
import toast from "react-hot-toast";

const EditNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch {
        toast.error("Failed to fetch note");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch {
      toast.error("Error updating note");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost mb-6 gap-2"
        >
          <ArrowLeftIcon className="size-5" />
          Back
        </button>

        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center">
              ✏️ Edit Note
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div className="relative">
                <FileTextIcon className="absolute left-3 top-3 size-5 text-base-content/40" />
                <input
                  type="text"
                  name="title"
                  value={note.title}
                  onChange={handleChange}
                  placeholder="Note title"
                  className="input input-bordered w-full pl-10 text-lg font-semibold"
                />
              </div>

              {/* Content */}
              <div className="relative">
                <PenLineIcon className="absolute left-3 top-3 size-5 text-base-content/40" />
                <textarea
                  name="content"
                  value={note.content}
                  onChange={handleChange}
                  placeholder="Edit your note..."
                  className="textarea textarea-bordered w-full h-56 pl-10 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="size-5" />
                      Update Note
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn btn-outline flex-1 gap-2"
                >
                  <XIcon className="size-5" />
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotePage;
