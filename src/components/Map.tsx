"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Location } from "@/models/Location";

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowSize: [45, 45],
});

type Props = {
  locations?: Location[];
};

export const Map = ({ locations = [] }: Props) => {
  const fallbackCenter: [number, number] = [40.945, 29.16];
  const center = (locations[0]?.position as [number, number]) ?? fallbackCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-[500px] rounded-lg z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap katkıda bulunanlar"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, i) => (
        <Marker key={i} position={loc.position} icon={pinIcon}>
          <Popup>
            <strong>{loc.title}</strong>
            <br />
            {loc.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
