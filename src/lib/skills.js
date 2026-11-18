export const SKILLS = [
  { concept: "range-values", label: "Numbers that range() gives" },
  { concept: "indent-repeat", label: "Which lines repeat" },
  { concept: "accumulator", label: "Keeping a running total" }
];

export function computeSkillStatus(concept, results) {
  const relevant = (results || []).filter(r => r.concept === concept && !r.isPrereqCheck);
  if (relevant.length === 0) return "NOT_PRACTISED";
  const last = relevant[relevant.length - 1];
  if (last.verdict === "correct" && (last.hintsUsed === 0 || last.hintsUsed === undefined)) {
    return "GOT_IT";
  }
  const anyCorrect = relevant.some(r => r.verdict === "correct");
  if (anyCorrect) return "GETTING_THERE";
  return "REVISIT";
}

export function getSkillsSummary(results) {
  return SKILLS.map(s => ({
    concept: s.concept,
    label: s.label,
    status: computeSkillStatus(s.concept, results)
  }));
}

export function getNextFocus(summary) {
  const order = ["REVISIT", "GETTING_THERE", "NOT_PRACTISED"];
  for (const st of order) {
    const found = summary.find(s => s.status === st);
    if (found) return found.label;
  }
  return "You can try harder questions. Great job.";
}
