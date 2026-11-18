import { QUESTIONS } from "../data/questions.js";

export function pickNext(state, spec) {
  const seen = state.seenIds || [];
  const unseen = QUESTIONS.filter(q => !seen.includes(q.id));
  const byDist = lv => (a, b) => Math.abs(a.level - lv) - Math.abs(b.level - lv) || a.id.localeCompare(b.id);
  const prefer = list => list.find(q => q.format !== state.lastFormat) || list[0];

  let c = unseen.filter(q => q.level === spec.level
    && (!spec.tag || (q.tests && q.tests.includes(spec.tag)))
    && (!spec.concept || spec.tag || q.concept === spec.concept));
  if (!c.length && spec.tag) c = unseen.filter(q => q.tests && q.tests.includes(spec.tag)).sort(byDist(spec.level));
  if (!c.length && spec.concept) c = unseen.filter(q => q.concept === spec.concept).sort(byDist(spec.level));
  if (!c.length) c = unseen.filter(q => q.level === spec.level);
  if (!c.length) c = unseen.filter(q => Math.abs(q.level - spec.level) <= 1).sort(byDist(spec.level));
  if (!c.length) c = unseen.slice().sort(byDist(spec.level));
  if (!c.length) return null;       // bank exhausted → end the session
  return prefer(c);
}
