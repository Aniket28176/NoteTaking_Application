import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../axios";

const CreatePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });
  const navigate = useNavigate();

  // Character limits
  const LIMITS = {
    title: 100,
    content: 5000
  };

  // Auto-save to localStorage
  useEffect(() => {
    const draft = localStorage.getItem('noteDraft');
    if (draft) {
      try {
        const { title, content } = JSON.parse(draft);
        setFormData({ title: title || "", content: content || "" });
        toast.success("Draft restored", { icon: "💾", duration: 2000 });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Update character count and auto-save
  useEffect(() => {
    setCharCount({
      title: formData.title.length,
      content: formData.content.length
    });

    if (formData.title || formData.content) {
      const autoSave = setTimeout(() => {
        localStorage.setItem('noteDraft', JSON.stringify(formData));
      }, 1500);
      
      return () => clearTimeout(autoSave);
    }
  }, [formData]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

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

  const clearDraft = () => {
    localStorage.removeItem('noteDraft');
    setFormData({ title: "", content: "" });
    toast.success("Draft cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/notes", {
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      
      // Clear draft on success
      localStorage.removeItem('noteDraft');
      
      toast.success("Note created successfully! 🎉");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCharCountColor = (count, limit) => {
    if (count > limit) return "text-red-500";
    if (count > limit * 0.9) return "text-yellow-500";
    return "text-gray-400";
  };

  const isFormEmpty = !formData.title.trim() && !formData.content.trim();
  const hasDraft = localStorage.getItem('noteDraft');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors duration-200 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg px-4 py-2 backdrop-blur-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Notes
            </Link>
            
            {hasDraft && (
              <button
                onClick={clearDraft}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm bg-gray-800/30 hover:bg-red-500/10 rounded-lg px-3 py-1"
                title="Clear saved draft"
              >
                Clear Draft
              </button>
            )}
          </div>

          {/* Main Card */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Create New Note
              </h1>
              <p className="text-gray-400">
                {hasDraft ? "Continue editing your draft" : "Start capturing your thoughts"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
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
                  placeholder="What's this note about?"
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  maxLength={LIMITS.title}
                  disabled={loading}
                />
              </div>

              {/* Content Field */}
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
                  placeholder="Write your thoughts here..."
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-64 leading-relaxed"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  maxLength={LIMITS.content}
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600">
                    Ctrl + Enter
                  </kbd>
                  <span>to save</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || isFormEmpty}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Note
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Draft Indicator */}
            {hasDraft && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Draft auto-saved locally
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              💡 Your note will be saved automatically as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;