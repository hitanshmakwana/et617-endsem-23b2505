import React from "react";
import { ROLL_NO, CARD, STORAGE_LOG_KEY } from "../config.js";

export default function About({ onBack }) {
  const downloadLog = () => {
    try {
      const raw = localStorage.getItem(STORAGE_LOG_KEY) || "[]";
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "loop-coach-log.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Could not download log.");
    }
  };

  return (
    <div className="card-box">
      <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "var(--primary-dark)" }}>About this app</h2>

      <section style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-dark)", marginBottom: "6px" }}>Who this is for</h3>
        <p style={{ fontSize: "16px" }}>
          Riya, 15, Class 10. She is repeating the loops topic after failing it once. She feels anxious, so Loop Coach has no scores and no red marks.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-dark)", marginBottom: "6px" }}>Exam card</h3>
        <p style={{ fontSize: "16px" }}>
          Problem P4 · Topic T10 · Learner L5 · Constraint C4 · Roll No {ROLL_NO}
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-dark)", marginBottom: "6px" }}>How the tutor decides</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", marginTop: "8px" }}>
          <thead>
            <tr style={{ background: "#EDF2F7", textAlign: "left" }}>
              <th style={{ padding: "8px", border: "1px solid var(--border)" }}>Situation</th>
              <th style={{ padding: "8px", border: "1px solid var(--border)" }}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}>2 correct in a row without hints</td>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}><strong>HARDER</strong> (level + 1)</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}>1st wrong answer (misconception M1/M2)</td>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}><strong>ALTERNATIVE</strong> explanation lesson</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}>2nd wrong answer in a row</td>
              <td style={{ padding: "8px", border: "1px solid var(--border)" }}><strong>PREREQUISITE</strong> check & step back</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-dark)", marginBottom: "6px" }}>How AI is used</h3>
        <p style={{ fontSize: "16px" }}>
          1) An AI helper reads written explanations and suggests a kind hint. 2) An AI helper suggests settings for new practice questions. Our own code always checks the AI output and always works out the right answers itself. If the AI is not available, built-in rules are used.
        </p>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-dark)", marginBottom: "6px" }}>Built with</h3>
        <p style={{ fontSize: "16px" }}>
          React, Vite. Hosted on Vercel.
        </p>
      </section>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "space-between" }}>
        <button className="btn btn-secondary" onClick={downloadLog}>
          Download my practice log (JSON)
        </button>
        <button className="btn btn-primary" onClick={onBack} style={{ width: "auto" }}>
          Back
        </button>
      </div>
    </div>
  );
}
