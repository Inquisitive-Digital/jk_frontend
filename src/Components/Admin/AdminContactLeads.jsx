import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Mail,
    Phone,
    User,
    Calendar,
    MessageSquare,
    Search,
    Trash2,
    X,
    Loader2,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Info
} from "lucide-react";
import { contactAPI } from "../../Utils/api";

const LeadCard = ({ lead, onDelete }) => {
    const formatDate = (date) => {
        if (!date) return "—";
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col"
        >
            {/* Header */}
            <div className={`px-5 py-4 border-b ${lead.type === 'bulk_quote' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${lead.type === 'bulk_quote' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20' : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20'}`}>
                            {lead.type === 'bulk_quote' ? <Info size={18} className="text-white" /> : <MessageCircle size={18} className="text-white" />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 capitalize">
                                {lead.type === 'bulk_quote' ? "Quote Request" : "Contact Inquiry"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> {formatDate(lead.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => onDelete(lead)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lead"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-800 truncate">{lead.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline truncate">{lead.email}</a>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {lead.phone && (
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-400" />
                                <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:underline">{lead.phone}</a>
                            </div>
                        )}
                        {lead.subject && (
                            <div className="flex items-start gap-3">
                                <MessageSquare size={16} className="text-gray-400 mt-1" />
                                <span className="text-sm font-medium text-gray-800 line-clamp-2">{lead.subject}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-2 bg-gray-50 rounded-xl p-4 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-semibold">Message</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ lead, isOpen, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(lead._id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !lead) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Inquiry?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete the inquiry from{" "}
                            <span className="font-semibold text-gray-700">
                                {lead.name}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" ? onPageChange(page) : null}
                    disabled={page === "..."}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors flex items-center justify-center
                        ${page === currentPage
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : page === "..."
                                ? "text-gray-400 cursor-default"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default function AdminContactLeads() {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);
    const limit = 12; // Leads per page

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    useEffect(() => {
        const adminData = localStorage.getItem("adminInfo");
        if (!adminData) {
            navigate("/login-admin");
        }
    }, [navigate]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch leads
    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await contactAPI.getAllAdmin(currentPage, limit, debouncedSearch);
            
            if (response.success) {
                setLeads(response.data);
                setTotalPages(response.pagination.pages);
                setTotalLeads(response.pagination.total);
            }
        } catch (err) {
            console.error("Error fetching contact leads:", err);
            setError("Failed to load contact leads. Please try again.");
            if (err.response?.status === 401) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminInfo");
                navigate("/login-admin");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [currentPage, debouncedSearch]);

    // Delete handlers
    const openDeleteModal = (lead) => {
        setLeadToDelete(lead);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async (id) => {
        try {
            const res = await contactAPI.deleteLead(id);
            if (res.success) {
                // If last item on page and not first page, go to previous page
                if (leads.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchLeads(); // Refresh current page
                }
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
            throw error;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Contact Leads
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage contact form and quote inquiries
                    </p>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                
                <div className="text-sm font-medium text-gray-600 bg-amber-50 px-4 py-2 rounded-xl text-amber-700">
                    Total Leads: {totalLeads}
                </div>
            </div>

            {/* Content Area */}
            {isLoading && leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-amber-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading leads...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchLeads}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : leads.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No leads found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {debouncedSearch 
                            ? `No inquiries match your search for "${debouncedSearch}".`
                            : "You haven't received any contact inquiries yet."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {leads.map((lead) => (
                            <LeadCard
                                key={lead._id}
                                lead={lead}
                                onDelete={openDeleteModal}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Modals */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                lead={leadToDelete}
            />
        </div>
    );
}
