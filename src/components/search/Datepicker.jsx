import React from "react";
import { FiCalendar } from "react-icons/fi";

export default function Datepicker(props) {
  return (
    <button
      ref={props.ref}
      className="col-span-1 md:col-span-2 flex items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl justify-start"
    >
      <FiCalendar className="text-gray-500 text-base md:text-lg lg:text-xl xl:text-3xl" />
      <span className="uppercase tracking-wide">DATE</span>
    </button>
  );
}
