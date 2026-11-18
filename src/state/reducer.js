import { QUESTIONS, PREREQ_QUESTIONS } from "../data/questions.js";
import { LESSONS } from "../data/lessons.js";
import { SESSION_SECONDS } from "../config.js";
import { loadProfile, saveProfile } from "./storage.js";
import { buildFromSpec, localSpec } from "../lib/generator.js";

const savedProfile = loadProfile() || {};

export const initialState = {
  version: 1,
  screen: "WELCOME",
  prevScreen: "WELCOME",
  remainingSeconds: SESSION_SECONDS,
  timeUp: false,
  level: savedProfile.startingLevel || 1,
  startingLevel: savedProfile.startingLevel || 1,
  correctStreak: 0,
  wrongStreak: 0,
  recentNoHintCorrect: 0,
  answeredCount: 0,
  generatedCount: 0,
  seenIds: [],
  lifetimeSeenIds: savedProfile.lifetimeSeenIds || [],
  masteredQuestionIds: savedProfile.masteredQuestionIds || [],
  sessionCount: savedProfile.sessionCount || 0,
  diagnosticQueue: [],
  lastFormat: null,
  generatedKeys: [],
  current: null,
  feedback: null,
  lesson: null,
  prereq: { active: false, step: 0 },
  nextQuestion: null,
  results: []
};

