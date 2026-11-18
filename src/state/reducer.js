import { QUESTIONS, PREREQ_QUESTIONS } from "../data/questions.js";
import { LESSONS } from "../data/lessons.js";
import { SESSION_SECONDS } from "../config.js";

export const initialState = {
  version: 1,
  screen: "WELCOME",
  prevScreen: "WELCOME",
  remainingSeconds: SESSION_SECONDS,
  timeUp: false,
  level: 1,
  correctStreak: 0,
  wrongStreak: 0,
  recentNoHintCorrect: 0,
  answeredCount: 0,
  generatedCount: 0,
  seenIds: [],
  lifetimeSeenIds: [],
  diagnosticQueue: ["Q04"],
  lastFormat: null,
  generatedKeys: [],
  current: null,
  feedback: null,
  lesson: null,
  prereq: { active: false, step: 0 },
  nextQuestion: null,
  results: []
};

export function reducer(state, action) {
  switch (action.type) {
    case "START_SESSION": {
      const lifetime = state.lifetimeSeenIds || [];

      // Select diagnostic 1 (level 1 range-values): Q03, Q01, Q02
      const d1Candidates = ["Q03", "Q01", "Q02"];
      const d1Id = d1Candidates.find(id => !lifetime.includes(id)) || d1Candidates[Math.floor(Math.random() * d1Candidates.length)];
      const firstQ = QUESTIONS.find(q => q.id === d1Id) || QUESTIONS[0];

      // Select diagnostic 2 (level 1 indent-repeat): Q04, Q13
      const d2Candidates = ["Q04", "Q13"];
      const d2Id = d2Candidates.find(id => !lifetime.includes(id)) || d2Candidates[Math.floor(Math.random() * d2Candidates.length)];

      return {
        ...state,
        screen: "QUESTION",
        remainingSeconds: state.remainingSeconds || SESSION_SECONDS,
        timeUp: false,
        diagnosticQueue: [d2Id],
        current: {
          question: firstQ,
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
        lifetimeSeenIds: state.lifetimeSeenIds || [],
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
      const mergedLifetime = Array.from(new Set([...(state.lifetimeSeenIds || []), ...state.seenIds]));
      return {
        ...initialState,
        lifetimeSeenIds: mergedLifetime,
        screen: "WELCOME"
      };
    }

    default:
      return state;
  }
}
