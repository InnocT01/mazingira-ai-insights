import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { farm_id, latitude, longitude, soil_description, scan_type } = await req.json();

    // Fetch climate data for the location for AI context
    const lat = latitude || -1.68;
    const lon = longitude || 29.22;
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

    const prompt = `You are an expert soil scientist and agronomist for the Democratic Republic of Congo. 
Analyze this soil sample and provide actionable recommendations.

Location: ${lat}°, ${lon}°
Scan type: ${scan_type || "quick"}
Soil description from farmer: ${soil_description || "Not provided"}

Provide a JSON response with:
{
  "soil_quality_score": (1-100),
  "ph_estimate": (number),
  "organic_matter": "low/medium/high",
  "nitrogen_level": "deficient/adequate/surplus",
  "phosphorus_level": "deficient/adequate/surplus", 
  "potassium_level": "deficient/adequate/surplus",
  "texture": "sandy/loamy/clay/silt",
  "drainage": "poor/moderate/good",
  "recommended_crops": ["crop1", "crop2", "crop3"],
  "amendments": ["amendment1", "amendment2"],
  "risks": ["risk1"],
  "summary_fr": "Résumé en français pour l'agriculteur",
  "summary_en": "English summary for the farmer"
}`;

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!groqResp.ok) {
      const errText = await groqResp.text();
      console.error("Groq error:", groqResp.status, errText);
      throw new Error(`AI analysis failed: ${groqResp.status}`);
    }

    const groqData = await groqResp.json();
    const analysisText = groqData.choices?.[0]?.message?.content || "{}";
    let results;
    try {
      results = JSON.parse(analysisText);
    } catch {
      results = { raw_analysis: analysisText, error: "Could not parse AI response" };
    }

    // Save to DB
    const { data: scan, error: scanError } = await supabase
      .from("soil_scans")
      .insert({
        user_id: user.id,
        farm_id: farm_id || null,
        scan_type: scan_type || "quick",
        results,
        status: "completed",
        notes: soil_description,
      })
      .select()
      .single();

    if (scanError) {
      console.error("DB error:", scanError);
      throw new Error("Failed to save scan results");
    }

    return new Response(JSON.stringify({ scan, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("soil-scan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