function selectInitialQuestions(startLevel, mastered = [], lifetime = []) {
  const isAvailable = (id) => !mastered.includes(id);
  const isFresh = (id) => isAvailable(id) && !lifetime.includes(id);

  let pool1, pool2;
  if (startLevel === 3) {
    pool1 = ["Q10", "Q11", "Q12"];
    pool2 = ["Q14", "Q10", "Q11"];
  } else if (startLevel === 2) {
    pool1 = ["Q05", "Q08", "Q06"];
    pool2 = ["Q07", "Q09", "Q15"];
  } else {
    pool1 = ["Q03", "Q01", "Q02", "Q16"];
    pool2 = ["Q04", "Q13", "Q15"];
  }

  // Pick first question ID
  let q1Id = pool1.find(isFresh) || pool1.find(isAvailable);
  if (!q1Id) {
    const anyLevelQ = QUESTIONS.find(q => q.level === startLevel && isAvailable(q.id));
    if (anyLevelQ) q1Id = anyLevelQ.id;
  }

  // Pick second diagnostic question ID
  let q2Id = pool2.find(id => id !== q1Id && isFresh(id)) || pool2.find(id => id !== q1Id && isAvailable(id));
  if (!q2Id) {
    const anyLevelQ2 = QUESTIONS.find(q => q.level === startLevel && q.id !== q1Id && isAvailable(q.id));
    if (anyLevelQ2) q2Id = anyLevelQ2.id;
  }

  let firstQ = q1Id ? QUESTIONS.find(q => q.id === q1Id) : null;
  if (!firstQ) {
    firstQ = buildFromSpec(localSpec(startLevel, null, []), startLevel, 1);
  }

  return {
    firstQuestion: firstQ,
    diagnosticQueue: q2Id ? [q2Id] : []
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case "START_SESSION": {
      const startingLevel = state.startingLevel || state.level || 1;
      const lifetime = state.lifetimeSeenIds || [];
      const mastered = state.masteredQuestionIds || [];

      const { firstQuestion, diagnosticQueue } = selectInitialQuestions(startingLevel, mastered, lifetime);

      return {
        ...state,
        level: startingLevel,
        screen: "QUESTION",
        remainingSeconds: state.remainingSeconds || SESSION_SECONDS,
        timeUp: false,
        diagnosticQueue,
        current: {
          question: firstQuestion,
          startedAtMs: Date.now(),
          hintsUsed: 0,
          isPrereqCheck: false
        }
      };
    }

    case "RESUME": {
      const saved = action.payload;
      return {
        ...saved,
        screen: saved.screen || "QUESTION"
      };
    }

    case "START_FRESH": {
      return {
        ...initialState,
        level: state.startingLevel || 1,
        startingLevel: state.startingLevel || 1,
        masteredQuestionIds: state.masteredQuestionIds || [],
        lifetimeSeenIds: state.lifetimeSeenIds || [],
        sessionCount: state.sessionCount || 0,
        screen: "INTRO"
      };
    }

    case "GO_ABOUT": {
      return {
        ...state,
        prevScreen: state.screen,
        screen: "ABOUT"
      };
    }

    case "BACK_FROM_ABOUT": {
      return {
        ...state,
        screen: state.prevScreen || "WELCOME"
      };
    }

    case "STOP_FOR_NOW": {
      return {
        ...state,
        screen: "WELCOME"
      };
    }

    case "TICK": {
      const rem = Math.max(0, state.remainingSeconds - 1);
      return {
        ...state,
        remainingSeconds: rem,
        timeUp: rem <= 0
      };
    }

    case "USE_HINT": {
      if (!state.current) return state;
      return {
        ...state,
        current: {
          ...state.current,
          hintsUsed: 1
        }
      };
    }

    case "SUBMIT_ANSWER": {
      const { result, decision, nextQuestion, isPrereqCheck, specKey } = action.payload;
      const currentQ = state.current.question;

      const newResults = [
        ...state.results,
        {
          id: currentQ.id,
          concept: currentQ.concept,
          verdict: result.verdict,
          tag: result.tag,
          hintsUsed: state.current.hintsUsed || 0,
          isPrereqCheck: Boolean(isPrereqCheck)
        }
      ];

      if (isPrereqCheck) {
        return {
          ...state,
          results: newResults,
          feedback: {
            ...result,
            decision: null
          },
          nextQuestion: nextQuestion || state.nextQuestion,
          screen: "FEEDBACK"
        };
      }

      const newAnsweredCount = state.answeredCount + 1;
      const newSeenIds = [...state.seenIds, currentQ.id];
      const isCorrect = result.verdict === "correct";
      const newMasteredIds = (isCorrect && !isPrereqCheck && currentQ.id)
        ? Array.from(new Set([...(state.masteredQuestionIds || []), currentQ.id]))
        : (state.masteredQuestionIds || []);

      const newGeneratedKeys = currentQ.source === "generated" && specKey
        ? [...state.generatedKeys, specKey]
        : state.generatedKeys;
      const newGeneratedCount = nextQuestion && nextQuestion.source === "generated"
        ? state.generatedCount + 1
        : state.generatedCount;

      let nextDiag = state.diagnosticQueue;
      if (nextDiag && nextDiag[0] === currentQ.id) {
        nextDiag = nextDiag.slice(1);
      }

      return {
        ...state,
        answeredCount: newAnsweredCount,
        seenIds: newSeenIds,
        masteredQuestionIds: newMasteredIds,
        lastFormat: currentQ.format,
        diagnosticQueue: nextDiag,
        generatedKeys: newGeneratedKeys,
        generatedCount: newGeneratedCount,
        level: decision.next.level,
        correctStreak: decision.next.correctStreak,
        wrongStreak: decision.next.wrongStreak,
        recentNoHintCorrect: decision.next.recentNoHintCorrect,
        feedback: {
          ...result,
          decision
        },
        nextQuestion: nextQuestion || null,
        results: newResults,
        screen: "FEEDBACK"
      };
    }

    case "CONTINUE_FROM_FEEDBACK": {
      const feedback = state.feedback;
      const decision = feedback ? feedback.decision : null;

      if (decision && decision.ended) {
        return {
          ...state,
          screen: "SUMMARY"
        };
      }

      // Handle Prerequisite check flow
      if (state.prereq && state.prereq.active) {
        if (state.prereq.step === 1) {
          return {
            ...state,
            prereq: { ...state.prereq, step: 2 },
            current: {
              question: PREREQ_QUESTIONS[1],
              startedAtMs: Date.now(),
              hintsUsed: 0,
              isPrereqCheck: true
            },
            screen: "QUESTION"
          };
        } else if (state.prereq.step === 2) {
          return {
            ...state,
            prereq: { active: false, step: 0 },
            current: {
              question: state.nextQuestion,
              startedAtMs: Date.now(),
              hintsUsed: 0,
              isPrereqCheck: false
            },
            screen: "QUESTION"
          };
        }
      }

      // Check if decision specifies a lesson
      if (decision && decision.lessonId) {
        const lid = decision.lessonId;
        let lessonData = LESSONS[lid];
        if (lid === "ALT_WALKTHROUGH") {
          const prevQ = state.current ? state.current.question : null;
          const wt = prevQ && prevQ.walkthrough ? prevQ.walkthrough : ["Trace the code step by step."];
          const blocks = [
            { type: "p", text: "Here is the question again, one step at a time." }
          ];
          if (prevQ && prevQ.code) {
            blocks.push({ type: "code", text: prevQ.code });
          }
          wt.forEach((stepText, idx) => {
            blocks.push({ type: "p", text: `Step ${idx + 1}: ${stepText}` });
          });
          lessonData = {
            ...LESSONS.ALT_WALKTHROUGH,
            blocks
          };
        }

        const isPre = decision.type === "PREREQUISITE";
        return {
          ...state,
          lesson: lessonData,
          prereq: { active: isPre, step: 0 },
          screen: "LESSON"
        };
      }

      // Default: proceed to nextQuestion
      return {
        ...state,
        current: {
          question: state.nextQuestion,
          startedAtMs: Date.now(),
          hintsUsed: 0,
          isPrereqCheck: false
        },
        screen: "QUESTION"
      };
    }

    case "FINISH_LESSON": {
      if (state.prereq && state.prereq.active && state.prereq.step === 0) {
        return {
          ...state,
          prereq: { ...state.prereq, step: 1 },
          current: {
            question: PREREQ_QUESTIONS[0],
            startedAtMs: Date.now(),
            hintsUsed: 0,
            isPrereqCheck: true
          },
          screen: "QUESTION"
        };
      }

      return {
        ...state,
        current: {
          question: state.nextQuestion,
          startedAtMs: Date.now(),
          hintsUsed: 0,
          isPrereqCheck: false
        },
        screen: "QUESTION"
      };
    }

    case "GO_SUMMARY": {
      return {
        ...state,
        screen: "SUMMARY"
      };
    }

    case "PRACTISE_AGAIN": {
      const normalResults = (state.results || []).filter(r => !r.isPrereqCheck);
      const correctResults = normalResults.filter(r => r.verdict === "correct");
      const total = normalResults.length;
      const correctCount = correctResults.length;
      const accuracy = total > 0 ? (correctCount / total) : 0;

      // Collect all mastered question IDs across sessions
      const newlyMastered = correctResults.map(r => r.id).filter(Boolean);
      const mergedMastered = Array.from(new Set([...(state.masteredQuestionIds || []), ...newlyMastered]));
      const mergedLifetime = Array.from(new Set([...(state.lifetimeSeenIds || []), ...state.seenIds]));

      // Adaptive cross-session level progression
      const currentStartingLevel = state.startingLevel || 1;
      let nextStartingLevel = currentStartingLevel;
      const currentFinalLevel = state.level || 1;

      // Learner performed well: >= 60% accuracy on at least 2 questions,
      // or reached a higher level with positive accuracy
      const performedGood = total >= 2 && (accuracy >= 0.60 || (currentFinalLevel > currentStartingLevel && accuracy >= 0.50));
      const struggled = total >= 3 && accuracy < 0.40;

      if (performedGood) {
        if (currentStartingLevel === 1) {
          nextStartingLevel = 2;
        } else if (currentStartingLevel === 2) {
          nextStartingLevel = 3;
        } else {
          nextStartingLevel = 3;
        }
      } else if (struggled) {
        nextStartingLevel = Math.max(1, currentStartingLevel - 1);
      }

      const nextSessionCount = (state.sessionCount || 0) + 1;

      // Save persistent learner profile
      saveProfile({
        startingLevel: nextStartingLevel,
        masteredQuestionIds: mergedMastered,
        lifetimeSeenIds: mergedLifetime,
        sessionCount: nextSessionCount
      });

      return {
        ...initialState,
        level: nextStartingLevel,
        startingLevel: nextStartingLevel,
        masteredQuestionIds: mergedMastered,
        lifetimeSeenIds: mergedLifetime,
        sessionCount: nextSessionCount,
        screen: "WELCOME"
      };
    }

    default:
      return state;
  }
}
