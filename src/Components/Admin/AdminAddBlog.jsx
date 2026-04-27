import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Save, Image as ImageIcon, Loader2, Plus, Trash2,
  Settings, BookOpen, User, AlignLeft, List, Search, AlertCircle,
} from "lucide-react";
import { blogAPI, getImageUrl } from "../../Utils/api";
import { toast } from "react-toastify";

// ─── helpers ────────────────────────────────────────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EMPTY_SECTION = () => ({ heading: "", subheading: "", text: "", listItems: [] });

const INITIAL_FORM = {
  title: "",
  slug: "",
  intro: "",
  excerpt: "",
  author: "JK Executive Chauffeurs",
  category: "",
  seoTitle: "",
  seoDescription: "",
  isActive: true,
  priority: 0,
  publishDate: new Date().toISOString().split("T")[0],
};

// ─── Section card ────────────────────────────────────────────────────────────
function SectionCard({ section, index, onChange, onRemove }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-700 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">
          Section {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Heading (H2)
            </label>
            <input
              type="text"
              value={section.heading || ""}
              onChange={(e) => onChange(index, "heading", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Section heading"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Subheading (H3) — Optional
            </label>
            <input
              type="text"
              value={section.subheading || ""}
              onChange={(e) => onChange(index, "subheading", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Optional subheading"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Paragraph Text
          </label>
          <textarea
            value={section.text || ""}
            onChange={(e) => onChange(index, "text", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y"
            placeholder="Write the content for this section..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide flex items-center gap-1">
            <List size={13} /> Bullet Points <span className="font-normal normal-case">(one per line)</span>
          </label>
          <textarea
            value={Array.isArray(section.listItems) ? section.listItems.join("\n") : ""}
            onChange={(e) =>
              onChange(
                index,
                "listItems",
                e.target.value.split("\n").filter((l) => l.trim() !== "")
              )
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y"
            placeholder={"First item\nSecond item\nThird item"}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function AdminAddBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const editBlogId = location.state?.blogId ?? null;
  const isEditing = !!editBlogId;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [sections, setSections] = useState([]);
  const [heroImage, setHeroImage] = useState(null);          // File object
  const [heroImagePreview, setHeroImagePreview] = useState(null); // URL string
  const [isLoading, setIsLoading] = useState(false);          // submit
  const [isFetching, setIsFetching] = useState(isEditing);    // initial load
  const [error, setError] = useState(null);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("adminInfo")) navigate("/login-admin");
  }, [navigate]);

  // ── Fetch blog for edit mode ─────────────────────────────────────────────
  const loadBlog = useCallback(async () => {
    if (!editBlogId) return;
    setIsFetching(true);
    setError(null);
    try {
      const res = await blogAPI.getById(editBlogId);
      if (!res.success || !res.blog) throw new Error("Blog not found");

      const b = res.blog;
      setFormData({
        title: b.title || "",
        slug: b.slug || "",
        intro: b.intro || "",
        excerpt: b.excerpt || "",
        author: b.author || "JK Executive Chauffeurs",
        category: b.category || "",
        seoTitle: b.seoTitle || "",
        seoDescription: b.seoDescription || "",
        isActive: b.isActive ?? true,
        priority: b.priority ?? 0,
        publishDate: b.publishDate
          ? new Date(b.publishDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setSections(b.sections || []);
      const imgUrl = b.heroImageUrl || b.heroImage?.url || null;
      if (imgUrl) setHeroImagePreview(getImageUrl(imgUrl));
    } catch (err) {
      setError("Could not load blog data. Please go back and try again.");
    } finally {
      setIsFetching(false);
    }
  }, [editBlogId]);

  useEffect(() => { if (isEditing) loadBlog(); }, [isEditing, loadBlog]);

  // ── Field change ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === "checkbox" ? checked : value;
    setFormData((prev) => {
      const next = { ...prev, [name]: newVal };
      // Auto-slug from title only when creating new
      if (name === "title" && !isEditing) next.slug = toSlug(value);
      return next;
    });
  };

  // ── Image ────────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImage(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  // ── Section operations ───────────────────────────────────────────────────
  const addSection = () => setSections((prev) => [...prev, EMPTY_SECTION()]);

  const removeSection = (idx) =>
    setSections((prev) => prev.filter((_, i) => i !== idx));

  const handleSectionChange = (idx, field, value) =>
    setSections((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const fd = new FormData();

      // Text fields
      fd.append("title", formData.title.trim());
      fd.append("slug", formData.slug.trim());
      fd.append("intro", formData.intro);
      fd.append("excerpt", formData.excerpt);
      fd.append("author", formData.author);
      fd.append("category", formData.category);
      fd.append("seoTitle", formData.seoTitle);
      fd.append("seoDescription", formData.seoDescription);
      // isActive must be a string "true"/"false" for FormData
      fd.append("isActive", String(formData.isActive));
      fd.append("priority", String(formData.priority));
      fd.append("publishDate", formData.publishDate);

      // Sections as JSON string
      fd.append("sections", JSON.stringify(sections));

      // Hero image — only if a new file was picked
      if (heroImage) fd.append("heroImage", heroImage);

      if (isEditing) {
        await blogAPI.update(editBlogId, fd);
        toast.success("✅ Blog updated successfully!");
      } else {
        await blogAPI.create(fd);
        toast.success("✅ Blog published successfully!");
      }
      navigate("/admin/blogs");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save blog";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading blog details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* ── Sticky top bar ── */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
              title="Back to blog list"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {isEditing ? `Editing: ${formData.slug}` : "Fill in the details below"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 active:scale-95"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditing ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </header>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 mt-4"
          >
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Two-column layout ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ──── LEFT — main content ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" /> Basic Details
              </h2>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Top 5 Airports for Luxury Travel"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      (auto-generated from title)
                    </span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                    <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-xs border-r border-gray-200 whitespace-nowrap">
                      /blog/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="your-blog-url"
                      className="flex-1 px-3 py-2.5 outline-none text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Intro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Introduction
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      (displayed before sections)
                    </span>
                  </label>
                  <textarea
                    name="intro"
                    value={formData.intro}
                    onChange={handleChange}
                    rows={3}
                    placeholder="A brief intro paragraph at the top of the post…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-y text-sm"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Excerpt
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      (shown on the blog listing card)
                    </span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={2}
                    placeholder="One or two sentences summarising the post…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-y text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sections builder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <AlignLeft size={18} className="text-blue-600" /> Content Sections
                </h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus size={15} /> Add Section
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {sections.map((section, i) => (
                    <SectionCard
                      key={i}
                      section={section}
                      index={i}
                      onChange={handleSectionChange}
                      onRemove={removeSection}
                    />
                  ))}
                </AnimatePresence>

                {sections.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <AlignLeft size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">No sections yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click <strong>Add Section</strong> to start building your content
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ──── RIGHT — sidebar ─────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Hero image upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-600" /> Featured Image
              </h2>
              <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden group">
                {heroImagePreview ? (
                  <>
                    <img
                      src={heroImagePreview}
                      alt="Hero preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-lg">
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 p-4 text-center">
                    <ImageIcon size={32} />
                    <span className="text-sm"><strong>Click to upload</strong></span>
                    <span className="text-xs">PNG, JPG, WEBP up to 5 MB</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Publishing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" /> Publishing
              </h2>
              <div className="space-y-4">
                {/* Active toggle */}
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">Status</span>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                          formData.isActive ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          formData.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        formData.isActive ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {formData.isActive ? "Published (Active)" : "Draft (Hidden)"}
                    </span>
                  </label>
                </div>

                {/* Publish date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower number = appears first</p>
                </div>
              </div>
            </div>

            {/* Author / Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Author & Category
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Travel Tips, News"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search size={18} className="text-blue-600" /> SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="Defaults to blog title if empty"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="150–160 characters for best SEO results"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-y text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.seoDescription.length} / 160 chars
                  </p>
                </div>
              </div>
            </div>

          </div>{/* end sidebar */}
        </div>
      </div>
    </div>
  );
}

export default AdminAddBlog;
