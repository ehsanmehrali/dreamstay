import React from "react";
import { FiMapPin } from "react-icons/fi";

export default function DestinationDropdown({
  open,
  loading,
  isTyping,
  standbyGroups,
  results,
  highlight,
  setHighlight,
  selectItem,
}) {
  if (!open) return null;

  return (
    <div
      role="listbox"
      id="dest-listbox"
      aria-expanded={open}
      className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-2 max-h-80 overflow-auto"
    >
      {loading && (
        <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>
      )}

      {/* No typing mode: history + trending */}
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
                  <span className="text-sm text-gray-900">{item.label}</span>
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

      {/* Type mode: Results */}
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
            No results for “{/* The actual text is created in the parent.*/}”
          </div>
        ))}
    </div>
  );
}
