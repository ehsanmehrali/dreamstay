import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { FiCalendar } from "react-icons/fi";

function DatepickerImpl({ className = "", value, onChange }, ref) {
  const btnRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => btnRef.current?.focus(),
  }));

  return (
    <button
      type="button"
      ref={btnRef}
      className={
        "flex items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl lg:rounded-xl xl:rounded-2xl bg-white px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-6 shadow-md text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl justify-start " +
        className
      }
      onClick={() => {
        // mock date selection:
        const now = new Date();
        const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        onChange?.({ start: now, end });
      }}
    >
      <FiCalendar className="text-gray-500 text-base md:text-lg lg:text-xl xl:text-3xl" />
      <span className="uppercase tracking-wide">{"DATE"}</span>
    </button>
  );
}

const Datepicker = forwardRef(DatepickerImpl);
export default Datepicker;
