import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Plus, Pencil, Trash2, Loader2, ChevronLeft,
  ChevronRight, Link2, Search, RefreshCw, LayoutDashboard,
  Calendar, Car, DollarSign, Users, LogOut, Menu, X,
  Target, MapPin, MapPinPlus, List, CheckCircle, AlertCircle,
  Briefcase, PenSquare, BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import { calendarEventAPI, adminAPI } from "../../Utils/api";
import AdminEventModal from "./AdminEventModal";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CATEGORY_COLORS = {
  Sports: "bg-blue-100 text-blue-700",
  Corporate: "bg-purple-100 text-purple-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Exhibition: "bg-orange-100 text-orange-700",
  Cultural: "bg-green-100 text-green-700",
  General: "bg-gray-100 text-gray-700",
};

const NAV_ITEMS = [
  { id: "dashboard",       icon: LayoutDashboard, label: "Dashboard",       path: "/admin-dashboard" },
  { id: "leads",           icon: Target,          label: "All Leads",       path: "/admin/leads" },
  { id: "bookings",        icon: Calendar,        label: "All Bookings",    path: "/admin/bookings" },
  { id: "vehicles",        icon: List,            label: "All Cars",        path: "/admin/vehicles" },
  { id: "add-car",         icon: Plus,            label: "Add Car",         path: "/admin/add-car" },
  { id: "pricing",         icon: DollarSign,      label: "Set Pricing",     path: "/admin/pricing" },
  { id: "all-pricing",     icon: List,            label: "See All Pricing", path: "/admin/all-pricing" },
  { id: "all-locations",   icon: MapPin,          label: "All Locations",   path: "/admin/locations" },
  { id: "add-location",    icon: MapPinPlus,      label: "Add Location",    path: "/admin/add-location" },
  { id: "all-services",    icon: Briefcase,       label: "All Services",    path: "/admin/services" },
  { id: "add-service",     icon: PenSquare,       label: "Add Service",     path: "/admin/add-service" },
  { id: "all-blogs",       icon: BookOpen,        label: "All Blogs",       path: "/admin/blogs" },
  { id: "add-blog",        icon: PenSquare,       label: "Add Blog",        path: "/admin/add-blog" },
  { id: "event-calendar",  icon: CalendarDays,    label: "Event Calendar",  path: "/admin/event-calendar" },
];

