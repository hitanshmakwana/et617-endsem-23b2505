import { AI_TIMEOUT_GRADE_MS, AI_TIMEOUT_GENERATE_MS } from "../config.js";
import { normalizeAnswer } from "./normalize.js";
import { buildFromSpec, localSpec, specKey } from "./generator.js";

function validateGrade(out, modelAnswer) {
  if (!out || typeof out !== "object") return false;
  if (!["correct", "partial", "incorrect"].includes(out.verdict)) return false;
  if (out.misconception !== null && out.misconception !== "M1" && out.misconception !== "M2") return false;
  if (typeof out.hint !== "string" || out.hint.length < 1 || out.hint.length > 200) return false;

  // Only printable ASCII
  if (!/^[\x20-\x7E]+$/.test(out.hint)) return false;

  // Hint must not contain normalized model answer as substring
  const nHint = normalizeAnswer(out.hint);
  const nModel = normalizeAnswer(modelAnswer);
  if (nModel.length > 2 && nHint.includes(nModel)) return false;

  // Hint must not say wrong/incorrect/stupid/silly/fail
  if (/\b(wrong|incorrect|stupid|silly|fail)\b/i.test(out.hint)) return false;

  return true;
}

export async function aiGrade(q, studentAnswer) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AI_TIMEOUT_GRADE_MS);

  try {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: q.prompt,
        code: q.code || "none",
        rubric: q.aiRubricText || "Check understanding",
        modelAnswer: q.modelAnswer || "",
        studentAnswer: String(studentAnswer || "").slice(0, 300)
      }),
      signal: ctrl.signal
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.ok || !json.data) return null;

    if (validateGrade(json.data, q.modelAnswer)) {
      return json.data;
    }
    return null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function requestGeneratedQuestion(state, spec) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AI_TIMEOUT_GENERATE_MS);

  const level = spec.level || state.level || 1;
  const targetTag = spec.tag || null;
  const recent = (state.results || []).slice(-3).map(r => ({
    id: r.id,
    verdict: r.verdict,
    tag: r.tag
  }));

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, targetTag, recent }),
      signal: ctrl.signal
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.data) {
        const candidateSpec = json.data;
        const key = specKey(candidateSpec);
        const usedKeys = state.generatedKeys || [];
        if (!usedKeys.includes(key)) {
          const q = buildFromSpec(candidateSpec, level, (state.generatedCount || 0) + 1);
          if (q) {
            return { question: q, specKey: key, source: "ai-spec" };
          }
        }
      }
    }
  } catch (e) {
    // Fall back to local
  } finally {
    clearTimeout(timer);
  }

  // Local fallback
  const usedKeys = state.generatedKeys || [];
  const fallbackSpec = localSpec(level, targetTag, usedKeys);
  const key = specKey(fallbackSpec);
  const q = buildFromSpec(fallbackSpec, level, (state.generatedCount || 0) + 1);
  return { question: q, specKey: key, source: "local" };
}
