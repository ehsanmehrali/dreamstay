import React from "react";
import { FiMapPin, FiX } from "react-icons/fi";

export default function MobileSheet({
  open,
  onClose,
  q,
  setQ,
  inputRef,
  onKeyDown,
  loading,
  isTyping,
  standbyGroups,
  results,
  selectItem,
  focused,
  setFocused,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="absolute inset-0 bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pt-5 border-b border-gray-200">
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 active:scale-95"
          >
            <FiX className="text-[18px]" />
          </button>

          {/* Title */}
          <h2 className="mt-3 text-[15px] font-semibold text-gray-900">
            Destination
          </h2>

          {/* Input */}
          <div className="mt-3">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused?.(true)}
                onBlur={() => setFocused?.(false)}
                onKeyDown={onKeyDown}
                className="peer w-full rounded-xl border border-gray-300 bg-white shadow-sm pl-10 pr-10 py-3 outline-none transition-all duration-200 focus:border-[#D9E05E] focus:ring-2 focus:ring-[#D9E05E] placeholder-transparent"
                placeholder=" "
              />
              <label
                className="pointer-events-none absolute left-10 bg-white px-1 rounded text-gray-500 transition-all duration-200 ease-out 
                top-1/2 -translate-y-1/2 text-base 
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-gray-700
                peer-[&:not(:placeholder-shown)]:top-0 
                peer-[&:not(:placeholder-shown)]:-translate-y-1/2 
                peer-[&:not(:placeholder-shown)]:text-xs
                peer-[&:not(:placeholder-shown)]:text-gray-700"
              >
                Where to?
              </label>

              <button
                type="button"
                aria-label="Clear"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                tabIndex={-1}
                aria-hidden="true"
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
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading && (
            <div className="px-1 py-2 text-sm text-gray-500">Loading…</div>
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
                      key={`mi-${g.title}-${item.id ?? item.label}-${idx}`}
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
              <div className="px-1 py-2 text-sm text-gray-500">No results</div>
            ))}
        </div>
      </div>
    </div>
  );
}
