import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// NASA POWER API - free, no key needed
const NASA_POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, parameters, startDate, endDate } = await req.json();

    const lat = latitude || -1.68; // Default: Goma
    const lon = longitude || 29.22;
    const params = parameters || "T2M,PRECTOTCORR,RH2M,WS2M,ALLSKY_SFC_SW_DWN";
    const start = startDate || getDateDaysAgo(30);
    const end = endDate || getDateDaysAgo(1);

    const nasaUrl = `${NASA_POWER_BASE}?parameters=${params}&community=AG&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;
    
    console.log("Fetching NASA POWER:", nasaUrl);
    
    const response = await fetch(nasaUrl);
    if (!response.ok) {
      const text = await response.text();
      console.error("NASA POWER error:", response.status, text);
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform into clean format
    const properties = data.properties?.parameter || {};
    const dates = Object.keys(properties.T2M || {});
    
    const transformed = dates.map(date => ({
      date,
      temperature: properties.T2M?.[date] ?? null,
      precipitation: properties.PRECTOTCORR?.[date] ?? null,
      humidity: properties.RH2M?.[date] ?? null,
      wind_speed: properties.WS2M?.[date] ?? null,
      solar_radiation: properties.ALLSKY_SFC_SW_DWN?.[date] ?? null,
    })).filter(d => d.temperature !== -999 && d.temperature !== null);

    return new Response(JSON.stringify({
      location: { latitude: lat, longitude: lon },
      period: { start, end },
      data: transformed,
      source: "NASA POWER",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("climate-data error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
