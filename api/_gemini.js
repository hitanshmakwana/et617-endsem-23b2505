export async function callGemini({ system, user, maxOutputTokens = 400, timeoutMs = 7000 }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("NO_KEY");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens, responseMimeType: "application/json" }
      }),
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error("HTTP_" + res.status);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("EMPTY");
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}
