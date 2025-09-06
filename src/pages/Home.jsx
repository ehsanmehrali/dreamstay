import React from "react";
import { Outlet } from "react-router-dom";
import hero from "../assets/banner.jpg";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import SearchForm from "../components/Search/SearchForm";

export default function Home() {
  return (
    <>
      <section className="relative h-screen -mt-14 md:-mt-16 pt-14 md:pt-16 overflow-hidden">
        {/* Mobile image card with overlay title */}
        <div className="md:hidden w-full rounded-[8px] overflow-hidden  p-4 mb-0">
          <div className="relative rounded-[8px] overflow-hidden">
            <img src={hero} alt="" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />
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
        <div className="hidden md:block absolute left-4 right-4 top-14 md:top-16 h-[2px] bg-[#D9E05E]" />

        {/* Content*/}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 md:h-full flex flex-col items-center justify-start md:justify-center text-center text-white pt-1">
          <h1 className="hidden md:block -mt-2 md:-translate-y-20 text-4xl sm:text-5xl md:text-6xl font-medium tracking-[0.35em] whitespace-nowrap">
            DREAM <span className="font-medium">STAY</span>
          </h1>

          <p className="hidden md:block md:-translate-y-20 md:text-2xl font-light md:tracking-[0.7em]">
            is where life happens
          </p>
          <SearchForm />
        </div>
      </section>
      <Outlet />
    </>
  );
}
