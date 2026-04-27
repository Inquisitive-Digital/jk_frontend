import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Car,
  DollarSign,
  Target,
  List,
  Plus,
  MapPin,
  MapPinPlus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  PenSquare,
  Trash2,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  ExternalLink,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { adminAPI, blogAPI, getImageUrl } from "../../Utils/api";
import CreateAdminModal from "./CreateAdminModal";

// ─── Sidebar nav (same structure as AdminDashboard) ─────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",      icon: LayoutDashboard, label: "Dashboard",       path: "/admin-dashboard" },
  { id: "leads",          icon: Target,           label: "All Leads",       path: "/admin/leads" },
  { id: "bookings",       icon: Calendar,         label: "All Bookings",    path: "/admin/bookings" },
  { id: "vehicles",       icon: List,             label: "All Cars",        path: "/admin/vehicles" },
  { id: "add-car",        icon: Plus,             label: "Add Car",         path: "/admin/add-car" },
  { id: "pricing",        icon: DollarSign,       label: "Set Pricing",     path: "/admin/pricing" },
  { id: "all-pricing",    icon: List,             label: "See All Pricing", path: "/admin/all-pricing" },
  { id: "all-locations",  icon: MapPin,           label: "All Locations",   path: "/admin/locations" },
  { id: "add-location",   icon: MapPinPlus,       label: "Add Location",    path: "/admin/add-location" },
  { id: "all-blogs",      icon: BookOpen,         label: "All Blogs",       path: "/admin/blogs" },
  { id: "add-blog",       icon: PenSquare,        label: "Add Blog",        path: "/admin/add-blog" },
];

