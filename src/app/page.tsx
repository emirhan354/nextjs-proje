"use client";
import { Navbar } from "@/components/Navbar";
import { SafeInput } from "@/components/SafeInput";
import { MapModal } from "@/components/MapModal";
import { useState } from "react";

export default function Home() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full px-4 py-8 flex flex-col items-center bg-black text-white gap-8">
        <button
          onClick={() => setShowMap(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Haritayı Göster
        </button>

        <SafeInput />

        {showMap && <MapModal onClose={() => setShowMap(false)} />}
      </main>
    </>
  );
}
