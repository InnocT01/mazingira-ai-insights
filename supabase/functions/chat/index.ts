import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  default: `You are Mazingira AI, an expert environmental intelligence assistant for the Democratic Republic of the Congo and Africa.

You specialize in:
- Soil health analysis and recommendations
- Crop selection for different soil types and climates
- NDVI vegetation indices and satellite data interpretation
- Climate risk assessment (drought, floods, erosion)
- Regenerative agriculture practices
- Weather forecasting for agricultural planning

Always provide actionable, practical advice. Reference specific regions in DRC when relevant. Use both French and English when helpful. Be concise but thorough.`,

  ecokids: `You are EcoKids AI, a friendly and educational climate assistant for school children aged 8-16 in the Democratic Republic of the Congo.

Your role:
- Explain climate and environmental concepts in SIMPLE, FUN language appropriate for children
- Use emojis to make explanations more engaging 🌍🌱☀️💧
- Relate concepts to things children see in their daily life (school, playground, gardens)
- Encourage curiosity and scientific thinking
- When discussing sensor data (temperature, humidity, UV, etc.), explain what the numbers MEAN for their health and daily activities
- Suggest simple experiments or observations children can do at school
- Answer in the language the child uses (French, Swahili, Lingala, English, Wolof, or Zulu)
- Keep answers SHORT (2-4 paragraphs max) and use bullet points
- Always be encouraging and positive about learning

IMPORTANT: You are talking to CHILDREN. No jargon. No complex sentences. Use analogies they understand.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const system = SYSTEM_PROMPTS[systemPrompt || "default"] || SYSTEM_PROMPTS.default;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
