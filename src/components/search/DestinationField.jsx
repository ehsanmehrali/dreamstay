import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiMapPin, FiClock, FiTrendingUp, FiX } from "react-icons/fi";

// Hook: debounces the input value for search.
function useDebouncedValue(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Hook: Body scroll locking and mobile/desktop detection
function useLockBodyScroll(locked) {
  React.useEffect(() => {
    const root = document.documentElement; // <html> element
    const hadOverflowHidden = root.classList.contains("overflow-hidden");
    if (locked) root.classList.add("overflow-hidden"); // Lock scroll
    return () => {
      if (!hadOverflowHidden) root.classList.remove("overflow-hidden"); // Cleanup
    };
  }, [locked]);
}

export default function DestinationField({
  value, // Current input value
  onChange, // Called on input change
  onComplete, // Called when user presses Enter or selects a suggestion
  fetchSuggest, // Called when user selects a suggestion  => Promise<SuggestItem[]>
  fetchTrending, // Function to fetch trending destinations => Promise<SuggestItem[]>
  className = "", // Additional classes for the container
}) {
  const [open, setOpen] = React.useState(false); // Is the suggestion dropdown open?
  const [q, setQ] = React.useState(value?.label || ""); // Live input text
  const debouncedQ = useDebouncedValue(q, 250); // Stable version for Fetch
  const [loading, setLoading] = React.useState(false); // Is it loading suggestions?
  const [history, setHistory] = React.useState([]); // History of previous searches in local storage
  const [trending, setTrending] = React.useState([]); // Trending destinations
  const [results, setResults] = React.useState([]); // Current fetched suggestions based on input
  const [highlight, setHighlight] = React.useState(-1); // Highlighted suggestion (keyboard)
  const [focused, setFocused] = React.useState(false); // Is the input focused?
  const rootRef = React.useRef(null); // Reference for click-outside (desktop)
  const inputRef = React.useRef(null); // Autofocus when we open

  const isTyping = debouncedQ.trim().length > 0;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const portalTarget = typeof document !== "undefined" ? document.body : null; // For mobile sheet (stacking context )

  // Local storage history management
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ds_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  function saveToHistory(item) {
    try {
      const trimedList = [
        item,
        ...history.filter((i) => i.label !== item.label),
      ].slice(0, 8); // Keep unique, max 8 items
      localStorage.setItem("ds_history", JSON.stringify(trimedList));
    } catch (e) {
      // Optionally log the error or ignore
      console.error("Failed to save history", e);
    }
  }

  // When field is opened and q was empty → get trending destinations
  useEffect(() => {
    let alive = true;
    if (open && !isTyping) {
      // IIFE
      (async () => {
        setLoading(true);
        try {
          const t = await fetchTrending();
          if (alive) setTrending(t || []);
        } finally {
          if (alive) setLoading(false);
        }
      })();
    }
    return () => (alive = false);
  }, [open, isTyping, fetchTrending]);

  // Search suggestions as we type
  useEffect(() => {
    let alive = true;
    if (!open) return; // Not open → do nothing{
    if (!isTyping) {
      setResults([]);
      return;
    } // No typing → no suggestions
    // IIFE
    (async () => {
      setLoading(true);
      try {
        const r = await fetchSuggest(debouncedQ.trim());
        if (alive) {
          setResults(Array.isArray(r) ? r : []);
          setHighlight(r && r.length ? 0 : -1); // Highlight first item if any
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [debouncedQ, isTyping, open, fetchSuggest]);

  // Close on click outside of dropdown (desktop only)
  useEffect(() => {
    if (!open || isMobile) return; // Not open or mobile → do nothing
    const onDoc = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open, isMobile]);

  // Body scroll lock on mobile when open
  useLockBodyScroll(open && isMobile);

  // Focus the input when we open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Select item (click/enter) => cleanup, Focus shift
  function selectItem(item) {
    onChange?.(item);
    saveToHistory(item);
    setQ(item.label);
    setOpen(false);
    setResults([]);
    setHighlight(-1);
    setFocused(false);
    onComplete?.();
  }

  // Keyboard navigation
  function onKeyDown(e) {
    if (!open) return;
    const list = isTyping ? results : [...(history || []), ...(trending || [])];

    if (e.key === "Tab") {
      setOpen(false);
      setHighlight(-1);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!list.length) return;
      setHighlight((h) => (h + 1) % list.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!list.length) return;
      setHighlight((h) => (h - 1 + list.length) % list.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0 && list[highlight]) {
        e.preventDefault();
        selectItem(list[highlight]);
      } else if (q.trim()) {
        // Free text entry
        selectItem({ id: `free:${q.trim()}`, label: q.trim(), type: "free" });
      }
    }
  }

  // Group suggestions for display
  const standbyGroups = useMemo(() => {
    if (isTyping) return null;
    return [
      history?.length
        ? { title: "Search History", icon: <FiClock />, items: history }
        : null,
      trending?.length
        ? {
            title: "Trending Destinations",
            icon: <FiTrendingUp />,
            items: trending,
          }
        : null,
    ].filter(Boolean);
  }, [isTyping, history, trending]);

  const inputCore = (
    <>
      <FiMapPin className="text-gray-500 text-base md:text-lg" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setHighlight(-1);
        }}
        onFocus={() => {
          setOpen(true);
          setFocused(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full min-w-0 bg-transparent outline-none text-gray-900 pr-9 text-sm md:text-base lg:text-lg xl:text-xl placeholder-gray-500 placeholder:text-sm md:placeholder:text-base lg:placeholder:text-lg xl:placeholder:text-xl"
        placeholder="Destination?"
      />
    </>
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* Trigger / Field */}
      <label
        className={[
          "relative",
          "col-span-2 md:col-span-3 flex items-center gap-3 lg:gap-4 xl:gap-5",
          "rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2",
          "md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md",
          "hover:bg-gray-50 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-gray-200",
        ].join(" ")}
        onClick={() => setOpen(true)}
      >
        {inputCore}

        {/* Input field inner close(clear) button */}
        {
          <button
            type="button"
            aria-label="Clear"
            onMouseDown={(e) => e.preventDefault()} // Prevent blurring
            onClick={() => {
              setQ("");
              setResults([]);
              setHighlight(-1);
              inputRef.current?.focus();
            }}
            tabIndex={-1} // Exclude from tab order
            aria-hidden="true" // Hide from screen readers
            className={[
              "absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2",
              "p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              "transition-opacity",
              focused && q ? "opacity-100" : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <FiX className="text-[14px] md:text-[16px]" />
          </button>
        }
      </label>

      {/* Desktop Dropdown */}
      {!isMobile && open && (
        <div
          role="listbox"
          id="dest-listbox"
          aria-expanded={open}
          className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-2 max-h-80 overflow-auto"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>
          )}

          {!isTyping &&
            standbyGroups?.map((g, gi) => (
              <div key={`grp-${gi}`} className="py-1">
                <div className="px-3 py-1.5 text-xs uppercase tracking-wide text-gray-500 flex items-center gap-2">
                  <span className="inline-flex">{g.icon}</span>
                  <span>{g.title}</span>
                </div>
                {g.items.map((item, idx) => {
                  const hi =
                    idx + (gi === 0 ? 0 : standbyGroups[0]?.items?.length || 0);
                  const active = highlight === hi;
                  return (
                    <div
                      key={`${g.title}-${item.id ?? item.label}-${idx}`}
                      role="option"
                      aria-selected={active}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectItem(item)}
                      className={[
                        "px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2",
                        active ? "bg-gray-100" : "hover:bg-gray-50",
                      ].join(" ")}
                      onMouseEnter={() => setHighlight(hi)}
                    >
                      <FiMapPin className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {item.label}
                      </span>
                      {item.count != null && (
                        <span className="ml-auto text-xs text-gray-500">
                          {item.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

          {isTyping &&
            !loading &&
            (results.length ? (
              results.map((item, idx) => (
                <div
                  key={`r-${item.id ?? item.label}-${idx}`}
                  role="option"
                  aria-selected={highlight === idx}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectItem(item)}
                  className={[
                    "px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2",
                    highlight === idx ? "bg-gray-100" : "hover:bg-gray-50",
                  ].join(" ")}
                  onMouseEnter={() => setHighlight(idx)}
                >
                  <FiMapPin className="text-gray-400" />
                  <span className="text-sm text-gray-900">{item.label}</span>
                  {item.count != null && (
                    <span className="ml-auto text-xs text-gray-500">
                      {item.count}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results for “{debouncedQ}”
              </div>
            ))}
        </div>
      )}

      {/* Mobile Sheet */}
      {isMobile && open && portalTarget
        ? createPortal(
            <div
              className="fixed inset-0 z-50 md:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <div
                className="absolute inset-0 bg-white flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 pt-5 border-b border-gray-200">
                  {/* Close button*/}
                  <button
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 active:scale-95"
                  >
                    <FiX className="text-[18px]" />
                  </button>
                  {/* Menu title */}
                  <h2 className="mt-3 text-[15px] font-semibold text-gray-900">
                    Destination
                  </h2>
                  <div className="mt-3">
                    {/* Input with floating label */}
                    <div className="relative">
                      {/* Left side icon */}
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                      {/* Input itself as a peer */}
                      <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => {
                          setQ(e.target.value);
                          setHighlight(-1);
                        }}
                        onBlur={() => setFocused(false)}
                        onKeyDown={onKeyDown}
                        className="peer w-full rounded-xl border border-gray-300 bg-white shadow-sm pl-10 pr-10 py-3 outline-none transition-all duration-200 focus:border-[#D9E05E] focus:ring-2 focus:ring-[#D9E05E] placeholder-transparent"
                        placeholder=" " /* A single space, for placeholder-shown mode */
                      />

                      {/* ّFloating label*/}
                      <label
                        className="pointer-events-none absolute left-10 bg-white px-1 rounded text-gray-500 transition-all duration-200 ease-out 
                        /* Initial state (like a placeholder in the middle of the input) */ 
                        top-1/2 -translate-y-1/2 text-base 
                        /* When it has focus or value: snap to the top edge of the border*/ 
                        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-gray-700
                        peer-[&:not(:placeholder-shown)]:top-0 
                        peer-[&:not(:placeholder-shown)]:-translate-y-1/2 
                        peer-[&:not(:placeholder-shown)]:text-xs
                        peer-[&:not(:placeholder-shown)]:text-gray-700"
                      >
                        Where to?
                      </label>
                      {
                        <button
                          type="button"
                          aria-label="Clear"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQ("");
                            setResults([]);
                            setHighlight(-1);
                            inputRef.current?.focus();
                          }}
                          tabIndex={-1} // Exclude from tab order
                          aria-hidden="true" // Hide from screen readers
                          className={[
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                            "transition-opacity",
                            focused && q
                              ? "opacity-100"
                              : "opacity-0 pointer-events-none",
                          ].join(" ")}
                        >
                          <FiX className="text-[16px]" />
                        </button>
                      }
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  {loading && (
                    <div className="px-1 py-2 text-sm text-gray-500">
                      Loading…
                    </div>
                  )}

                  {!isTyping &&
                    standbyGroups?.map((g, gi) => (
                      <div key={`mgrp-${gi}`} className="mb-4">
                        <div className="px-1 py-2 text-xs uppercase tracking-wide text-gray-500 flex items-center gap-2">
                          <span className="inline-flex">{g.icon}</span>
                          <span>{g.title}</span>
                        </div>
                        <div className="space-y-1">
                          {g.items.map((item, idx) => (
                            <button
                              key={`mi-${g.title}-${
                                item.id ?? item.label
                              }-${idx}`}
                              onClick={() => selectItem(item)}
                              className="w-full text-left px-3 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-[0.99] flex items-center gap-2"
                            >
                              <FiMapPin className="text-gray-400" />
                              <span className="text-gray-900">
                                {item.label}
                              </span>
                              {item.count != null && (
                                <span className="ml-auto text-xs text-gray-500">
                                  {item.count}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                  {isTyping &&
                    !loading &&
                    (results.length ? (
                      <div className="space-y-1">
                        {results.map((item, idx) => (
                          <button
                            key={`mr-${item.id ?? item.label}-${idx}`}
                            onClick={() => selectItem(item)}
                            className="w-full text-left px-3 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-[0.99] flex items-center gap-2"
                          >
                            <FiMapPin className="text-gray-400" />
                            <span className="text-gray-900">{item.label}</span>
                            {item.count != null && (
                              <span className="ml-auto text-xs text-gray-500">
                                {item.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-1 py-2 text-sm text-gray-500">
                        No results for “{debouncedQ}”
                      </div>
                    ))}
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </div>
  );
}

/** media-query simple without library*/
function useMediaQuery(query) {
  const [match, setMatch] = React.useState(
    () => window.matchMedia?.(query).matches ?? false
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatch(m.matches);
    m.addEventListener?.("change", onChange);
    onChange();
    return () => m.removeEventListener?.("change", onChange);
  }, [query]);
  return match;
}
