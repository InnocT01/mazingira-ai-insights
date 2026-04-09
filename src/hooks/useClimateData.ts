import { useState, useEffect } from "react";

interface ClimateDay {
  date: string;
  temperature: number | null;
  precipitation: number | null;
  humidity: number | null;
  wind_speed: number | null;
  solar_radiation: number | null;
}

interface ClimateSummary {
  current_temp: number | null;
  avg_temp: number;
  max_temp: number;
  min_temp: number;
  total_precip: number;
  avg_humidity: number;
  avg_wind: number;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export interface ClimateResponse {
  ok: boolean;
  summary: ClimateSummary;
  data: ClimateDay[];
  source: string;
  location?: { latitude: number; longitude: number };
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoLocation>({ latitude: -1.68, longitude: 29.22, name: "Goma, Nord-Kivu, RDC" });
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        let name = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`);
          const data = await resp.json();
          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
            const state = data.address.state || "";
            const country = data.address.country || "";
            name = [city, state, country].filter(Boolean).join(", ");
          }
        } catch {}
        setGeo({ latitude: lat, longitude: lon, name });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { geo, locating };
}

export function useClimateData(latitude?: number, longitude?: number) {
  const [climate, setClimate] = useState<ClimateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body: any = {};
        if (latitude !== undefined && longitude !== undefined) {
          body.latitude = latitude;
          body.longitude = longitude;
        }

        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/climate-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify(body),
          }
        );
        const data = await resp.json();
        if (data.ok) {
          setClimate(data);
        } else {
          setError(data.error || "Failed to load climate data");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [latitude, longitude]);

  return { climate, loading, error };
}
