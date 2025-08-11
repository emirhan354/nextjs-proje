"use client";
import dynamic from "next/dynamic";
import type { Location } from "@/models/Location";

// SSR hatasını önlemek için dinamik import
const Map = dynamic(() => import("./Map").then((m) => m.Map), { ssr: false });

type Props = {
  onClose: () => void;
  locations?: Location[];
};

export const MapModal = ({ onClose, locations = [] }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md text-red-600 hover:text-red-800 text-2xl font-bold transition duration-200"
          aria-label="Harita modalsını kapat"
        >
          ×
        </button>
        <Map locations={locations} />
      </div>
    </div>
  );
};
