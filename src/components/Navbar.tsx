"use client";
import { useState } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">LOGO</div>

      <div className="sm:hidden">
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      <div
        className={`gap-6 sm:flex ${
          open ? "flex flex-col mt-4" : "hidden"
        } sm:flex-row sm:items-center`}
      >
        <Link href="/">Anasayfa</Link>
        <Link href="/about">Hakkımızda</Link>
        <Link href="/contact">İletişim</Link>
      </div>
    </nav>
  );
};
