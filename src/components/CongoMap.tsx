import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const markers = [
  { pos: [-1.68, 29.22] as [number, number], label: "Goma — NDVI Monitoring Station" },
  { pos: [-2.5, 28.86] as [number, number], label: "Bukavu — Climate Sensor" },
  { pos: [-1.25, 29.0] as [number, number], label: "Virunga — Forest Watch" },
  { pos: [-3.0, 29.5] as [number, number], label: "Uvira — Soil Moisture Sensor" },
  { pos: [-0.5, 25.2] as [number, number], label: "Kisangani — Rainfall Station" },
  { pos: [-4.32, 15.31] as [number, number], label: "Kinshasa — Weather Hub" },
];

const CongoMap = () => {
  return (
    <MapContainer
      center={[-2.5, 25.0]}
      zoom={5}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: "500px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        opacity={0.6}
      />
      {markers.map((m) => (
        <Marker key={m.label} position={m.pos}>
          <Popup>
            <strong className="text-sm">{m.label}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CongoMap;
