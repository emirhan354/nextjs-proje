"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkAuth = () => {
      const hasLS = !!localStorage.getItem("token");
      const hasCookie = document.cookie
        .split("; ")
        .some((c) => c.startsWith("token="));
      setIsAuthed(hasLS || hasCookie);
    };
    checkAuth();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") checkAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  const logoHref = isAuthed ? "/dashboard" : "/";
  const handleLoginClick = () => router.push("/login");
  const handleDashboardClick = () => router.push("/dashboard");

  return (
    <header className="sticky top-0 z-40 bg-[#0E1624] text-white">
      <div className="container flex h-14 items-center justify-between">
        <Link href={logoHref} className="text-xl font-extrabold tracking-wide">
          LOGO
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:opacity-80">
            Anasayfa
          </Link>
          <Link href="/about" className="hover:opacity-80">
            Hakkımızda
          </Link>
          <Link href="/contact" className="hover:opacity-80">
            İletişim
          </Link>

          {!isAuthed ? (
            <button
              onClick={handleLoginClick}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Giriş Yap
            </button>
          ) : (
            <button
              onClick={handleDashboardClick}
              className="ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
            >
              Dashboard
            </button>
          )}
        </nav>

        <button
          className="md:hidden btn btn-ghost"
          aria-label="Menüyü aç/kapat"
          onClick={() => setOpen((s) => !s)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0E1624]">
          <div className="container py-2 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
            >
              Anasayfa
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
            >
              İletişim
            </Link>

            {!isAuthed ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLoginClick();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Giriş Yap
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  handleDashboardClick();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
