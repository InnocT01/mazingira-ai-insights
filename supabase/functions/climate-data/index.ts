import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NASA_POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let latitude = -1.68;
    let longitude = 29.22;
    let parameters = "T2M,PRECTOTCORR,RH2M,WS2M,ALLSKY_SFC_SW_DWN";
    let startDate = getDateDaysAgo(30);
    let endDate = getDateDaysAgo(1);

    // Parse body only for POST requests
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.latitude) latitude = body.latitude;
        if (body.longitude) longitude = body.longitude;
        if (body.parameters) parameters = body.parameters;
        if (body.startDate) startDate = body.startDate;
        if (body.endDate) endDate = body.endDate;
      } catch {
        // Empty body is fine, use defaults
      }
    }

    const nasaUrl = `${NASA_POWER_BASE}?parameters=${parameters}&community=AG&longitude=${longitude}&latitude=${latitude}&start=${startDate}&end=${endDate}&format=JSON`;
    
    console.log("Fetching NASA POWER:", nasaUrl);
    
    const response = await fetch(nasaUrl);
    if (!response.ok) {
      const text = await response.text();
      console.error("NASA POWER error:", response.status, text);
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    
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

    // Compute summary stats
    const temps = transformed.map(d => d.temperature).filter(Boolean) as number[];
    const precips = transformed.map(d => d.precipitation).filter(Boolean) as number[];
    const humids = transformed.map(d => d.humidity).filter(Boolean) as number[];
    const winds = transformed.map(d => d.wind_speed).filter(Boolean) as number[];

    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return new Response(JSON.stringify({
      ok: true,
      location: { latitude, longitude },
      period: { start: startDate, end: endDate },
      summary: {
        current_temp: temps[temps.length - 1] ?? null,
        avg_temp: Math.round(avg(temps) * 10) / 10,
        max_temp: Math.max(...temps),
        min_temp: Math.min(...temps),
        total_precip: Math.round(precips.reduce((a, b) => a + b, 0) * 10) / 10,
        avg_humidity: Math.round(avg(humids) * 10) / 10,
        avg_wind: Math.round(avg(winds) * 10) / 10,
      },
      data: transformed,
      source: "NASA POWER",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("climate-data error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
