import React from "react";
import { useSearchForm } from "./SearchFormContext";

export default function SubmitButton({ className = "" }) {
  const { isValid } = useSearchForm();
  return (
    <button
      type="submit"
      disabled={!isValid}
      className={
        "rounded-xl lg:rounded-xl xl:rounded-2xl px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-5 xl:px-12 xl:py-6 shadow-md uppercase tracking-wide lg:tracking-wider font-medium text-sm md:text-base lg:text-lg xl:text-xl " +
        (isValid
          ? "bg-[#D9E05E] text-[#111827] hover:opacity-90"
          : "bg-gray-200 text-gray-400 cursor-not-allowed") +
        " " +
        className
      }
    >
      SEARCH
    </button>
  );
}
