import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../axios";


const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!title.trim() || !content.trim()){
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes",{
        title,
        content
      })
      toast.success("Note created successfully!")
      Navigate("/")
    } catch (error) {
      console.log("Error creating note",error);
      toast.error("Failed to create note");
    } finally{
      setLoading(false)
    }; 
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-200 hover:text-white mb-6 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Notes
          </Link>

          <h2 className="text-3xl font-semibold mb-6 text-center">
            Create New Note
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                placeholder="Enter note title"
                className="w-full p-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                placeholder="Write your note..."
                className="w-full p-3 rounded-lg bg-gray-100 text-black h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
