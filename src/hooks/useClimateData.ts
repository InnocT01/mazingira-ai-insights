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

export interface ClimateResponse {
  ok: boolean;
  summary: ClimateSummary;
  data: ClimateDay[];
  source: string;
}

export function useClimateData() {
  const [climate, setClimate] = useState<ClimateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/climate-data`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
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
  }, []);

  return { climate, loading, error };
}
