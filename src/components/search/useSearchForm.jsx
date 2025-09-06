import React from "react";
import { SearchFormContext } from "./SearchFormContext.jsx";

export function useSearchForm() {
  const ctx = React.useContext(SearchFormContext);
  if (!ctx)
    throw new Error("useSearchForm must be used within SearchFormProvider");
  return ctx;
}
