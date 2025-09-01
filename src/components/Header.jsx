import React, { useEffect, useRef, useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FiMenu,
  FiX,
  FiUserPlus,
  FiInfo,
  FiMail,
  FiLogIn,
} from "react-icons/fi";

/**
 * Responsive Navbar (RTL-friendly)
 * - Burger menu on the right, Login button to its left
 * - Always hamburger (mobile + desktop)
 * - Mobile menu: full-screen overlay
 * - Desktop menu: centered modal
 * - Close menu with: Escape, top-left X, bottom Close button, or after selecting an item
 * - Tailwind-only styling
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const firstActionRef = useRef(null);

  // Menu items (divider is represented by type: 'divider')
  const items = [
    {
      label: "Login as a guest",
      to: "/login/guest",
      icon: <FiUserPlus className="text-[18px] md:text-[20px]" />,
    },
    {
      label: "About us",
      to: "/about",
      icon: <FiInfo className="text-[18px] md:text-[20px]" />,
    },
    {
      label: "Contact us",
      to: "/contact",
      icon: <FiMail className="text-[18px] md:text-[20px]" />,
    },
    { type: "divider" },
    {
      label: "Login as host",
      to: "/login/host",
      icon: <FiLogIn className="text-[18px] md:text-[20px]" />,
    },
  ];

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Body scroll lock + focus management when menu opens
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      // Focus the first actionable element
      setTimeout(() => firstActionRef.current?.focus(), 0);
    } else {
      document.documentElement.style.overflow = originalOverflow || "";
    }
    return () => {
      document.documentElement.style.overflow = originalOverflow || "";
    };
  }, [open]);

  // Keyboard: Escape to close
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center">
        {/* Brand / Logo as a Link on the left */}
        <Link
          to="/"
          aria-label="Home"
          className="mr-auto flex items-center gap-2 group"
        >
          <img
            src={logo}
            alt="App logo"
            className="h-7 w-auto md:h-8 select-none"
          />
          <span className="sr-only">Home</span>
        </Link>

        {/* Right-side controls: Login button (left of burger), then burger on the far right */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            to="/login"
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-300 hover:border-gray-400 active:scale-[0.98] transition text-sm md:text-base"
          >
            Login
          </Link>

          <button
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen(true)}
            className="p-2 md:p-3 rounded-xl border border-gray-300 hover:border-gray-400 active:scale-[0.98] transition"
          >
            {/* Burger icon (react-icons) */}
            <FiMenu aria-hidden="true" className="text-[20px] md:text-[24px]" />
          </button>
        </div>
      </nav>

      {/* Overlay & Menu */}
      {open && (
        <>
          {/* Mobile (<= md): full-screen overlay */}
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            id="nav-menu"
          >
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div
              className="absolute inset-0 bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="absolute left-3 top-3 p-2 rounded-lg border border-gray-300 hover:border-gray-400 active:scale-95"
                  ref={firstActionRef}
                >
                  <FiX aria-hidden="true" className="text-[20px]" />
                </button>
                <div className="px-10 py-5 text-center">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a destination
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <ul className="space-y-2">
                  {items.map((item, idx) => {
                    if (item.type === "divider") {
                      return (
                        <li key={`m-divider-${idx}`} className="py-2">
                          <hr className="border-gray-200" />
                        </li>
                      );
                    }
                    return (
                      <li key={`m-${item.to}`}>
                        <NavLink
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            [
                              "w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border",
                              "border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] transition",
                              isActive ? "bg-gray-50 border-gray-300" : "",
                            ].join(" ")
                          }
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-auto p-5 border-t border-gray-200">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white hover:opacity-90 active:scale-[0.99] text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Desktop (md+): anchored dropdown near burger (no dark backdrop) */}
          {/* Transparent click-catcher to close when clicking outside */}
          <div
            className="hidden md:block fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div
            className="hidden md:block fixed top-16 right-6 z-50"
            role="dialog"
            aria-modal="true"
            id="nav-menu-desktop"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-[380px] max-w-[90vw] border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="absolute left-3 top-3 p-2 rounded-lg border border-gray-300 hover:border-gray-400 active:scale-95"
                  ref={firstActionRef}
                >
                  <FiX aria-hidden="true" className="text-[20px]" />
                </button>
                <div className="px-6 pt-5 pb-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                </div>
              </div>

              <div className="px-4 pb-4">
                <ul className="space-y-1.5">
                  {items.map((item, idx) => {
                    if (item.type === "divider") {
                      return (
                        <li key={`d-divider-${idx}`} className="py-1">
                          <hr className="border-gray-200" />
                        </li>
                      );
                    }
                    return (
                      <li key={`d-${item.to}`}>
                        <NavLink
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            [
                              "w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border",
                              "border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] transition",
                              isActive ? "bg-gray-50 border-gray-300" : "",
                            ].join(" ")
                          }
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
