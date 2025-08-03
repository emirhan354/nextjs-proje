"use client";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold hover:underline">
        LOGO
      </Link>
      <nav className="space-x-4">
        <Link href="/" className="hover:underline">
          Anasayfa
        </Link>
        <Link href="/about" className="hover:underline">
          Hakkımızda
        </Link>
        <Link href="/contact" className="hover:underline">
          İletişim
        </Link>
      </nav>
    </header>
  );
};
