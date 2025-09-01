import React from "react";
import { LuMenu } from "react-icons/lu";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-1 shadow-sm bg-white">
      <img src={logo} alt="Dream Stay Logo" className="h-10 w-auto mt-1.5" />
      <div className="flex items-center gap-2">
        <LuMenu size={22} className="text-gray-700" />
      </div>
    </header>
  );
}
