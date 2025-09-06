import React from "react";
import { SearchFormContext } from "./SearchFormContext.jsx";
import {
  searchFormReducer,
  initialSearchFormState,
} from "./searchFormReducer.jsx";

export function SearchFormProvider({ children, onSubmit }) {
  const [state, dispatch] = React.useReducer(
    searchFormReducer,
    initialSearchFormState
  );

  const dateRef = React.useRef(null);
  const guestsRef = React.useRef(null);
  const isValid = !!state.destination && !!state.dates && state.guests > 0;

  const value = {
    state,
    dispatch,
    isValid,
    refs: { dateRef, guestsRef },
    onSubmit,
  };

  return (
    <SearchFormContext.Provider value={value}>
      {children}
    </SearchFormContext.Provider>
  );
}
