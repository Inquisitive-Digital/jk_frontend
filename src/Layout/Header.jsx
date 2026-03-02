import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import JkLogo from "../assets/JkLogo.png"
import { serviceAPI, fleetAPI, eventAPI } from '../Utils/api';

// Static nav items (non-service items)
const STATIC_NAV_ITEMS = [
  {
    label: 'Our Fleet',
    href: '/fleet',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Mercedes E Class', href: '/fleet/mercedes-e-class-chauffeur-london' },
      { label: 'Mercedes S Class', href: '/fleet/mercedes-s-class-chauffeur-london' },
      { label: 'Mercedes V Class', href: '/fleet/mercedes-v-class-chauffeur-london' },
      { label: 'Mercedes Benz EQE', href: '/fleet/mercedes-benz-eqe-chauffeur-london' },
      { label: 'Rolls Royce', href: '/fleet/rolls-royce-chauffeur-london' },
      { label: 'Range Rover', href: '/fleet/range-rover-chauffeur-london' },
      { label: 'Mini Coach', href: '/fleet/mini-coach-hire-london' },
      { label: 'Coach Hire For Every Occasion', href: '/fleet/coach-hire-for-every-occasion' },
    ],
  },
  {
    label: 'Events',
    href: '/events/event-chauffeur-service',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Event Chauffeur Service', href: '/events/event-chauffeur-service' },
      { label: 'Chauffeur Service For Sports', href: '/events/chauffeur-service-for-sports' },
      { label: 'Event Calendar', href: '/events/event-calendar' }
    ],
  },
  { label: 'Blog', href: '/blog', hasDropdown: false },
  { label: 'About Us', href: '/about', hasDropdown: false },
  { label: 'Contact Us', href: '/contact', hasDropdown: false },
];

