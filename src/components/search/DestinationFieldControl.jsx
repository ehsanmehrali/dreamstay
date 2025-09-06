import React from "react";
import DestinationField from "./DestinationField";
import { useSearchForm } from "./SearchFormContext";

export default function DestinationFieldControl({ className, onComplete }) {
  const { state, dispatch } = useSearchForm();

  // سرویس‌های mock شما
  async function fetchTrending() {
    return [
      { id: "loc:Tehran", label: "Tehran", count: 12 },
      { id: "loc:Berlin", label: "Berlin", count: 7 },
      { id: "loc:Hamburg", label: "Hamburg", count: 5 },
    ];
  }

  async function fetchSuggest(q) {
    const src = [
      "Tehran",
      "Berlin",
      "Hamburg",
      "Munich",
      "Cologne",
      "Kish Island",
      "Shiraz",
    ];
    return src
      .filter((x) => x.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 8)
      .map((label, i) => ({ id: `mock:${label}:${i}`, label }));
  }

  return (
    <DestinationField
      className={className}
      value={state.destination}
      onChange={(v) => dispatch({ type: "setDestination", payload: v })}
      onComplete={onComplete}
      fetchSuggest={fetchSuggest}
      fetchTrending={fetchTrending}
    />
  );
}
