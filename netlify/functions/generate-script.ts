import { GoogleGenAI } from "@google/genai";

// Get Active Secret API Key
function getAPIKey(): string {
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey !== "MY_GEMINI_API_KEY" && envKey !== "MOCK_KEY" && envKey !== "undefined" && envKey.trim() !== "") {
    return envKey;
  }
  return "AIzaSyAdskHo0Fd5GgTEdcyiRr1QVPbuMmSbkPY";
}

// Lazy initialization of Gemini SDK
let aiClient: GoogleGenAI | null = null;
let sandboxClient: GoogleGenAI | null = null;
let userApiKeyQuotaExceeded = false;

function getAI(): GoogleGenAI {
  const userKey = getAPIKey();
  const isCustom = userKey !== "AIzaSyAdskHo0Fd5GgTEdcyiRr1QVPbuMmSbkPY";

  if (isCustom && !userApiKeyQuotaExceeded) {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: userKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }
    return aiClient;
  }

  if (!sandboxClient) {
    sandboxClient = new GoogleGenAI({
      apiKey: "AIzaSyAdskHo0Fd5GgTEdcyiRr1QVPbuMmSbkPY",
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return sandboxClient;
}

// Robust retry wrapper for Gemini
async function callWithRetry<T>(
  fn: (model: string) => Promise<T>,
  preferredModel = "gemini-2.5-flash",
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  let currentModel = preferredModel;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(currentModel);
    } catch (err: any) {
      lastError = err;
      const errMsg = (err?.message || "").toString();
      const errStatus = (err?.status || "").toString();

      const isQuotaExceeded =
        errStatus === "RESOURCE_EXHAUSTED" ||
        errMsg.includes("quota") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("limit: 0");

      if (isQuotaExceeded && !userApiKeyQuotaExceeded) {
        userApiKeyQuotaExceeded = true;
      }

      if (attempt === retries) {
        throw err;
      }

      const backoff = delayMs * Math.pow(2.0, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
  throw lastError;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
  "Content-Type": "application/json"
};

export default async (req: Request) => {
  if (req.method === "OPTIONS" || (req as any).httpMethod === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    const rawBody = await req.text();
    const body = rawBody ? JSON.parse(rawBody) : {};
    const { topic, style } = body;
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400, headers });
    }

    const ai = getAI();
    const systemPrompt = `You are an elite, viral scriptwriter for "KRON SCRIPT AI". Your job is to write a high-retention script based on the user's topic. You MUST follow this exact structure:

1. **5-SECOND VISUAL HOOK**
Write it as a [VISUAL] direction.

2. **FAST-PACED INTRO (10-20 seconds)**
Include a spoken hook to create an open loop.

3. **BODY — THE MEAT (3-5 sections)**
Include timestamps, [B-ROLL: description] cues, and [TEXT ON SCREEN: "key phrase"] tags.

4. **OUTRO (final 20-30 seconds)**
Natural, non-cringe call-to-action.`;

    const response = await callWithRetry((model) =>
      ai.models.generateContent({
        model,
        contents: `Write a viral script about: "${topic}"\nStyle: ${style || "Story-driven"}`,
        config: { systemInstruction: systemPrompt },
      })
    );

    return new Response(JSON.stringify({ content: response.text }), { status: 200, headers });
  } catch (error: any) {
    console.error("Error in generate-script Netlify function:", error);
    return new Response(JSON.stringify({ error: "High server demand. Please try your request again in a moment." }), { status: 503, headers });
  }
};