function Header({ isTransparent = false, theme = 'dark' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [serviceMenuItems, setServiceMenuItems] = useState([]);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  }, [location]);

  // Fetch nav menu from backend
  useEffect(() => {
    const buildNavItems = async () => {
      try {
        const [servicesData, fleetData, eventsData] = await Promise.all([
          serviceAPI.getNavMenu(),
          fleetAPI.getAll(1, 100), // Get all fleets
          eventAPI.getAll()        // Get all events
        ]);

        // 1. Services (Cascading)
        const serviceMenu = servicesData?.menu || [];
        setServiceMenuItems(serviceMenu);
        const servicesItem = {
          label: 'Our Services',
          href: '/services',
          hasDropdown: true,
          isCascading: true,
          dropdownItems: [],
        };

        // 2. Fleet (Dynamic)
        const fleetItems = (fleetData?.fleet || []).map(f => ({
          label: f.title,
          href: `/fleet/${f.slug}`
        }));
        const fleetNavItem = {
          label: 'Our Fleet',
          href: '/fleet',
          hasDropdown: true,
          dropdownItems: fleetItems.length > 0 ? fleetItems : STATIC_NAV_ITEMS[0].dropdownItems // Fallback
        };

        // 3. Events (Fixed 3 items as requested)
        const eventsNavItem = {
          label: 'Events',
          href: '/events/event-chauffeur-service-in-london',
          hasDropdown: true,
          dropdownItems: [
            { label: 'Event Chauffeur Service', href: '/events/event-chauffeur-service-in-london' },
            { label: 'Chauffeur Service For Sports', href: '/events/chauffeur-service-for-sports-event' },
            { label: 'Event Calendar', href: '/events/event-calendar' }
          ]
        };

        // 4. Combine
        setNavItems([
          servicesItem,
          fleetNavItem,
          eventsNavItem,
          { label: 'Blog', href: '/blog', hasDropdown: false },
          { label: 'About Us', href: '/about', hasDropdown: false },
          { label: 'Contact Us', href: '/contact', hasDropdown: false },
        ]);

      } catch (err) {
        console.error("Error building nav:", err);
        // Fallback to static if API fails
        const fallbackServicesItem = {
          label: 'Our Services',
          href: '/services',
          hasDropdown: false,
          dropdownItems: [],
        };
        setNavItems([fallbackServicesItem, ...STATIC_NAV_ITEMS]);
      }
    };

    buildNavItems();
  }, []);

  // Determine header style based on scroll and page
  const shouldBeTransparent = isTransparent && isHomePage && !isScrolled;
  const isLightTheme = theme === 'light';

  // Dynamic classes based on theme
  const headerBg = shouldBeTransparent
    ? 'bg-transparent'
    : isLightTheme
      ? 'bg-white shadow-md'
      : 'bg-gradient-to-r from-[#1a1a1a]/95 via-[#787777]/95 to-[#1a1a1a]/95 backdrop-blur-md shadow-lg';

  const textColor = shouldBeTransparent || !isLightTheme
    ? 'text-white/80 hover:text-white'
    : 'text-gray-700 hover:text-gray-900';

  const phoneIconBg = shouldBeTransparent || !isLightTheme
    ? 'bg-white/10 group-hover:bg-white/20'
    : 'bg-gray-100 group-hover:bg-gray-200';

  const logoTextColor = shouldBeTransparent || !isLightTheme
    ? 'text-white'
    : 'text-gray-900';

  const navTextColor = shouldBeTransparent || !isLightTheme
    ? 'text-white/80 hover:text-white'
    : 'text-gray-700 hover:text-gray-900';

  const borderColor = shouldBeTransparent || !isLightTheme
    ? 'via-white/20'
    : 'via-gray-200';

  // Dropdown styling
  const dropdownBg = isLightTheme
    ? 'bg-white border border-gray-200'
    : 'bg-[#1a1a1a] border border-white/10';

  const dropdownItemClass = isLightTheme
    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    : 'text-white/70 hover:text-white hover:bg-white/5';

  const dropdownItemActiveClass = isLightTheme
    ? 'text-gray-900 bg-gray-50'
    : 'text-white bg-white/5';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Phone Number - Left on desktop, hidden on mobile */}
            <a
              href="tel:+442012345678"
              className={`hidden md:flex items-center gap-2 transition-colors group ${textColor}`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${phoneIconBg}`}>
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium">
                +44 (0)20 1234 5678
              </span>
            </a>

            {/* Logo - Left on mobile, Center on desktop */}
            <Link to="/" className="flex items-center gap-3 group md:absolute md:left-1/2 md:-translate-x-1/2">
              <img
                src={JkLogo}
                alt="JK Executive Logo"
                className="w-24 h-18 md:w-28 md:h-20 object-contain flex-shrink-0"
              />
              <motion.div
                className="overflow-hidden"
                initial={{ width: 'auto', opacity: 1 }}
                animate={{
                  width: isScrolled ? 0 : 'auto',
                  opacity: isScrolled ? 0 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <span className={`text-2xl md:text-3xl font-light tracking-wider whitespace-nowrap block ${logoTextColor}`}>
                  <span className="font-semibold">JK</span> Executive
                </span>
              </motion.div>
            </Link>

            {/* Right side container */}
            <div className="flex items-center gap-3">
              {/* Mobile Book Now Button */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="md:hidden"
                  >
                    <Link
                      to="/booking"
                      className="px-4 py-2 text-black font-semibold text-xs uppercase tracking-wider rounded transition-all duration-300 whitespace-nowrap"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Book Now
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Book Now Button (Desktop only) */}
              <Link
                to="/booking"
                className="hidden md:block px-4 py-2.5 md:px-6 text-black font-semibold text-sm uppercase tracking-wider rounded transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--color-primary-rgb), 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Book Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 ${shouldBeTransparent || !isLightTheme ? 'text-white' : 'text-gray-900'}`}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Bar - Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1 pb-4">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.hasDropdown) setActiveDropdown(item.label);
                }}
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setActiveSubDropdown(null);
                }}
              >
                <Link
                  to={item.href}
                  className={`nav-link-underline flex items-center gap-1 px-4 py-2 text-sm transition-colors uppercase tracking-wider font-medium ${navTextColor}`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 mt-2 min-w-[240px] rounded-lg shadow-xl overflow-visible ${dropdownBg}`}
                    >
                      {/* If cascading (Our Services), render serviceMenuItems */}
                      {item.isCascading ? (
                        serviceMenuItems.map((menuItem) => (
                          <div
                            key={menuItem.label}
                            className="relative"
                            onMouseEnter={() => {
                              if (menuItem.children && menuItem.children.length > 0) {
                                setActiveSubDropdown(menuItem.label);
                              }
                            }}
                            onMouseLeave={() => setActiveSubDropdown(null)}
                          >
                            <Link
                              to={menuItem.href}
                              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${activeSubDropdown === menuItem.label ? dropdownItemActiveClass : dropdownItemClass
                                }`}
                            >
                              <span>{menuItem.label}</span>
                              {menuItem.children && menuItem.children.length > 0 && (
                                <ChevronRight className="w-3.5 h-3.5 ml-3 flex-shrink-0" />
                              )}
                            </Link>

                            {/* Sub-dropdown (slides right) */}
                            <AnimatePresence>
                              {menuItem.children && menuItem.children.length > 0 && activeSubDropdown === menuItem.label && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className={`absolute left-full top-0 ml-1 min-w-[240px] rounded-lg shadow-xl overflow-hidden ${dropdownBg}`}
                                >
                                  {menuItem.children.map((child) => (
                                    <Link
                                      key={child.label}
                                      to={child.href}
                                      className={`block px-4 py-3 text-sm transition-colors ${dropdownItemClass}`}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      ) : (
                        // Regular dropdown items (Our Fleet, Events)
                        item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            to={dropdownItem.href}
                            className={`block px-4 py-3 text-sm transition-colors ${dropdownItemClass}`}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Bottom Border */}
          <div className="flex justify-center">
            <div className={`w-[80%] h-px bg-gradient-to-r from-transparent to-transparent ${borderColor}`} />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#1a1a1a] z-50 lg:hidden flex flex-col"
          >
            {/* Close Button */}
            <div className="flex justify-end p-4 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  serviceMenuItems={item.isCascading ? serviceMenuItems : null}
                  location={location}
                />
              ))}

              {/* Mobile CTA */}
              <Link
                to="/booking"
                className="block mt-8 px-6 py-3 text-black font-semibold text-center uppercase tracking-wider rounded transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>

              {/* Mobile Phone */}
              <a
                href="tel:+442012345678"
                className="flex items-center justify-center gap-2 mt-6 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+44 (0)20 1234 5678</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile Navigation Item Component (supports cascading sub-menus)
