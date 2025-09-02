import React from "react";
import hero from "../assets/banner.jpg";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";

export default function Home() {
  return (
    <section className="relative h-screen -mt-14 md:-mt-16 pt-14 md:pt-16 overflow-hidden">
      {/* Mobile image card with overlay title */}
      <div className="md:hidden w-full rounded-2xl overflow-hidden shadow-md bg-white/5 mb-0">
        <div className="relative">
          <img src={hero} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute left-4 top-4 right-4 text-white">
            <h2 className="text-3xl font-semibold tracking-[0.03em]">
              DREAM <span className="font-semibold">STAY</span>
            </h2>
            <p className="-mt-2 text-sm font-light tracking-[0.21em]">
              is where life happens
            </p>
          </div>
        </div>
      </div>

      {/*Desktop image card with overlay title */}
      <img
        src={hero}
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover -z-20"
      />
      {/* Dark layer on the photo */}
      <div className="hidden md:block absolute inset-0 w-full h-full bg-[#111827]/85 -z-10 pointer-events-none" />

      {/* Yellow line under header*/}
      <div className="absolute left-0 right-0 top-14 md:top-16 h-[2px] bg-[#D9E05E]" />

      {/* Content*/}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 md:h-full flex flex-col items-center justify-start md:justify-center text-center text-white pt-1">
        <h1 className="hidden md:block -mt-2 md:-translate-y-20 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[0.35em] whitespace-nowrap">
          DREAM <span className="font-medium">STAY</span>
        </h1>

        <p className="hidden md:block md:-translate-y-20 md:text-2xl font-light md:tracking-[0.7em]">
          is where life happens
        </p>

        {/* Search bar*/}
        <div className="mt-0 md:mt-10 w-full">
          {/* Container to center the search bar and limit its max width */}
          <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-10 gap-3 md:gap-6">
            {/* Destination */}
            <label className="col-span-2 md:col-span-3 flex items-center gap-3 md:gap-5 rounded-xl md:rounded-2xl bg-white px-4 py-3 md:px-8 md:py-6 shadow-md">
              <FiMapPin className="text-gray-500 text-lg md:text-3xl" />
              <input
                className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-900 text-base md:text-xl placeholder:md:text-xl"
                placeholder="Destination?"
              />
            </label>

            {/* Date */}
            <button className="col-span-1 md:col-span-2 flex items-center gap-3 md:gap-5 rounded-xl md:rounded-2xl bg-white px-4 py-3 md:px-8 md:py-6 shadow-md text-gray-500 justify-start md:text-xl">
              <FiCalendar className="text-gray-500 text-lg md:text-3xl" />
              <span className="uppercase tracking-wide">DATE</span>
            </button>

            {/* Guests */}
            <button className="col-span-1 md:col-span-2 flex items-center gap-3 md:gap-5 rounded-xl md:rounded-2xl bg-white px-4 py-3 md:px-8 md:py-6 shadow-md text-gray-500 justify-start md:text-xl">
              <FiUsers className="text-gray-500 text-lg md:text-3xl" />
              <span className="uppercase tracking-wide">GUESTS</span>
            </button>

            {/* Search */}
            <button className="col-span-2 md:col-span-3 rounded-xl md:rounded-2xl bg-[#D9E05E] px-6 py-3 md:px-12 md:py-6 shadow-md uppercase tracking-wide md:tracking-wider text-[#111827] font-medium md:text-xl hover:opacity-90">
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
