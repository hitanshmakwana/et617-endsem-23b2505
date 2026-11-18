import { normalizeAnswer } from "./normalize.js";

function wrap(q, verdict, tag, answerText, checkedBy = "rules", overrideText = null) {
  let feedbackText;
  if (verdict === "correct") feedbackText = q.correctFeedback;
  else feedbackText = overrideText || (q.feedbackByTag && q.feedbackByTag[tag]) || (q.feedbackByTag && q.feedbackByTag.GENERIC) || "Let's review this together.";
  return { verdict, tag: verdict === "correct" ? null : tag, feedbackText, answerText, checkedBy };
}

// MCQ: input = option id. PREDICT: input = string. ORDER: input = array of line ids.
export function evaluateObjective(q, input) {
  if (q.format === "MCQ") {
    const opt = q.options.find(o => o.id === input);
    const text = opt ? opt.text : String(input);
    if (input === q.correctOptionId) return wrap(q, "correct", null, text);
    return wrap(q, "wrong", (opt && opt.tag) || "GENERIC", text);
  }
  if (q.format === "PREDICT") {
    const n = normalizeAnswer(input);
    const text = String(input).trim();
    if (q.answer.correct.map(normalizeAnswer).includes(n)) return wrap(q, "correct", null, text);
    for (const [tag, list] of Object.entries(q.answer.tags || {})) {
      if (list.map(normalizeAnswer).includes(n)) return wrap(q, "wrong", tag, text);
    }
    return wrap(q, "wrong", "GENERIC", text);
  }
  if (q.format === "ORDER") {
    const text = input.map(id => q.lines.find(l => l.id === id).text.trim()).join("  →  ");
    const same = input.length === q.correctOrder.length && input.every((id, i) => id === q.correctOrder[i]);
    return same ? wrap(q, "correct", null, text) : wrap(q, "wrong", "GENERIC", text);
  }
  throw new Error("evaluateObjective: unsupported format " + q.format);
}

// EXPLAIN step 1: deterministic rules. Returns { decided: true, result } or { decided: false } (then call AI).
export function evaluateExplainRules(q, text) {
  const t = String(text || "");
  const all = q.rubric.mustMention.every(m => m.patterns.some(p => p.test(t)));
  if (all) return { decided: true, result: wrap(q, "correct", null, t.trim()) };
  return { decided: false };
}

// EXPLAIN step 3: fallback when AI is unavailable or its output was rejected.
export function evaluateExplainFallback(q, text) {
  const t = String(text || "");
  const negated = /\bnot\b|n't|\bno\b/i.test(t);
  if (!negated) {
    for (const [tag, pats] of Object.entries(q.rubric.wrongPatterns || {})) {
      if (pats.some(p => p.test(t))) return wrap(q, "wrong", tag, t.trim());
    }
  }
  return wrap(q, "wrong", "GENERIC", t.trim());
}

// EXPLAIN step 2 result from AI (already validated by aiClient). aiOut = { verdict, misconception, hint }
export function evaluateExplainFromAi(q, text, aiOut) {
  const t = String(text || "").trim();
  if (aiOut.verdict === "correct") return wrap(q, "correct", null, t, "ai", null);
  const tag = aiOut.misconception === "M1" || aiOut.misconception === "M2" ? aiOut.misconception : "GENERIC";
  return wrap(q, "wrong", tag, t, "ai", aiOut.hint);
}