function MobileNavItem({ item, serviceMenuItems, location }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  // Close accordion when route changes
  useEffect(() => {
    setIsOpen(false);
    setOpenSubMenu(null);
  }, [location]);

  if (!item.hasDropdown) {
    return (
      <Link
        to={item.href}
        className="block py-3 text-white/80 hover:text-white border-b border-white/10 uppercase tracking-wider text-sm font-medium"
      >
        {item.label}
      </Link>
    );
  }

  // Determine items to render
  const isCascading = item.isCascading && serviceMenuItems;
  const items = isCascading ? serviceMenuItems : item.dropdownItems;

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-white/80 hover:text-white uppercase tracking-wider text-sm font-medium"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4">
              {isCascading ? (
                // Cascading: render categories with optional sub-accordion
                items.map((menuItem) => (
                  <div key={menuItem.label}>
                    {menuItem.children && menuItem.children.length > 0 ? (
                      // Category with sub-items — accordion
                      <>
                        <button
                          onClick={() => setOpenSubMenu(openSubMenu === menuItem.label ? null : menuItem.label)}
                          className="flex items-center justify-between w-full py-2 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          <span>{menuItem.label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${openSubMenu === menuItem.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubMenu === menuItem.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-2">
                                {menuItem.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    to={child.href}
                                    className="block py-1.5 text-xs text-white/50 hover:text-white transition-colors"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      // Category with no sub-items — direct link
                      <Link
                        to={menuItem.href}
                        className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {menuItem.label}
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                // Regular dropdown items
                items.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.label}
                    to={dropdownItem.href}
                    className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {dropdownItem.label}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;