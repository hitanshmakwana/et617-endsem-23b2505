import { MAX_QUESTIONS } from "../config.js";

// s = { level, correctStreak, wrongStreak, recentNoHintCorrect, answeredCount, remainingSeconds }
// result = { verdict: "correct"|"wrong", tag, hintsUsed }; question = the question just answered
// NOTE: answeredCount must already include the question just answered.
export function decide(s, result, question) {
  let level = s.level, cs = s.correctStreak, ws = s.wrongStreak, nh = s.recentNoHintCorrect;
  let type, lessonId = null, nextSpec;
  if (result.verdict === "correct") {
    cs += 1; ws = 0; nh = result.hintsUsed === 0 ? nh + 1 : 0;
    if (nh >= 2 && level < 3) {
      type = "HARDER";
      level += 1;
      cs = 0;
      nh = 0;
      nextSpec = { level, tag: null, concept: null };
    } else {
      type = "CONTINUE";
      nextSpec = { level, tag: null, concept: null };
    }
  } else {
    cs = 0; nh = 0; ws += 1;
    if (ws >= 2) {
      type = "PREREQUISITE";
      lessonId = "PRE1";
      ws = 0;
      nextSpec = { level: Math.max(1, level - 1), tag: null, concept: null };
      level = Math.max(1, level - 1);
    } else {
      type = "ALTERNATIVE";
      lessonId = result.tag === "M1" ? "ALT_M1" : result.tag === "M2" ? "ALT_M2" : "ALT_WALKTHROUGH";
      const tag = result.tag === "M1" || result.tag === "M2" ? result.tag : null;
      nextSpec = { level, tag, concept: tag ? null : question.concept };
    }
  }
  const ended = s.answeredCount >= MAX_QUESTIONS || s.remainingSeconds <= 0;
  const reason = ended
    ? "That's the end of today's practice. Well done for staying with it."
    : reasonText(type, result.tag);

  return {
    type,
    lessonId,
    nextSpec,
    ended,
    reason,
    next: { level, correctStreak: cs, wrongStreak: ws, recentNoHintCorrect: nh }
  };
}

function reasonText(type, tag) {
  if (type === "HARDER") return "You got two in a row without hints, so we're trying a slightly trickier one.";
  if (type === "CONTINUE") return "Here's another one at the same level to build your confidence.";
  if (type === "PREREQUISITE") return "Let's go back one small step first. Tracing how a variable changes will make loops easier.";
  if (tag === "M1") return "Your answer showed a common idea about where range() starts and stops. Let's look at it a different way first, then try a similar question.";
  if (tag === "M2") return "Your answer showed a common idea about which lines repeat. Let's look at it a different way first, then try a similar question.";
  return "Let's go through that one step by step first, then try a similar question.";
}
