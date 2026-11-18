import React from "react";
import { APP_NAME } from "../config.js";

export default function Welcome({ savedSession, onStart, onResume, onStartFresh, onGoAbout }) {
  const hasSaved = Boolean(
    savedSession &&
    (savedSession.screen === "QUESTION" || savedSession.screen === "FEEDBACK" || savedSession.screen === "LESSON")
  );

  let formattedTime = "";
  if (hasSaved) {
    const rem = savedSession.remainingSeconds ?? 600;
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    formattedTime = `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  return (
    <div className="card-box" style={{ textAlign: "center", padding: "32px 20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px", color: "var(--primary-dark)" }}>{APP_NAME}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "19px" }}>
        Practise Python loops in 10 quiet minutes. No marks. No pressure.
      </p>

      {hasSaved ? (
        <div style={{ marginBottom: "24px" }}>
          <button className="btn btn-primary" onClick={onResume} style={{ marginBottom: "12px" }}>
            Continue where I stopped
          </button>
          <div style={{ fontSize: "15px", color: "var(--muted)", marginBottom: "12px" }}>
            Question {(savedSession.answeredCount || 0) + 1} of 8 · {formattedTime} left
          </div>
          <div>
            <button className="btn-text" onClick={onStartFresh}>
              Start fresh
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "28px" }}>
          <button className="btn btn-primary" onClick={onStart}>
            Start (10 minutes)
          </button>
        </div>
      )}

      <div style={{ textAlign: "left", background: "#EDF2F7", padding: "16px", borderRadius: "10px", margin: "24px 0" }}>
        <p style={{ margin: "6px 0", fontSize: "16px" }}>🌱 <strong>Mistakes are normal here.</strong> We learn from them.</p>
        <p style={{ margin: "6px 0", fontSize: "16px" }}>⏸ <strong>You can stop any time</strong> and come back.</p>
        <p style={{ margin: "6px 0", fontSize: "16px" }}>🔒 <strong>Your answers stay</strong> on this device.</p>
      </div>

      <div>
        <button className="btn-text" onClick={onGoAbout}>
          About this app
        </button>
      </div>
    </div>
  );
}
