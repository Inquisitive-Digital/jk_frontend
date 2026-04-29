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
  Briefcase,
} from "lucide-react";
import { adminAPI, serviceAPI, getImageUrl } from "../../Utils/api";
import CreateAdminModal from "./CreateAdminModal";

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",      icon: LayoutDashboard, label: "Dashboard",         path: "/admin-dashboard" },
  { id: "leads",          icon: Target,           label: "All Leads",         path: "/admin/leads" },
  { id: "bookings",       icon: Calendar,         label: "All Bookings",      path: "/admin/bookings" },
  { id: "vehicles",       icon: List,             label: "All Cars",          path: "/admin/vehicles" },
  { id: "add-car",        icon: Plus,             label: "Add Car",           path: "/admin/add-car" },
  { id: "pricing",        icon: DollarSign,       label: "Set Pricing",       path: "/admin/pricing" },
  { id: "all-pricing",    icon: List,             label: "See All Pricing",   path: "/admin/all-pricing" },
  { id: "all-locations",  icon: MapPin,           label: "All Locations",     path: "/admin/locations" },
  { id: "add-location",   icon: MapPinPlus,       label: "Add Location",      path: "/admin/add-location" },
  { id: "all-services",   icon: Briefcase,        label: "All Services",      path: "/admin/services" },
  { id: "add-service",    icon: PenSquare,        label: "Add Service",       path: "/admin/add-service" },
  { id: "all-blogs",      icon: BookOpen,         label: "All Blogs",         path: "/admin/blogs" },
  { id: "add-blog",       icon: PenSquare,        label: "Add Blog",          path: "/admin/add-blog" },
];

// ─── Category badge colours ───────────────────────────────────────────────────
const CATEGORY_COLOURS = {
  "Business Travel":  "bg-blue-50 text-blue-600",
  "Leisure Travel":   "bg-green-50 text-green-600",
  "Airport Travel":   "bg-purple-50 text-purple-600",
  "Chauffeur Service":"bg-amber-50 text-amber-600",
  "Wedding Service":  "bg-pink-50 text-pink-600",
};

// ─── Service row ──────────────────────────────────────────────────────────────
const ServiceRow = ({ service, onEdit, onDelete, onToggle, isDeleting, isToggling }) => {
  const imgSrc = service.image?.url || null;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Image */}
      <td className="p-4">
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {imgSrc ? (
            <img
              src={getImageUrl(imgSrc)}
              alt={service.title}
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

      {/* Title + slug + category */}
      <td className="p-4 max-w-xs">
        <p className="font-semibold text-gray-900 truncate text-sm">{service.title}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{service.slug}</p>
        {service.category && (
          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLOURS[service.category] || "bg-gray-100 text-gray-600"}`}>
            {service.category}
          </span>
        )}
      </td>

      {/* Subtitle */}
      <td className="p-4 text-sm text-gray-600 hidden md:table-cell max-w-[180px]">
        <p className="truncate">{service.subtitle || "—"}</p>
      </td>

      {/* Priority */}
      <td className="p-4 text-sm text-gray-500 hidden xl:table-cell text-center">
        {service.priority ?? 0}
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
            service.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? "bg-green-500" : "bg-red-500"}`} />
          {service.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          {/* View on site */}
          <a
            href={`/services/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="View on site"
          >
            <ExternalLink size={16} />
          </a>

          {/* Toggle active */}
          <button
            onClick={() => onToggle(service)}
            disabled={isToggling === service._id}
            className={`p-2 rounded-lg transition-all ${
              service.isActive
                ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
            }`}
            title={service.isActive ? "Deactivate" : "Activate"}
          >
            {isToggling === service._id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : service.isActive ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(service)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit"
          >
            <PenSquare size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(service)}
            disabled={isDeleting === service._id}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Delete"
          >
            {isDeleting === service._id ? (
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

// ─── Delete confirm modal ─────────────────────────────────────────────────────
const DeleteModal = ({ service, onConfirm, onCancel, isDeleting }) => (
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
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Service?</h3>
      <p className="text-gray-500 text-center text-sm mb-6">
        This will permanently delete <span className="font-semibold text-gray-800">"{service?.title}"</span>.
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

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminAllServices() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  // ── Auth check ──────────────────────────────────────────────────────────
  useEffect(() => {
    const adminData = localStorage.getItem("adminInfo");
    if (!adminData) { navigate("/login-admin"); return; }
  }, [navigate]);

  // ── Sidebar responsive ──────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch services ───────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceAPI.getAllAdmin(page, LIMIT);
      if (data.success) {
        setServices(data.services);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      if (err.response?.status === 401) { navigate("/login-admin"); return; }
      setError("Failed to load services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, navigate]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleEdit = (service) => navigate("/admin/add-service", { state: { serviceId: service._id } });

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeletingId(serviceToDelete._id);
    try {
      await serviceAPI.delete(serviceToDelete._id);
      setServices((prev) => prev.filter((s) => s._id !== serviceToDelete._id));
      setTotal((t) => t - 1);
    } catch {
      setError("Failed to delete service.");
    } finally {
      setDeletingId(null);
      setServiceToDelete(null);
    }
  };

  const handleToggle = async (service) => {
    setTogglingId(service._id);
    try {
      const fd = new FormData();
      fd.append("isActive", String(!service.isActive));
      await serviceAPI.update(service._id, fd);
      setServices((prev) =>
        prev.map((s) => s._id === service._id ? { ...s, isActive: !s.isActive } : s)
      );
    } catch {
      setError("Failed to update service status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => { adminAPI.logout(); navigate("/login-admin"); };

  const handleNavClick = (item) => {
    navigate(item.path);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = search.trim()
    ? services.filter(
        (s) =>
          s.title?.toLowerCase().includes(search.toLowerCase()) ||
          s.slug?.toLowerCase().includes(search.toLowerCase()) ||
          s.category?.toLowerCase().includes(search.toLowerCase()) ||
          s.subtitle?.toLowerCase().includes(search.toLowerCase())
      )
    : services;

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
            const isActive = item.id === "all-services";
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
                  <motion.div layoutId="serviceActiveIndicator" className="ml-auto" initial={false}>
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Services</h2>
                <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                  Manage all services · {total} total
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
                onClick={() => navigate("/admin/add-service")}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30"
              >
                <Plus size={18} />
                <span className="hidden sm:inline font-medium text-sm">New Service</span>
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

          {/* Search + refresh */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, slug, category or subtitle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <button
              onClick={fetchServices}
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
                <p className="text-gray-500 text-sm">Loading services…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Briefcase size={28} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">No services found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {search ? "Try a different search term" : "Create your first service to get started"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => navigate("/admin/add-service")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> Create Service
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
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Subtitle</th>
                      <th className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell w-20">Priority</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((service) => (
                        <ServiceRow
                          key={service._id}
                          service={service}
                          onEdit={handleEdit}
                          onDelete={setServiceToDelete}
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
                  Page {page} of {totalPages} · {total} services
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
        {serviceToDelete && (
          <DeleteModal
            service={serviceToDelete}
            onConfirm={handleDelete}
            onCancel={() => setServiceToDelete(null)}
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

export default AdminAllServices;
