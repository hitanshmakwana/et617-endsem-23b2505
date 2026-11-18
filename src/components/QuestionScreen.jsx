import React, { useState } from "react";
import TimerChip from "./TimerChip.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Mcq from "./Mcq.jsx";
import Predict from "./Predict.jsx";
import Order from "./Order.jsx";
import Explain from "./Explain.jsx";

export default function QuestionScreen({
  question,
  remainingSeconds,
  timeUp,
  answeredCount,
  hintsUsed,
  onUseHint,
  onSubmitAnswer,
  onStopForNow,
  isChecking
}) {
  const [mcqSelected, setMcqSelected] = useState(null);
  const [predictText, setPredictText] = useState("");
  const [orderPlaced, setOrderPlaced] = useState([]);
  const [explainText, setExplainText] = useState("");
  const [showHint, setShowHint] = useState(hintsUsed > 0);

  if (!question) {
    return <div className="card-box">Loading question...</div>;
  }

  const handleHintClick = () => {
    setShowHint(true);
    onUseHint();
  };

  const isAnswered = () => {
    if (question.format === "MCQ") return mcqSelected !== null;
    if (question.format === "PREDICT") return predictText.trim().length > 0;
    if (question.format === "ORDER") return orderPlaced.length === question.lines.length;
    if (question.format === "EXPLAIN") return explainText.trim().length > 0;
    return false;
  };

  const handleCheck = () => {
    if (!isAnswered() || isChecking) return;
    let answerInput;
    if (question.format === "MCQ") answerInput = mcqSelected;
    else if (question.format === "PREDICT") answerInput = predictText;
    else if (question.format === "ORDER") answerInput = orderPlaced;
    else if (question.format === "EXPLAIN") answerInput = explainText;

    onSubmitAnswer(question, answerInput);
  };

  return (
    <div className="card-box">
      <div className="top-bar">
        <TimerChip remainingSeconds={remainingSeconds} timeUp={timeUp} />
        <div className="progress-text">
          {question.isPrereqCheck ? "Warm-up check" : `Question ${answeredCount + 1} of 8`}
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

      {question.source === "generated" && (
        <div className="fresh-badge">✨ A fresh question made for you</div>
      )}

      <CodeBlock code={question.code} />

      <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "14px 0" }}>
        {question.prompt}
      </h2>

      {question.format === "MCQ" && (
        <Mcq
          options={question.options}
          selected={mcqSelected}
          onSelect={setMcqSelected}
        />
      )}

      {question.format === "PREDICT" && (
        <Predict
          value={predictText}
          onChange={setPredictText}
          onSubmit={handleCheck}
        />
      )}

      {question.format === "ORDER" && (
        <Order
          lines={question.lines}
          placedIds={orderPlaced}
          onPlace={(id) => setOrderPlaced((prev) => [...prev, id])}
          onRemove={(id) => setOrderPlaced((prev) => prev.filter((x) => x !== id))}
        />
      )}

      {question.format === "EXPLAIN" && (
        <Explain
          value={explainText}
          onChange={setExplainText}
          disabled={isChecking}
        />
      )}

      {showHint && question.hint && (
        <div className="hint-box">
          💡 <strong>Hint:</strong> {question.hint}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button
          className="btn btn-primary"
          disabled={!isAnswered() || isChecking}
          onClick={handleCheck}
          style={{ flex: 1 }}
        >
          {isChecking ? "Checking…" : "Check my answer"}
        </button>
        {!showHint && question.hint && (
          <button
            className="btn btn-secondary"
            onClick={handleHintClick}
            disabled={isChecking}
            type="button"
          >
            Hint
          </button>
        )}
      </div>
    </div>
  );
}
