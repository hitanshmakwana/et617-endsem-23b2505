import React from "react";
import TimerChip from "./TimerChip.jsx";

export default function Feedback({
  feedback,
  question,
  remainingSeconds,
  timeUp,
  answeredCount,
  onContinue,
  onStopForNow,
  isGenerating
}) {
  if (!feedback || !question) return null;

  const isCorrect = feedback.verdict === "correct";
  const decision = feedback.decision;

  let btnLabel = "Next question";
  if (decision && decision.ended) {
    btnLabel = "See my summary";
  } else if (question.isPrereqCheck) {
    btnLabel = question.id === "PRE_Q1" ? "Next" : "Back to loops";
  } else if (decision) {
    if (decision.type === "HARDER" || decision.type === "CONTINUE") btnLabel = "Next question";
    else if (decision.type === "ALTERNATIVE") btnLabel = "Show me another way";
    else if (decision.type === "PREREQUISITE") btnLabel = "Take a small step back";
  }

  return (
    <div className="card-box">
      <div className="top-bar">
        <TimerChip remainingSeconds={remainingSeconds} timeUp={timeUp} />
        <div className="progress-text">
          {question.isPrereqCheck ? "Warm-up check" : `Question ${answeredCount} of 8`}
        </div>
        <button className="btn-stop" onClick={onStopForNow}>
          Stop for now
        </button>
      </div>

      {timeUp && (
        <div className="time-up-banner">
          10 minutes are up. Let's finish this question, then we'll wrap up.
        </div>
      )}

      {isCorrect ? (
        <div className="feedback-header-correct">✔ Got it!</div>
      ) : (
        <div className="feedback-header-wrong">💡 Let's look at this together</div>
      )}

      <div style={{ margin: "14px 0", fontSize: "16px" }}>
        <strong>Your answer:</strong>{" "}
        <span style={{ fontFamily: question.format === "ORDER" || question.format === "PREDICT" ? "ui-monospace, monospace" : "inherit" }}>
          {feedback.answerText}
        </span>
      </div>

      <div className={isCorrect ? "feedback-box-correct" : "feedback-box-wrong"}>
        <p style={{ margin: 0, fontSize: "17px", lineHeight: 1.5 }}>
          {feedback.feedbackText}
        </p>
      </div>

      {question.modelAnswer && (
        <div className="model-answer-box">
          <strong>A good answer:</strong> {question.modelAnswer}
        </div>
      )}

      {question.format === "EXPLAIN" && (
        <div style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0" }}>
          {feedback.checkedBy === "ai"
            ? "Checked with the AI helper"
            : "Checked with built-in rules (AI helper not available right now)"}
        </div>
      )}

      {decision && decision.reason && (
        <details className="why-next-details">
          <summary>Why this next?</summary>
          <p style={{ margin: "8px 0 0", color: "var(--text)" }}>{decision.reason}</p>
        </details>
      )}

      <button
        className="btn btn-primary"
        onClick={onContinue}
        disabled={isGenerating}
      >
        {isGenerating ? "Getting your next question…" : btnLabel}
      </button>
    </div>
  );
}