// ─── Blog row card ───────────────────────────────────────────────────────────
const BlogRow = ({ blog, onEdit, onDelete, onToggle, isDeleting, isToggling }) => {
  const imgSrc = blog.heroImageUrl || blog.heroImage?.url || null;
  const publishedDate = blog.publishDate
    ? new Date(blog.publishDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : new Date(blog.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Hero image */}
      <td className="p-4">
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {imgSrc ? (
            <img
              src={getImageUrl(imgSrc)}
              alt={blog.heroImageAlt || blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText size={20} className="text-gray-300" />
            </div>
          )}
        </div>
      </td>

      {/* Title + slug */}
      <td className="p-4 max-w-xs">
        <p className="font-semibold text-gray-900 truncate text-sm">{blog.title}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{blog.slug}</p>
        {blog.category && (
          <span className="mt-1 inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {blog.category}
          </span>
        )}
      </td>

      {/* Author */}
      <td className="p-4 text-sm text-gray-600 hidden md:table-cell">
        {blog.author || "JK Executive"}
      </td>

      {/* Date */}
      <td className="p-4 text-sm text-gray-500 hidden lg:table-cell whitespace-nowrap">
        {publishedDate}
      </td>

      {/* Priority */}
      <td className="p-4 text-sm text-gray-500 hidden xl:table-cell text-center">
        {blog.priority ?? 0}
      </td>

      {/* Status badge */}
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
            blog.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${blog.isActive ? "bg-green-500" : "bg-red-500"}`} />
          {blog.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          {/* View on site */}
          <a
            href={`/blog/${blog.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="View on site"
          >
            <ExternalLink size={16} />
          </a>

          {/* Toggle active */}
          <button
            onClick={() => onToggle(blog)}
            disabled={isToggling === blog._id}
            className={`p-2 rounded-lg transition-all ${
              blog.isActive
                ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
            }`}
            title={blog.isActive ? "Deactivate" : "Activate"}
          >
            {isToggling === blog._id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : blog.isActive ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(blog)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit"
          >
            <PenSquare size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(blog)}
            disabled={isDeleting === blog._id}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Delete"
          >
            {isDeleting === blog._id ? (
              <Loader2 size={16} className="animate-spin text-red-500" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

// ─── Delete confirm modal ────────────────────────────────────────────────────
const DeleteModal = ({ blog, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
    >
      <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-2xl mx-auto mb-4">
        <Trash2 size={24} className="text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Blog Post?</h3>
      <p className="text-gray-500 text-center text-sm mb-6">
        This will permanently delete <span className="font-semibold text-gray-800">"{blog?.title}"</span>.
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
function AdminAllBlogs() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  // ── Auth check ──────────────────────────────────────────────────────────
  useEffect(() => {
    const adminData = localStorage.getItem("adminInfo");
    if (!adminData) { navigate("/login-admin"); return; }
    setAdminInfo(JSON.parse(adminData));
  }, [navigate]);

  // ── Sidebar responsive ──────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch blogs ─────────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await blogAPI.getAllAdmin(page, LIMIT);
      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      if (err.response?.status === 401) { navigate("/login-admin"); return; }
      setError("Failed to load blog posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, navigate]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleEdit = (blog) => navigate("/admin/add-blog", { state: { blogId: blog._id } });

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setDeletingId(blogToDelete._id);
    try {
      await blogAPI.delete(blogToDelete._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete._id));
      setTotal((t) => t - 1);
    } catch {
      setError("Failed to delete blog post.");
    } finally {
      setDeletingId(null);
      setBlogToDelete(null);
    }
  };

  const handleToggle = async (blog) => {
    setTogglingId(blog._id);
    try {
      const fd = new FormData();
      fd.append("isActive", String(!blog.isActive));
      await blogAPI.update(blog._id, fd);
      setBlogs((prev) =>
        prev.map((b) => b._id === blog._id ? { ...b, isActive: !b.isActive } : b)
      );
    } catch {
      setError("Failed to update blog status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => { adminAPI.logout(); navigate("/login-admin"); };

  const handleNavClick = (item) => {
    navigate(item.path);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // ── Filtered list (client-side search on current page) ──────────────────
  const filtered = search.trim()
    ? blogs.filter(
        (b) =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.slug?.toLowerCase().includes(search.toLowerCase()) ||
          b.category?.toLowerCase().includes(search.toLowerCase())
      )
    : blogs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay – mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -288 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-40 shadow-2xl overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/JkLogo.png" alt="JK Logo" className="w-11 h-11 object-contain" />
              <div>
                <h1 className="font-bold text-lg tracking-tight">JK Chauffeur</h1>
                <p className="text-slate-400 text-xs font-medium">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-700/50 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === "all-blogs";
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1"
                }`}
              >
                <item.icon size={20} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="blogActiveIndicator" className="ml-auto" initial={false}>
                    <ChevronRight size={18} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                {isSidebarOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Blog Posts</h2>
                <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                  Manage all blog articles · {total} total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsCreateAdminModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/30"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline font-medium text-sm">Create Admin</span>
              </button>
              <button
                onClick={() => navigate("/admin/add-blog")}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30"
              >
                <Plus size={18} />
                <span className="hidden sm:inline font-medium text-sm">New Blog</span>
              </button>
              <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl mb-6 border border-red-200"
              >
                <AlertCircle size={20} />
                <span className="flex-1 text-sm">{error}</span>
                <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg transition-colors"><X size={16} /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + refresh bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, slug or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <button
              onClick={fetchBlogs}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={36} className="animate-spin text-blue-600" />
                <p className="text-gray-500 text-sm">Loading blog posts…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <BookOpen size={28} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">No blog posts found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {search ? "Try a different search term" : "Create your first blog post to get started"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => navigate("/admin/add-blog")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> Create Blog Post
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Image</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Title / Slug</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                      <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell w-20">Priority</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((blog) => (
                        <BlogRow
                          key={blog._id}
                          blog={blog}
                          onEdit={handleEdit}
                          onDelete={setBlogToDelete}
                          onToggle={handleToggle}
                          isDeleting={deletingId}
                          isToggling={togglingId}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages} · {total} posts
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {blogToDelete && (
          <DeleteModal
            blog={blogToDelete}
            onConfirm={handleDelete}
            onCancel={() => setBlogToDelete(null)}
            isDeleting={!!deletingId}
          />
        )}
      </AnimatePresence>

      {/* Create Admin modal */}
      <CreateAdminModal
        isOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default AdminAllBlogs;
