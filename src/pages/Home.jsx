import React from "react";
import hero from "../assets/banner.jpg";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";

export default function Home() {
  return (
    <section className="relative h-screen -mt-14 md:-mt-16 pt-14 md:pt-16 overflow-hidden">
      {/* بک‌گراند */}
      <img
        src={hero} // این مسیر رو با عکس خودت عوض کن
        alt=""
        className="absolute inset-0 h-full w-full object-cover -z-20"
      />
      {/* لایه‌ی تیره روی عکس */}
      <div className="absolute inset-0 bg-[#111827]/75 -z-10 pointer-events-none" />

      {/* خط زرد زیر هدر (مثل اسکرین‌شات) */}
      <div className="absolute left-0 right-0 top-14 md:top-16 h-[2px] bg-[#D9E05E]" />

      {/* محتوا */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.35em]">
          DREAM <span className="font-medium">STAY</span>
        </h1>

        <p className="mt-6 text-lg md:text-2xl font-light tracking-[0.35em]">
          is where life happens
        </p>

        {/* نوار جستجو */}
        <div className="mt-10 md:mt-14 w-full">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Destination */}
            <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-md">
              <FiMapPin className="text-gray-500" />
              <input
                className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-900"
                placeholder="Destination?"
              />
            </label>

            {/* Date */}
            <button className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-md text-gray-900 justify-start">
              <FiCalendar className="text-gray-500" />
              <span className="uppercase tracking-wide">DATE</span>
            </button>

            {/* Guests */}
            <button className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-md text-gray-900 justify-start">
              <FiUsers className="text-gray-500" />
              <span className="uppercase tracking-wide">GUESTS</span>
            </button>

            {/* Search */}
            <button className="rounded-xl bg-[#D9E05E] px-6 py-3 shadow-md uppercase tracking-wide text-[#111827] font-medium hover:opacity-90">
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
