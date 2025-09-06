import React from "react";

const SearchFormContext = React.createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "setDestination":
      return { ...state, destination: action.payload };
    case "setDates":
      return { ...state, dates: action.payload };
    case "setGuests":
      return { ...state, guests: action.payload };
    default:
      return state;
  }
}

export function SearchFormProvider({ children, onSubmit }) {
  const [state, dispatch] = React.useReducer(reducer, {
    destination: null, // {id,label}
    dates: null, // {start: Date, end: Date}
    guests: 1,
  });

  // refs for step focus
  const dateRef = React.useRef(null);
  const guestsRef = React.useRef(null);

  const isValid =
    !!state.destination && !!state.dates && Number(state.guests) > 0;

  const value = {
    state,
    dispatch,
    isValid,
    refs: { dateRef, guestsRef },
    onSubmit, // Final callback
  };

  return (
    <SearchFormContext.Provider value={value}>
      {children}
    </SearchFormContext.Provider>
  );
}

export function useSearchForm() {
  const ctx = React.useContext(SearchFormContext);
  if (!ctx)
    throw new Error("useSearchForm must be used within SearchFormProvider");
  return ctx;
}
