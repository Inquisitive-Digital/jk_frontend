import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Save, Image as ImageIcon, Loader2, Plus, Trash2,
  Settings, BookOpen, User, AlignLeft, List, Search, AlertCircle,
  HelpCircle, Code, X
} from "lucide-react";
import { blogAPI, getImageUrl } from "../../Utils/api";
import { toast } from "react-toastify";

// ─── helpers ────────────────────────────────────────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EMPTY_SUBSECTION = () => ({ subheading: "", text: "", listItems: [] });
const EMPTY_SECTION = () => ({ heading: "", subsections: [EMPTY_SUBSECTION()] });
const EMPTY_FAQ    = () => ({ question: "", answer: "", tag: "FAQ" });

/**
 * Prevents the page from scrolling while the user is scrolling inside a textarea.
 * Propagation is only stopped when the textarea can still scroll in that direction;
 * once it hits the top/bottom boundary the event falls through to the page.
 */
const stopTextareaScroll = (e) => {
  const el = e.currentTarget;
  const { scrollTop, scrollHeight, clientHeight } = el;
  const atTop    = scrollTop === 0 && e.deltaY < 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
  if (!atTop && !atBottom) e.stopPropagation();
};

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
function SectionCard({ section, index, onChange, onRemove, onAddSubsection, onRemoveSubsection, onChangeSubsection }) {
  const subsections = section.subsections || [];

  // For backward compatibility: if a section has old top-level content
  const hasOldContent = !!(section.subheading || section.text || (section.listItems && section.listItems.length > 0));

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

        {/* Backward Compatibility Render */}
        {hasOldContent && (
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg space-y-4 mt-4">
            <p className="text-xs text-orange-600 font-semibold mb-2">Legacy Content Block</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Subheading (H3)</label>
              <input type="text" value={section.subheading || ""} onChange={(e) => onChange(index, "subheading", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Paragraph Text</label>
              <textarea value={section.text || ""} onChange={(e) => onChange(index, "text", e.target.value)} onWheel={stopTextareaScroll} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-y" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide flex items-center gap-1"><List size={13} /> Bullet Points</label>
              <textarea value={Array.isArray(section.listItems) ? section.listItems.join("\n") : ""} onChange={(e) => onChange(index, "listItems", e.target.value.split("\n").filter(l => l.trim() !== ""))} onWheel={stopTextareaScroll} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-y" />
            </div>
          </div>
        )}

        {/* Subsections Array */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
               Content Blocks (Subheadings)
             </label>
             <button
                type="button"
                onClick={() => onAddSubsection(index)}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 text-blue-600 rounded hover:bg-blue-50 transition-colors"
             >
                <Plus size={14} /> Add Block
             </button>
          </div>

          {subsections.map((sub, subIdx) => (
            <div key={subIdx} className="p-4 border border-gray-200 bg-white rounded-lg relative space-y-4">
              <button
                type="button"
                onClick={() => onRemoveSubsection(index, subIdx)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Remove Block"
              >
                <Trash2 size={14} />
              </button>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Subheading (H3) — Optional
                </label>
                <input
                  type="text"
                  value={sub.subheading || ""}
                  onChange={(e) => onChangeSubsection(index, subIdx, "subheading", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Optional subheading"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Paragraph Text
                </label>
                <textarea
                  value={sub.text || ""}
                  onChange={(e) => onChangeSubsection(index, subIdx, "text", e.target.value)}
                  onWheel={stopTextareaScroll}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y overflow-y-auto"
                  placeholder="Write the content for this section..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide flex items-center gap-1">
                  <List size={13} /> Bullet Points <span className="font-normal normal-case">(one per line)</span>
                </label>
                <textarea
                  value={Array.isArray(sub.listItems) ? sub.listItems.join("\n") : ""}
                  onChange={(e) =>
                    onChangeSubsection(
                      index,
                      subIdx,
                      "listItems",
                      e.target.value.split("\n").filter((l) => l.trim() !== "")
                    )
                  }
                  onWheel={stopTextareaScroll}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y overflow-y-auto"
                  placeholder={"First item\nSecond item\nThird item"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── FAQ card ────────────────────────────────────────────────────────────────
function FaqCard({ faq, index, onChange, onRemove }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border border-amber-200 rounded-xl p-5 bg-amber-50 relative"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg">
          FAQ {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Question</label>
          <input
            type="text"
            value={faq.question || ""}
            onChange={(e) => onChange(index, "question", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="e.g. How do I book a chauffeur?"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Answer</label>
          <textarea
            value={faq.answer || ""}
            onChange={(e) => onChange(index, "answer", e.target.value)}
            onWheel={stopTextareaScroll}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-y overflow-y-auto"
            placeholder="Provide a clear and helpful answer…"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Tag <span className="font-normal normal-case text-gray-400">(optional label shown above question)</span>
          </label>
          <input
            type="text"
            value={faq.tag || ""}
            onChange={(e) => onChange(index, "tag", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="e.g. Booking, Pricing, General"
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
  const [faqs, setFaqs] = useState([]);
  const [showHtmlImportModal, setShowHtmlImportModal] = useState(false);
  const [htmlImportContent, setHtmlImportContent] = useState("");
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
      setFaqs(b.faqs || []);
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

  const addSubsection = (secIdx) => {
    setSections((prev) => {
      const next = [...prev];
      const subsections = next[secIdx].subsections || [];
      next[secIdx] = { ...next[secIdx], subsections: [...subsections, EMPTY_SUBSECTION()] };
      return next;
    });
  };

  const removeSubsection = (secIdx, subIdx) => {
    setSections((prev) => {
      const next = [...prev];
      const subsections = [...(next[secIdx].subsections || [])];
      subsections.splice(subIdx, 1);
      next[secIdx] = { ...next[secIdx], subsections };
      return next;
    });
  };

  const handleSubsectionChange = (secIdx, subIdx, field, value) => {
    setSections((prev) => {
      const next = [...prev];
      const subsections = [...(next[secIdx].subsections || [])];
      subsections[subIdx] = { ...subsections[subIdx], [field]: value };
      next[secIdx] = { ...next[secIdx], subsections };
      return next;
    });
  };

  const handleHtmlImport = () => {
    if (!htmlImportContent.trim()) {
      toast.error("Please paste some HTML content first");
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlImportContent, "text/html");
    const newSections = [];

    // Find all H2s, then extract subsequent siblings until the next H2
    const h2s = Array.from(doc.querySelectorAll("h2"));

    h2s.forEach((h2) => {
      const section = { heading: h2.textContent.trim(), subsections: [] };
      let currentNode = h2.nextElementSibling;
      let currentSub = null;

      while (currentNode && currentNode.tagName !== "H2") {
        if (currentNode.tagName === "H3") {
          if (currentSub) section.subsections.push(currentSub);
          currentSub = { subheading: currentNode.textContent.trim(), text: "", listItems: [] };
        } else if (currentNode.tagName === "P") {
          if (!currentSub) currentSub = { subheading: "", text: "", listItems: [] };
          currentSub.text += (currentSub.text ? "\n\n" : "") + currentNode.textContent.trim();
        } else if (currentNode.tagName === "UL" || currentNode.tagName === "OL") {
          if (!currentSub) currentSub = { subheading: "", text: "", listItems: [] };
          const lis = Array.from(currentNode.querySelectorAll("li")).map((li) => li.textContent.trim());
          currentSub.listItems = [...currentSub.listItems, ...lis];
        }
        currentNode = currentNode.nextElementSibling;
      }
      
      if (currentSub) section.subsections.push(currentSub);
      if (section.subsections.length === 0) {
        section.subsections.push({ subheading: "", text: "", listItems: [] });
      }

      newSections.push(section);
    });

    if (newSections.length > 0) {
      setSections((prev) => [...prev, ...newSections]);
      toast.success(`Successfully imported ${newSections.length} section(s)!`);
      setShowHtmlImportModal(false);
      setHtmlImportContent("");
    } else {
      toast.error("No valid H2 sections found in the HTML.");
    }
  };

  // ── FAQ operations ───────────────────────────────────────────────────────
  const addFaq = () => setFaqs((prev) => [...prev, EMPTY_FAQ()]);

  const removeFaq = (idx) =>
    setFaqs((prev) => prev.filter((_, i) => i !== idx));

  const handleFaqChange = (idx, field, value) =>
    setFaqs((prev) => {
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

      // FAQs as JSON string
      fd.append("faqs", JSON.stringify(faqs));

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
                    onWheel={stopTextareaScroll}
                    rows={3}
                    placeholder="A brief intro paragraph at the top of the post…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-y overflow-y-auto text-sm"
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
                    onWheel={stopTextareaScroll}
                    rows={2}
                    placeholder="One or two sentences summarising the post…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-y overflow-y-auto text-sm"
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHtmlImportModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Code size={15} /> Import HTML
                  </button>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus size={15} /> Add Section
                  </button>
                </div>
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
                      onAddSubsection={addSubsection}
                      onRemoveSubsection={removeSubsection}
                      onChangeSubsection={handleSubsectionChange}
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

            {/* FAQ builder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle size={18} className="text-amber-500" /> FAQ Section
                  <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </h2>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus size={15} /> Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {faqs.map((faq, i) => (
                    <FaqCard
                      key={i}
                      faq={faq}
                      index={i}
                      onChange={handleFaqChange}
                      onRemove={removeFaq}
                    />
                  ))}
                </AnimatePresence>

                {faqs.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-xl">
                    <HelpCircle size={28} className="mx-auto text-amber-200 mb-2" />
                    <p className="text-sm font-medium text-gray-500">No FAQs yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click <strong>Add FAQ</strong> to add questions &amp; answers
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
                    onWheel={stopTextareaScroll}
                    rows={3}
                    placeholder="150–160 characters for best SEO results"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-y overflow-y-auto text-sm"
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

      {/* HTML Import Modal */}
      <AnimatePresence>
        {showHtmlImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Code size={18} className="text-blue-600" />
                  Import Sections from HTML
                </h3>
                <button
                  onClick={() => setShowHtmlImportModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-sm text-gray-500 mb-4">
                  Paste your raw HTML code below. The system will extract all <code>&lt;h2&gt;</code> tags as new sections, picking up subsequent <code>&lt;h3&gt;</code> for subheadings, <code>&lt;p&gt;</code> for text, and <code>&lt;ul&gt;/&lt;li&gt;</code> for bullet points.
                </p>
                <textarea
                  value={htmlImportContent}
                  onChange={(e) => setHtmlImportContent(e.target.value)}
                  placeholder="<h2>Section 1</h2><p>Some text here...</p>..."
                  className="w-full h-64 p-4 text-sm font-mono text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y"
                />
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button
                  onClick={() => setShowHtmlImportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHtmlImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Code size={16} /> Parse & Import
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminAddBlog;
