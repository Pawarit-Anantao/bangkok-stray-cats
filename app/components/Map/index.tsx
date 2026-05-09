"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocateButton from "./components/LocateButton";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map() {
  const startingPosition: [number, number] = [13.7649, 100.5383];

  return (
    <MapContainer center={startingPosition} zoom={14} zoomControl={false} className="w-full h-full z-0">      
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <LocateButton />
      <Marker position={startingPosition} icon={customIcon}>
        <Popup>
          <div className="text-center font-thai">
            <b className="text-base text-[#FF146E]">น้องแมวอยู่แถวนี้! 🐈</b>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}