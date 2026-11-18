import { QUESTIONS } from "../data/questions.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickNext(state, spec) {
  const currentSeen = state.seenIds || [];
  const lifetimeSeen = state.lifetimeSeenIds || [];

  // All unseen in current session
  let unseen = QUESTIONS.filter(q => !currentSeen.includes(q.id));

  // If repeat practice, strongly prefer questions never seen in earlier sessions
  const neverSeen = unseen.filter(q => !lifetimeSeen.includes(q.id));
  const pool = neverSeen.length >= 2 ? neverSeen : unseen;

  const byDist = lv => (a, b) => Math.abs(a.level - lv) - Math.abs(b.level - lv);
  const prefer = list => {
    const shuffled = shuffle(list);
    return shuffled.find(q => q.format !== state.lastFormat) || shuffled[0];
  };

  let c = pool.filter(q => q.level === spec.level
    && (!spec.tag || (q.tests && q.tests.includes(spec.tag)))
    && (!spec.concept || spec.tag || q.concept === spec.concept));
  if (!c.length && spec.tag) c = pool.filter(q => q.tests && q.tests.includes(spec.tag)).sort(byDist(spec.level));
  if (!c.length && spec.concept) c = pool.filter(q => q.concept === spec.concept).sort(byDist(spec.level));
  if (!c.length) c = pool.filter(q => q.level === spec.level);
  if (!c.length) c = pool.filter(q => Math.abs(q.level - spec.level) <= 1).sort(byDist(spec.level));
  if (!c.length) c = pool.slice().sort(byDist(spec.level));

  // If pool was exhausted (e.g., all 14 questions seen across lifetime), fallback to unseen in current session
  if (!c.length && pool !== unseen) {
    let fallback = unseen.filter(q => q.level === spec.level);
    if (!fallback.length) fallback = unseen;
    if (fallback.length) return prefer(fallback);
  }

  if (!c.length) return null;
  return prefer(c);
}
