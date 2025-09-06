import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { FiUsers } from "react-icons/fi";

function GuestsPickerImpl({ className = "", value = 1, onChange }, ref) {
  const btnRef = useRef(null);
  useImperativeHandle(ref, () => ({ focus: () => btnRef.current?.focus() }));

  return (
    <button
      type="button"
      ref={btnRef}
      onClick={() => onChange?.(value + 1)} // Default value one person, on each click +1
      className={
        "flex items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl justify-start " +
        className
      }
    >
      <FiUsers className="text-gray-500 text-base md:text-lg lg:text-xl xl:text-3xl" />
      <span className="uppercase tracking-wide">GUESTS</span>
    </button>
  );
}

const GuestsPicker = forwardRef(GuestsPickerImpl);
export default GuestsPicker;
