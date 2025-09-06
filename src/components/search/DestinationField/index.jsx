import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiMapPin, FiClock, FiTrendingUp, FiX } from "react-icons/fi";
import DestinationDropdown from "./DestinationDropdown";
import MobileSheet from "./MobileSheet";

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

  // Group suggestions for display (no typing mode  → history + trending)
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
      {/* Trigger / Field (Desktop view) */}
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

        {/* Clear button */}
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
          tabIndex={-1}
          aria-hidden="true"
          className={[
            "absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2",
            "p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            "transition-opacity",
            focused && q ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <FiX className="text-[14px] md:text-[16px]" />
        </button>
      </label>

      {/* Dropdown desktop*/}
      {!isMobile && open && (
        <DestinationDropdown
          open={open}
          loading={loading}
          isTyping={isTyping}
          standbyGroups={standbyGroups}
          results={results}
          highlight={highlight}
          setHighlight={setHighlight}
          selectItem={selectItem}
        />
      )}

      {/* Mobile sheet*/}
      {isMobile && open && portalTarget
        ? createPortal(
            <MobileSheet
              open={open}
              onClose={() => setOpen(false)}
              q={q}
              setQ={(val) => {
                setQ(val);
                setHighlight(-1);
              }}
              inputRef={inputRef}
              onKeyDown={onKeyDown}
              loading={loading}
              isTyping={isTyping}
              standbyGroups={standbyGroups}
              results={results}
              selectItem={selectItem}
              focused={focused}
              setFocused={setFocused}
            />,
            portalTarget
          )
        : null}
    </div>
  );
}
