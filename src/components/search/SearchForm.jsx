import React from "react";
import { SearchFormProvider, useSearchForm } from "./SearchFormContext";
import DestinationFieldControl from "./DestinationFieldControl";
import Datepicker from "./Datepicker";
import GuestsPicker from "./GuestsPicker";
import SubmitButton from "./SubmitButton";

export default function SearchForm() {
  async function callSearchAPI({ destination, dates, guests }) {
    // اینجا API اصلی‌ات را صدا بزن:
    // await fetch("/api/search", {method:"POST", body: JSON.stringify({destination, dates, guests})})
    console.log("API payload:", { destination, dates, guests });
  }

  return (
    <SearchFormProvider onSubmit={callSearchAPI}>
      <SearchFormInner />
    </SearchFormProvider>
  );
}

function SearchFormInner() {
  const { state, dispatch, refs, isValid, onSubmit } = useSearchForm();

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.(state);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-0 md:mt-10 w-full">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-10 gap-3 lg:gap-4 xl:gap-6">
        {/* Destination */}
        <DestinationFieldControl
          className="col-span-2 md:col-span-3"
          onComplete={() => refs.dateRef.current?.focus?.()}
        />

        {/* Date */}
        <Datepicker
          ref={refs.dateRef}
          className="col-span-1 md:col-span-2"
          value={state.dates}
          onChange={(v) => {
            dispatch({ type: "setDates", payload: v });
            // بعد از انتخاب تاریخ برو گام بعد:
            refs.guestsRef.current?.focus?.();
          }}
        />

        {/* Guests */}
        <GuestsPicker
          ref={refs.guestsRef}
          className="col-span-1 md:col-span-2"
          value={state.guests}
          onChange={(v) => dispatch({ type: "setGuests", payload: v })}
        />

        {/* Submit */}
        <SubmitButton className="col-span-2 md:col-span-3" />
      </div>
    </form>
  );
}
