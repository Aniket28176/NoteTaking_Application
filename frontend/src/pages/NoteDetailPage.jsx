import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  Trash2Icon,
  FileTextIcon,
  PenLineIcon,
  SaveIcon,
} from "lucide-react";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Title and content required");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note permanently?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="btn btn-ghost gap-2">
            <ArrowLeftIcon className="size-5" />
            Back
          </Link>

          <button
            className="btn btn-error btn-outline gap-2"
            onClick={handleDelete}
          >
            <Trash2Icon className="size-5" />
            Delete
          </button>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8 space-y-6">

            {/* Title */}
            <div className="relative">
              <FileTextIcon className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                className="input input-bordered w-full pl-10 text-xl font-bold"
                placeholder="Note title"
                value={note.title}
                onChange={(e) =>
                  setNote({ ...note, title: e.target.value })
                }
              />
            </div>

            {/* Content */}
            <div className="relative">
              <PenLineIcon className="absolute left-3 top-3 size-5 text-base-content/40" />
              <textarea
                className="textarea textarea-bordered w-full h-56 pl-10 resize-none"
                placeholder="Write your note here..."
                value={note.content}
                onChange={(e) =>
                  setNote({ ...note, content: e.target.value })
                }
              />
            </div>

            {/* Save Button */}
            <button
              className="btn btn-primary w-full text-lg gap-2"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="size-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
