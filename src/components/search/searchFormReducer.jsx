export const initialSearchFormState = {
  destination: null,
  dates: null,
  guests: 1,
};

export function searchFormReducer(state, action) {
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
