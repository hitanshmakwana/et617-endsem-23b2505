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
  const mastered = state.masteredQuestionIds || [];
  const seenFormats = (state.results || []).map(r => r.format).filter(Boolean);

  // Exclude questions that are already answered correctly (mastered) OR seen in this session
  let unmastered = QUESTIONS.filter(q => !mastered.includes(q.id));
  let unseen = unmastered.filter(q => !currentSeen.includes(q.id));

  // If repeat practice, prefer questions never seen in earlier sessions
  const neverSeen = unseen.filter(q => !lifetimeSeen.includes(q.id));
  const pool = neverSeen.length >= 2 ? neverSeen : (unseen.length > 0 ? unseen : unmastered.filter(q => !currentSeen.includes(q.id)));

  if (!pool.length) return null;

  const byDist = lv => (a, b) => Math.abs(a.level - lv) - Math.abs(b.level - lv);

  // Strongly prioritize formats that the learner has NOT experienced yet this session!
  const preferDiverseFormat = list => {
    const shuffled = shuffle(list);
    // Find a format not seen at all yet this session
    const unseenFormatQ = shuffled.find(q => !seenFormats.includes(q.format));
    if (unseenFormatQ) return unseenFormatQ;
    // Otherwise find a format different from the immediately preceding question
    const diffFormatQ = shuffled.find(q => q.format !== state.lastFormat);
    if (diffFormatQ) return diffFormatQ;
    return shuffled[0];
  };

  let c = pool.filter(q => q.level === spec.level
    && (!spec.tag || (q.tests && q.tests.includes(spec.tag)))
    && (!spec.concept || spec.tag || q.concept === spec.concept));
  if (!c.length && spec.tag) c = pool.filter(q => q.tests && q.tests.includes(spec.tag)).sort(byDist(spec.level));
  if (!c.length && spec.concept) c = pool.filter(q => q.concept === spec.concept).sort(byDist(spec.level));
  if (!c.length) c = pool.filter(q => q.level === spec.level);
  if (!c.length) c = pool.filter(q => Math.abs(q.level - spec.level) <= 1).sort(byDist(spec.level));
  if (!c.length) c = pool.slice().sort(byDist(spec.level));

  if (!c.length && pool !== unseen) {
    let fallback = unseen.filter(q => q.level === spec.level);
    if (!fallback.length) fallback = unseen;
    if (fallback.length) return preferDiverseFormat(fallback);
  }

  if (!c.length) return null;
  return preferDiverseFormat(c);
}
