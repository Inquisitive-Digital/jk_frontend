import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Link2, Search, Loader2, Save, MapPin, Tag, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { calendarEventAPI, blogAPI } from "../../Utils/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CATEGORIES = ["Sports","Corporate","Entertainment","Exhibition","Cultural","General"];
const emptyForm = { name:"", date:"", month:"", year:2026, description:"", location:"", category:"General", blogSlug:"", linkedBlog:"", isActive:true, priority:0 };

function AdminEventModal({ isOpen, onClose, onSuccess, editingEvent = null }) {
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [blogSearch, setBlogSearch] = useState("");
  const [blogResults, setBlogResults] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDrop, setShowDrop] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (!isOpen) return;
    blogAPI.getAll(1, 200).then(r => setAllBlogs(r.blogs || [])).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editingEvent) {
      setForm({ name:editingEvent.name||"", date:editingEvent.date||"", month:editingEvent.month||"", year:editingEvent.year||2026, description:editingEvent.description||"", location:editingEvent.location||"", category:editingEvent.category||"General", blogSlug:editingEvent.blogSlug||"", linkedBlog:editingEvent.linkedBlog?._id||editingEvent.linkedBlog||"", isActive:editingEvent.isActive!==undefined?editingEvent.isActive:true, priority:editingEvent.priority||0 });
      if (editingEvent.linkedBlog?.title) setSelectedBlog(editingEvent.linkedBlog);
    } else if (isOpen) {
      setForm(emptyForm); setSelectedBlog(null); setBlogSearch(""); setBlogResults([]); setErrors({});
    }
  }, [isOpen, editingEvent]);

  useEffect(() => {
    if (!blogSearch.trim()) { setBlogResults([]); setShowDrop(false); return; }
    const q = blogSearch.toLowerCase();
    const res = allBlogs.filter(b => b.title?.toLowerCase().includes(q) || b.slug?.toLowerCase().includes(q)).slice(0,8);
    setBlogResults(res); setShowDrop(res.length > 0);
  }, [blogSearch, allBlogs]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type==="checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]:"" }));
  };

  const selectBlog = (blog) => {
    setSelectedBlog(blog);
    setForm(p => ({ ...p, linkedBlog:blog._id, blogSlug:blog.slug }));
    setBlogSearch(""); setShowDrop(false);
  };

  const clearBlog = () => { setSelectedBlog(null); setForm(p=>({...p,linkedBlog:"",blogSlug:""})); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Event name is required";
    if (!form.date.trim()) errs.date = "Display date is required";
    if (!form.month) errs.month = "Month is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const payload = { ...form, year:parseInt(form.year), priority:parseInt(form.priority)||0, linkedBlog:form.linkedBlog||null, blogSlug:form.blogSlug||null };
      if (isEditing) { await calendarEventAPI.update(editingEvent._id, payload); toast.success("Event updated!", {position:"top-center",autoClose:3000}); }
      else { await calendarEventAPI.create(payload); toast.success("Event created!", {position:"top-center",autoClose:3000}); }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {position:"top-center",autoClose:4000});
    } finally { setIsLoading(false); }
  };

  const inp = (f) => `w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none transition-all bg-white ${errors[f]?"border-red-300 focus:border-red-500":"border-gray-200 focus:border-indigo-500 hover:border-gray-300"}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} transition={{type:"spring",damping:25,stiffness:300}} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl"><CalendarDays size={20} className="text-white"/></div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{isEditing?"Edit Calendar Event":"Add Calendar Event"}</h2>
                      <p className="text-indigo-100 text-xs">{isEditing?"Update event details and blog link":"Add a new event to the calendar"}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X size={20} className="text-white"/></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Name <span className="text-red-500">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. London Marathon" className={inp("name")}/>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Display Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Date <span className="text-red-500">*</span></label>
                    <input name="date" value={form.date} onChange={handleChange} placeholder="e.g. 26th April 2026" className={inp("date")}/>
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    <p className="text-gray-400 text-xs mt-1">Shown exactly as typed on the calendar card</p>
                  </div>

                  {/* Month + Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Month <span className="text-red-500">*</span></label>
                      <select name="month" value={form.month} onChange={handleChange} className={inp("month")}>
                        <option value="">Select Month</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year <span className="text-red-500">*</span></label>
                      <input type="number" name="year" value={form.year} onChange={handleChange} min="2024" max="2030" className={inp("year")}/>
                    </div>
                  </div>

                  {/* Location + Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><MapPin size={13}/> Location</label>
                      <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Wembley Stadium" className={inp("location")}/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><Tag size={13}/> Category</label>
                      <select name="category" value={form.category} onChange={handleChange} className={inp("category")}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><FileText size={13}/> Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief description (optional)" className={inp("description")+" resize-none"}/>
                  </div>

                  {/* Blog Link */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Link2 size={14} className="text-indigo-600"/> Link to Blog Post
                    </label>
                    {selectedBlog ? (
                      <div className="flex items-center gap-3 bg-white border border-indigo-200 rounded-xl px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{selectedBlog.title}</p>
                          <p className="text-xs text-indigo-600">/blog/{selectedBlog.slug}</p>
                        </div>
                        <button type="button" onClick={clearBlog} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"><X size={15}/></button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative">
                          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input type="text" value={blogSearch} onChange={e=>setBlogSearch(e.target.value)} placeholder="Search blog by title or slug..." className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 focus:border-indigo-400 rounded-xl text-sm outline-none bg-white"/>
                        </div>
                        <AnimatePresence>
                          {showDrop && blogResults.length > 0 && (
                            <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-44 overflow-y-auto">
                              {blogResults.map(blog => (
                                <button key={blog._id} type="button" onClick={()=>selectBlog(blog)} className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b border-gray-50 last:border-0 transition-colors">
                                  <p className="text-sm font-medium text-gray-800 truncate">{blog.title}</p>
                                  <p className="text-xs text-gray-400">/blog/{blog.slug}</p>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <p className="text-gray-400 text-xs mt-2">Or enter blog slug directly:</p>
                        <input name="blogSlug" value={form.blogSlug} onChange={handleChange} placeholder="e.g. london-marathon-chauffeur-2026" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 bg-white"/>
                      </div>
                    )}
                  </div>

                  {/* Priority + Status */}
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                      <input type="number" name="priority" value={form.priority} onChange={handleChange} min="0" max="100" className={inp("priority")}/>
                    </div>
                    <label className="flex items-center gap-2 mt-5 cursor-pointer">
                      <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-indigo-600"/>
                      <span className="text-sm font-medium text-gray-700">Active (visible on calendar)</span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 text-sm">
                      {isLoading ? <><Loader2 size={16} className="animate-spin"/><span>Saving...</span></> : <><Save size={16}/><span>{isEditing?"Update Event":"Create Event"}</span></>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AdminEventModal;
