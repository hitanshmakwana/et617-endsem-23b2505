import React from "react";
import TimerChip from "./TimerChip.jsx";
import CodeBlock from "./CodeBlock.jsx";

export default function Lesson({
  lesson,
  remainingSeconds,
  timeUp,
  answeredCount,
  onFinishLesson,
  onStopForNow
}) {
  if (!lesson) return null;

  return (
    <div className="card-box">
      <div className="top-bar">
        <TimerChip remainingSeconds={remainingSeconds} timeUp={timeUp} />
        <div className="progress-text">Question {answeredCount} of 8</div>
        <button className="btn-stop" onClick={onStopForNow}>
          Stop for now
        </button>
      </div>

      {timeUp && (
        <div className="time-up-banner">
          10 minutes are up. Let's finish this question, then we'll wrap up.
        </div>
      )}

      <h2 style={{ fontSize: "22px", color: "var(--primary-dark)", marginBottom: "16px" }}>
        {lesson.title}
      </h2>

      <div style={{ marginBottom: "24px" }}>
        {lesson.blocks && lesson.blocks.map((block, idx) => {
          if (block.type === "p") {
            return (
              <p key={idx} style={{ margin: "10px 0", fontSize: "17px", lineHeight: 1.5 }}>
                {block.text}
              </p>
            );
          }
          if (block.type === "code") {
            return <CodeBlock key={idx} code={block.text} />;
          }
          if (block.type === "tip") {
            return (
              <div key={idx} className="hint-box" style={{ background: "var(--blue-bg)", borderColor: "#BEE3F8", color: "var(--primary-dark)" }}>
                💡 <strong>Tip:</strong> {block.text}
              </div>
            );
          }
          if (block.type === "table") {
            return (
              <table key={idx} style={{ width: "100%", borderCollapse: "collapse", margin: "14px 0", fontSize: "16px" }}>
                <thead>
                  <tr style={{ background: "#EDF2F7", textAlign: "left" }}>
                    {block.head.map((h, i) => (
                      <th key={i} style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "8px 10px", border: "1px solid var(--border)" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          if (block.type === "annotated") {
            return (
              <div key={idx} style={{ margin: "14px 0" }}>
                {block.lines.map((line, i) => (
                  <div key={i} className={`annotated-line ${line.mark}`}>
                    <span>{line.text}</span>
                    <span className="annotated-note">{line.note}</span>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>

      <button className="btn btn-primary" onClick={onFinishLesson}>
        {lesson.buttonLabel || "Continue"}
      </button>
    </div>
  );
}
