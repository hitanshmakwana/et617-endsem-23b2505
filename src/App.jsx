import React, { useReducer, useEffect, useState, useRef } from "react";
import { initialState, reducer } from "./state/reducer.js";
import { loadState, saveState, clearState } from "./state/storage.js";
import { evaluateObjective, evaluateExplainRules, evaluateExplainFallback, evaluateExplainFromAi } from "./lib/evaluate.js";
import { decide } from "./lib/decide.js";
import { pickNext } from "./lib/pickNext.js";
import { aiGrade, requestGeneratedQuestion } from "./lib/aiClient.js";
import { logEvent } from "./lib/log.js";
import { getSkillsSummary, getNextFocus } from "./lib/skills.js";
import { QUESTIONS, PREREQ_QUESTIONS } from "./data/questions.js";
import { MAX_GENERATED } from "./config.js";

import Footer from "./components/Footer.jsx";
import Welcome from "./components/Welcome.jsx";
import Intro from "./components/Intro.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import Feedback from "./components/Feedback.jsx";
import Lesson from "./components/Lesson.jsx";
import Summary from "./components/Summary.jsx";
import About from "./components/About.jsx";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [savedSession, setSavedSession] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const sessionStartRef = useRef(new Date().toISOString());

  // Load saved state once on mount
  useEffect(() => {
    const loaded = loadState();
    if (loaded && (loaded.screen === "QUESTION" || loaded.screen === "FEEDBACK" || loaded.screen === "LESSON")) {
      setSavedSession(loaded);
    }

    // Check debugTime query param (e.g., ?debugTime=3 for test scenarios)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dbg = urlParams.get("debugTime");
      if (dbg !== null) {
        const val = parseInt(dbg, 10);
        if (!isNaN(val)) {
          dispatch({ type: "TICK" }); // force tick
          // Note: timer will count down from this or user can test
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (state.screen === "QUESTION" || state.screen === "FEEDBACK" || state.screen === "LESSON") {
      saveState(state);
    } else if (state.screen === "SUMMARY") {
      clearState();
    }
  }, [state]);

  // 10-Minute Timer: ticks only during active learning and when page is visible
  useEffect(() => {
    const isActiveScreen = state.screen === "QUESTION" || state.screen === "FEEDBACK" || state.screen === "LESSON";
    if (!isActiveScreen) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        dispatch({ type: "TICK" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.screen]);

  // Handle Answer Submission
  const handleSubmitAnswer = async (question, answerInput) => {
    const isPrereq = Boolean(question.isPrereqCheck);
    const msSpent = Date.now() - (state.current?.startedAtMs || Date.now());
    let evaluationResult = null;

    if (question.format === "EXPLAIN") {
      const ruleCheck = evaluateExplainRules(question, answerInput);
      if (ruleCheck.decided) {
        evaluationResult = ruleCheck.result;
      } else {
        setIsChecking(true);
        const aiOut = await aiGrade(question, answerInput);
        setIsChecking(false);

        if (aiOut) {
          evaluationResult = evaluateExplainFromAi(question, answerInput, aiOut);
        } else {
          evaluationResult = evaluateExplainFallback(question, answerInput);
        }
      }
    } else {
      evaluationResult = evaluateObjective(question, answerInput);
    }

    // If prerequisite check question
    if (isPrereq) {
      logEvent({
        ts: new Date().toISOString(),
        sessionStart: sessionStartRef.current,
        qid: question.id,
        source: "bank",
        format: question.format,
        level: question.level,
        concept: question.concept,
        verdict: evaluationResult.verdict,
        tag: evaluationResult.tag,
        hintsUsed: state.current?.hintsUsed || 0,
        ms: msSpent,
        checkedBy: evaluationResult.checkedBy,
        decision: "PREREQ_CHECK",
        nextQid: question.id === "PRE_Q1" ? "PRE_Q2" : state.nextQuestion?.id
      });

      dispatch({
        type: "SUBMIT_ANSWER",
        payload: {
          result: evaluationResult,
          isPrereqCheck: true
        }
      });
      return;
    }

    // Normal scored question: compute adaptive decision
    const nextAnsweredCount = state.answeredCount + 1;
    const decision = decide(
      {
        level: state.level,
        correctStreak: state.correctStreak,
        wrongStreak: state.wrongStreak,
        recentNoHintCorrect: state.recentNoHintCorrect,
        answeredCount: nextAnsweredCount,
        remainingSeconds: state.remainingSeconds
      },
      evaluationResult,
      question
    );

    let nextQ = null;
    let specKey = null;

    if (decision.ended) {
      nextQ = null;
    } else {
      // Diagnostic queue check: if CONTINUE and diagnostic queue has items (e.g., Q04)
      const nextDiagId = state.diagnosticQueue && state.diagnosticQueue.find(id => id !== question.id && !state.seenIds.includes(id));
      if (decision.type === "CONTINUE" && nextDiagId) {
        nextQ = QUESTIONS.find(q => q.id === nextDiagId) || null;
      } else if (
        (decision.type === "HARDER" || decision.type === "ALTERNATIVE") &&
        state.generatedCount < MAX_GENERATED
      ) {
        setIsGenerating(true);
        try {
          const genResult = await requestGeneratedQuestion(state, decision.nextSpec);
          if (genResult && genResult.question) {
            nextQ = genResult.question;
            specKey = genResult.specKey;
          }
        } catch (e) {
          // fallback to pickNext below
        } finally {
          setIsGenerating(false);
        }
      }

      if (!nextQ) {
        nextQ = pickNext(
          {
            ...state,
            seenIds: [...state.seenIds, question.id],
            lastFormat: question.format
          },
          decision.nextSpec
        );
      }
    }

    logEvent({
      ts: new Date().toISOString(),
      sessionStart: sessionStartRef.current,
      qid: question.id,
      source: question.source || "bank",
      format: question.format,
      level: question.level,
      concept: question.concept,
      verdict: evaluationResult.verdict,
      tag: evaluationResult.tag,
      hintsUsed: state.current?.hintsUsed || 0,
      ms: msSpent,
      checkedBy: evaluationResult.checkedBy,
      decision: decision.type,
      nextQid: nextQ ? nextQ.id : "none"
    });

    dispatch({
      type: "SUBMIT_ANSWER",
      payload: {
        result: evaluationResult,
        decision,
        nextQuestion: nextQ,
        specKey,
        isPrereqCheck: false
      }
    });
  };

  const handleStopForNow = () => {
    logEvent({
      ts: new Date().toISOString(),
      event: "stop_for_now",
      remainingSeconds: state.remainingSeconds
    });
    setSavedSession(state);
    dispatch({ type: "STOP_FOR_NOW" });
  };

  const handleResume = () => {
    if (savedSession) {
      logEvent({
        ts: new Date().toISOString(),
        event: "resume",
        remainingSeconds: savedSession.remainingSeconds
      });
      dispatch({ type: "RESUME", payload: savedSession });
      setSavedSession(null);
    }
  };

  const handleStartFresh = () => {
    clearState();
    setSavedSession(null);
    sessionStartRef.current = new Date().toISOString();
    dispatch({ type: "START_FRESH" });
  };

  const handleStart = () => {
    sessionStartRef.current = new Date().toISOString();
    dispatch({ type: "START_FRESH" });
  };

  const skillsSummary = getSkillsSummary(state.results);
  const nextFocus = getNextFocus(skillsSummary);

  return (
    <div className="app-container">
      <main className="main-content">
        {state.screen === "WELCOME" && (
          <Welcome
            savedSession={savedSession}
            onStart={handleStart}
            onResume={handleResume}
            onStartFresh={handleStartFresh}
            onGoAbout={() => dispatch({ type: "GO_ABOUT" })}
          />
        )}

        {state.screen === "INTRO" && (
          <Intro onStartSession={() => dispatch({ type: "START_SESSION" })} />
        )}

        {state.screen === "QUESTION" && state.current && (
          <QuestionScreen
            key={state.current.question.id}
            question={state.current.question}
            remainingSeconds={state.remainingSeconds}
            timeUp={state.timeUp}
            answeredCount={state.answeredCount}
            hintsUsed={state.current.hintsUsed || 0}
            onUseHint={() => dispatch({ type: "USE_HINT" })}
            onSubmitAnswer={handleSubmitAnswer}
            onStopForNow={handleStopForNow}
            isChecking={isChecking}
          />
        )}

        {state.screen === "FEEDBACK" && (
          <Feedback
            feedback={state.feedback}
            question={state.current?.question}
            remainingSeconds={state.remainingSeconds}
            timeUp={state.timeUp}
            answeredCount={state.answeredCount}
            onContinue={() => dispatch({ type: "CONTINUE_FROM_FEEDBACK" })}
            onStopForNow={handleStopForNow}
            isGenerating={isGenerating}
          />
        )}

        {state.screen === "LESSON" && (
          <Lesson
            lesson={state.lesson}
            remainingSeconds={state.remainingSeconds}
            timeUp={state.timeUp}
            answeredCount={state.answeredCount}
            onFinishLesson={() => dispatch({ type: "FINISH_LESSON" })}
            onStopForNow={handleStopForNow}
          />
        )}

        {state.screen === "SUMMARY" && (
          <Summary
            answeredCount={state.answeredCount}
            skillsSummary={skillsSummary}
            nextFocus={nextFocus}
            onPractiseAgain={() => dispatch({ type: "PRACTISE_AGAIN" })}
            onGoAbout={() => dispatch({ type: "GO_ABOUT" })}
          />
        )}

        {state.screen === "ABOUT" && (
          <About onBack={() => dispatch({ type: "BACK_FROM_ABOUT" })} />
        )}
      </main>

      <Footer />
    </div>
  );
}
