import { callGemini } from "./_gemini.js";

const SYSTEM_PROMPT = `You help a Python-loops tutor pick settings for the next practice question. Reply with ONLY a JSON object, no other text.
Two families:
1) {"family":"range_values","params":{"start":int,"stop":int,"step":int}} prints the values of range(start, stop, step). Use it to practise M1 (the idea that range includes the stop number or starts at 1).
2) {"family":"after_loop","params":{"n":int,"word":string,"after":string}} prints a word n times inside a loop, then another word once after the loop. Use it to practise M2 (the idea that unindented lines also repeat).
Level grids:
- range_values level 1: start=0, step=1, stop 3..6. Level 2: start in 1,2,3,5; step=1; stop-start in 3,4,5. Level 3: step in 2,3; start in 0,1,2; 3 or 4 values; (stop-start) divisible by step.
- after_loop (levels 1-2 only): n in 2,3,4; word in Tea,Chai,Hi,Go,Roti; after in Done,Bye,End.
Choose the family that matches targetTag (M1 -> range_values, M2 -> after_loop). If targetTag is null choose the family the student struggled with most in "recent", else range_values. Prefer settings different from earlier questions.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: false });
  }

  const { level, targetTag, recent } = req.body || {};
  if (!level) {
    return res.status(200).json({ ok: false });
  }

  const userMessage = JSON.stringify({ level, targetTag, recent });

  try {
    const data = await callGemini({
      system: SYSTEM_PROMPT,
      user: userMessage,
      maxOutputTokens: 300,
      timeoutMs: 5500
    });
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(200).json({ ok: false });
  }
}
