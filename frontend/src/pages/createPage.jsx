import { ArrowLeftIcon, FileTextIcon, PenLineIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully");
      navigate("/");
    } catch {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center">
      <div className="max-w-3xl w-full mx-auto px-4 py-10">

        {/* Back Button */}
        <Link to="/" className="btn btn-ghost mb-6 gap-2">
          <ArrowLeftIcon className="size-5" />
          Back to Notes
        </Link>

        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">

            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-6">
              📝 Create New Note
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title Input */}
              <div className="form-control">
                <label className="label font-semibold">Title</label>
                <div className="relative">
                  <FileTextIcon className="absolute left-3 top-3 size-5 text-base-content/50" />
                  <input
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="form-control">
                <label className="label font-semibold">Content</label>
                <div className="relative">
                  <PenLineIcon className="absolute left-3 top-3 size-5 text-base-content/50" />
                  <textarea
                    className="textarea textarea-bordered w-full h-44 pl-10 resize-none"
                    placeholder="Write your thoughts here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>

              {/* Button */}
              <button
                className="btn btn-primary w-full text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Note 🚀"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