function AdminEventCalendar() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNav] = useState("event-calendar");

  const [calendarData, setCalendarData] = useState([]);   // grouped by month
  const [allEvents, setAllEvents] = useState([]);          // flat list
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(2026);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { year: selectedYear, includeInactive: "true" };
      if (selectedMonth !== "All") params.month = selectedMonth;
      const res = await calendarEventAPI.getAll(params);
      setAllEvents(res.events || []);
      setCalendarData(res.calendarData || []);
    } catch (err) {
      toast.error("Failed to load calendar events", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const adminData = localStorage.getItem("adminInfo");
    if (!adminData) { navigate("/login-admin"); return; }
    loadEvents();
  }, [loadEvents, navigate]);

  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
    const handleResize = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); else setIsSidebarOpen(true); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (deleteConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [deleteConfirm]);

  const handleLogout = () => { adminAPI.logout(); navigate("/login-admin"); };
  const handleNavClick = (item) => { navigate(item.path); if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const openCreate = () => { setEditingEvent(null); setIsModalOpen(true); };
  const openEdit = (evt) => { setEditingEvent(evt); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await calendarEventAPI.delete(id);
      toast.success("Event deleted", { position: "top-center", autoClose: 2500 });
      setDeleteConfirm(null);
      loadEvents();
    } catch {
      toast.error("Failed to delete event", { position: "top-center" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter events for the list view
  const filteredEvents = allEvents.filter(evt => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || evt.name?.toLowerCase().includes(q) || evt.date?.toLowerCase().includes(q) || evt.location?.toLowerCase().includes(q);
    const matchMonth = selectedMonth === "All" || evt.month === selectedMonth;
    return matchSearch && matchMonth;
  });

  // Group filtered events by month for the calendar view
  const grouped = {};
  for (const evt of filteredEvents) {
    if (!grouped[evt.month]) grouped[evt.month] = [];
    grouped[evt.month].push(evt);
  }
  const groupedMonths = MONTHS.filter(m => grouped[m]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar overlay on mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden"/>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -288 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-40 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
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
        <nav
          ref={navRef}
          tabIndex={-1}
          onMouseEnter={() => navRef.current?.focus()}
          onWheel={(e) => {
            if (!navRef.current) return;
            e.stopPropagation();
            navRef.current.scrollTop += e.deltaY;
          }}
          className="flex-1 overflow-y-scroll overscroll-contain p-4 space-y-1.5 outline-none"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1"
                }`}
              >
                <item.icon size={20} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeNavIndicator" className="ml-auto" initial={false}>
                    <ChevronRight size={18} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
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
      <main className={`min-h-screen transition-all duration-300 ${isSidebarOpen?"lg:ml-72":"lg:ml-0"}`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={()=>setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                {isSidebarOpen ? <X size={24} className="text-gray-700"/> : <Menu size={24} className="text-gray-700"/>}
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CalendarDays size={20} className="text-indigo-600"/>Event Calendar</h2>
                <p className="text-gray-500 text-xs">Manage calendar events and blog links</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadEvents} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" title="Refresh">
                <RefreshCw size={18} className="text-gray-600"/>
              </button>
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/25 text-sm font-medium">
                <Plus size={18}/><span className="hidden sm:inline">Add Event</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search events..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 bg-white"/>
            </div>
            {/* Year */}
            <select value={selectedYear} onChange={e=>setSelectedYear(parseInt(e.target.value))} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 bg-white">
              {[2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            {/* Month filter */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={()=>setSelectedMonth("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedMonth==="All"?"bg-indigo-600 text-white shadow-sm":"bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"}`}>All</button>
              {MONTHS.map(m=>(
                <button key={m} onClick={()=>setSelectedMonth(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedMonth===m?"bg-indigo-600 text-white shadow-sm":"bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"}`}>{m.slice(0,3)}</button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{allEvents.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Events</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-green-600">{allEvents.filter(e=>e.isActive).length}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">{allEvents.filter(e=>e.blogSlug||e.linkedBlog).length}</p>
              <p className="text-xs text-gray-500 mt-1">Linked to Blog</p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-indigo-600"/>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays size={48} className="mx-auto mb-4 text-gray-300"/>
              <p className="text-gray-500 font-medium">No events found</p>
              <p className="text-gray-400 text-sm mt-1">Add your first event using the button above</p>
              <button onClick={openCreate} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                Add Event
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedMonths.map(month => (
                <motion.div key={month} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Month header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <CalendarDays size={16} className="text-indigo-600"/>
                      {month} {selectedYear}
                    </h3>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                      {grouped[month].length} event{grouped[month].length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Events table */}
                  <div className="divide-y divide-gray-50">
                    {grouped[month].map(evt => (
                      <div key={evt._id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${!evt.isActive?"opacity-50":""}`}>
                        {/* Status dot */}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${evt.isActive?"bg-green-500":"bg-gray-300"}`}/>

                        {/* Event info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800 truncate">{evt.name}</p>
                            {(evt.blogSlug || evt.linkedBlog) && (
                              <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                <Link2 size={11}/> Blog linked
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[evt.category]||CATEGORY_COLORS.General}`}>
                              {evt.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{evt.date}{evt.location ? ` • ${evt.location}` : ""}</p>
                          {evt.blogSlug && (
                            <p className="text-xs text-indigo-400 mt-0.5">/blog/{evt.blogSlug}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={()=>openEdit(evt)} className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group" title="Edit">
                            <Pencil size={15} className="text-gray-400 group-hover:text-indigo-600"/>
                          </button>
                          <button onClick={()=>setDeleteConfirm(evt)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Delete">
                            <Trash2 size={15} className="text-gray-400 group-hover:text-red-500"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Modal */}
      <AdminEventModal
        isOpen={isModalOpen}
        onClose={()=>{ setIsModalOpen(false); setEditingEvent(null); }}
        onSuccess={loadEvents}
        editingEvent={editingEvent}
      />

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setDeleteConfirm(null)} className="fixed inset-0 bg-black/60 z-50"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl"><AlertCircle size={22} className="text-red-500"/></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Delete Event</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-5">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
                <div className="flex gap-3">
                  <button onClick={()=>setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
                  <button onClick={()=>handleDelete(deleteConfirm._id)} disabled={isDeleting} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminEventCalendar;
