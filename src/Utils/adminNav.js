import {
  LayoutDashboard,
  Target,
  Calendar,
  List,
  Plus,
  DollarSign,
  MapPin,
  MapPinPlus,
  Briefcase,
  PenSquare,
  BookOpen,
  CalendarDays,
} from "lucide-react";

export const NAV_ITEMS = [
  // ===== OVERVIEW =====
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin-dashboard",
  },
  {
    id: "leads",
    icon: Target,
    label: "All Leads",
    path: "/admin/leads",
  },
  {
    id: "bookings",
    icon: Calendar,
    label: "All Bookings",
    path: "/admin/bookings",
  },

  // ===== VEHICLES =====
  {
    id: "vehicles",
    icon: List,
    label: "All Cars",
    path: "/admin/vehicles",
  },
  {
    id: "add-car",
    icon: Plus,
    label: "Add Car",
    path: "/admin/add-car",
  },

  // ===== STANDARD PRICING (Per Vehicle) =====
  {
    id: "pricing",
    icon: DollarSign,
    label: "Set Pricing",
    path: "/admin/pricing",
  },
  {
    id: "all-pricing",
    icon: List,
    label: "See All Pricing",
    path: "/admin/all-pricing",
  },

  // ===== SPECIAL LOCATIONS (Airports, Stadiums, etc.) =====
  {
    id: "all-locations",
    icon: MapPin,
    label: "All Locations",
    path: "/admin/locations",
  },
  {
    id: "add-location",
    icon: MapPinPlus,
    label: "Add Location",
    path: "/admin/add-location",
  },

  // ===== SERVICES =====
  {
    id: "all-services",
    icon: Briefcase,
    label: "All Services",
    path: "/admin/services",
  },
  {
    id: "add-service",
    icon: PenSquare,
    label: "Add Service",
    path: "/admin/add-service",
  },

  // ===== BLOGS =====
  {
    id: "all-blogs",
    icon: BookOpen,
    label: "All Blogs",
    path: "/admin/blogs",
  },
  {
    id: "add-blog",
    icon: PenSquare,
    label: "Add Blog",
    path: "/admin/add-blog",
  },
  {
    id: "event-calendar",
    icon: CalendarDays,
    label: "Event Calendar",
    path: "/admin/event-calendar",
  },
];
