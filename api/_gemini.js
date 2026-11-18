export async function callGemini({ system, user, maxOutputTokens = 400, timeoutMs = 7000 }) {
  const rawKey = process.env.GEMINI_API_KEY;
  if (!rawKey) throw new Error("NO_KEY");
  const key = String(rawKey).replace(/^["'=]+|["'=]+$/g, '').trim();

  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const models = [primaryModel, "gemini-2.0-flash", "gemini-1.5-flash"].filter((m, i, a) => a.indexOf(m) === i);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    let lastErr = null;
    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
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

        if (!res.ok) {
          lastErr = new Error("HTTP_" + res.status);
          // If 404 (model not found), try the next model in fallback list
          if (res.status === 404) continue;
          throw lastErr;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("EMPTY");
        return JSON.parse(text);
      } catch (err) {
        lastErr = err;
        if (err.name === 'AbortError') throw err;
      }
    }
    throw lastErr || new Error("ALL_MODELS_FAILED");
  } finally {
    clearTimeout(timer);
  }
}
