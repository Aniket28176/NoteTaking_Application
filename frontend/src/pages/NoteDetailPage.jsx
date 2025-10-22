import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EditIcon, Trash2Icon, CalendarIcon, ClockIcon, SaveIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../axios";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: ""
  });
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });
  const { id } = useParams();
  const navigate = useNavigate();

  // Character limits
  const LIMITS = {
    title: 100,
    content: 5000
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notes/${id}`);
      const noteData = response.data;
      setNote(noteData);
      setEditFormData({
        title: noteData.title || "",
        content: noteData.content || ""
      });
    } catch (error) {
      console.error("Error fetching note:", error);
      toast.error("Failed to load note");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Update character count when editing
  useEffect(() => {
    if (isEditing) {
      setCharCount({
        title: editFormData.title.length,
        content: editFormData.content.length
      });
    }
  }, [editFormData, isEditing]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setEditFormData({
        title: note.title,
        content: note.content
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEditForm = () => {
    const trimmedTitle = editFormData.title.trim();
    const trimmedContent = editFormData.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Please fill in both title and content");
      return false;
    }

    if (trimmedTitle.length > LIMITS.title) {
      toast.error(`Title must be less than ${LIMITS.title} characters`);
      return false;
    }

    if (trimmedContent.length > LIMITS.content) {
      toast.error(`Content must be less than ${LIMITS.content} characters`);
      return false;
    }

    return true;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) return;

    setEditLoading(true);
    try {
      const response = await api.put(`/notes/${id}`, {
        title: editFormData.title.trim(),
        content: editFormData.content.trim()
      });
      
      setNote(response.data);
      setIsEditing(false);
      toast.success("Note updated successfully! 🎉");
    } catch (error) {
      console.error("Error updating note:", error);
      if (error.response?.status === 404) {
        toast.error("Note not found");
        navigate("/");
      } else {
        toast.error("Failed to update note. Please try again.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const getCharCountColor = (count, limit) => {
    if (count > limit) return "text-red-500";
    if (count > limit * 0.9) return "text-yellow-500";
    return "text-gray-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-gray-700 rounded mb-8"></div>
              <div className="bg-gray-800/60 rounded-2xl p-8">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Note Not Found</h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors duration-200 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg px-4 py-2 backdrop-blur-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Notes
            </Link>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    disabled={editLoading}
                    className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <XIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleEditSubmit}
                    disabled={editLoading}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {editLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2Icon className="w-4 h-4" />
                    )}
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Note Card */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            {/* Note Header */}
            <div className="border-b border-gray-700/50 pb-6 mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-200">
                        Title
                      </label>
                      <span className={`text-xs ${getCharCountColor(charCount.title, LIMITS.title)}`}>
                        {charCount.title}/{LIMITS.title}
                      </span>
                    </div>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      value={editFormData.title}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                      maxLength={LIMITS.title}
                      disabled={editLoading}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                    {note.title}
                  </h1>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Created: {formatDate(note.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>At: {formatTime(note.createdAt)}</span>
                    </div>

                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Note Content */}
            <div className="prose prose-invert max-w-none">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-200">
                      Content
                    </label>
                    <span className={`text-xs ${getCharCountColor(charCount.content, LIMITS.content)}`}>
                      {charCount.content}/{LIMITS.content}
                    </span>
                  </div>
                  <textarea
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none h-64 leading-relaxed"
                    value={editFormData.content}
                    onChange={(e) => handleEditChange("content", e.target.value)}
                    maxLength={LIMITS.content}
                    disabled={editLoading}
                  />
                </div>
              ) : (
                <div className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">
                  {note.content}
                </div>
              )}
            </div>

            {/* Last Updated Info */}
            {!isEditing && note.updatedAt && note.updatedAt !== note.createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-gray-500 text-sm text-center">
                  Last updated on {formatDate(note.updatedAt)} at {formatTime(note.updatedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          {!isEditing && (
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <EditIcon className="w-4 h-4" />
                Edit Note
              </button>
              
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2Icon className="w-4 h-4" />
                Delete Note
              </button>
            </div>
          )}

          {/* Edit Mode Tips */}
          {isEditing && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                💡 Make your changes and click Save to update the note
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;