import React from "react";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import DestinationField from "../DestinationField";

export default function SearchForm() {
  const [destination, setDestination] = React.useState(null);
  const dateBtnRef = React.useRef(null);

  // Mock function to fetch trending destinations
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
      .map((label, i) => ({ id: `mock:${label}:${i}`, label })); // Mock IDs
  }

  return (
    <div className="mt-0 md:mt-10 w-full">
      {/* Container to center the search bar and limit its max width */}
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-10 gap-3 lg:gap-4 xl:gap-6">
        {/* Destination */}
        <DestinationField
          className="col-span-2 md:col-span-3"
          value={destination}
          onChange={setDestination}
          onComplete={() => dateBtnRef.current?.focus()}
          fetchSuggest={fetchSuggest}
          fetchTrending={fetchTrending}
        />
        {/* Date */}
        <button
          ref={dateBtnRef}
          className="col-span-1 md:col-span-2 flex items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl justify-start"
        >
          <FiCalendar className="text-gray-500 text-base md:text-lg lg:text-xl xl:text-3xl" />
          <span className="uppercase tracking-wide">DATE</span>
        </button>

        {/* Guests */}
        <button className="col-span-1 md:col-span-2 flex items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl justify-start">
          <FiUsers className="text-gray-500 text-base md:text-lg lg:text-xl xl:text-3xl" />
          <span className="uppercase tracking-wide">GUESTS</span>
        </button>

        {/* Search */}
        <button className="col-span-2 md:col-span-3 rounded-xl lg:rounded-xl xl:rounded-2xl bg-[#D9E05E] px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-5 xl:px-12 xl:py-6 shadow-md uppercase tracking-wide lg:tracking-wider text-[#111827] font-medium text-sm md:text-base lg:text-lg xl:text-xl hover:opacity-90">
          SEARCH
        </button>
      </div>
    </div>
  );
}
