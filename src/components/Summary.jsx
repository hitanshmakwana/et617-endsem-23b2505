import React from "react";

export default function Summary({
  answeredCount,
  skillsSummary,
  nextFocus,
  onPractiseAgain,
  onGoAbout
}) {
  const getChip = (status) => {
    switch (status) {
      case "GOT_IT":
        return <span className="status-chip got-it">✔ Got it</span>;
      case "GETTING_THERE":
        return <span className="status-chip getting-there">↗ Getting there</span>;
      case "REVISIT":
        return <span className="status-chip revisit">↺ Let's revisit</span>;
      default:
        return <span className="status-chip not-practised">○ Not practised yet</span>;
    }
  };

  return (
    <div className="card-box" style={{ textAlign: "center", padding: "28px 20px" }}>
      <h2 style={{ fontSize: "28px", color: "var(--primary-dark)", marginBottom: "8px" }}>
        Nice work today.
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "17px", marginBottom: "24px" }}>
        You practised {answeredCount} questions. Here is where each skill is now.
      </p>

      <div style={{ textAlign: "left", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {skillsSummary.map((s) => (
          <div
            key={s.concept}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 14px",
              background: "#EDF2F7",
              borderRadius: "10px"
            }}
          >
            <span style={{ fontWeight: "600", fontSize: "16px" }}>{s.label}</span>
            {getChip(s.status)}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--blue-bg)",
          border: "1px solid #BEE3F8",
          borderRadius: "10px",
          padding: "14px 16px",
          textAlign: "left",
          marginBottom: "28px",
          color: "var(--primary-dark)"
        }}
      >
        <p style={{ margin: "0 0 6px 0" }}>
          <strong>Next time, start with:</strong> {nextFocus}
        </p>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
          🌱 Your progress has been saved. Next test will adapt to your current mastery.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button className="btn btn-primary" onClick={onPractiseAgain}>
          Practise again
        </button>
        <button className="btn btn-secondary" onClick={onGoAbout}>
          About this app
        </button>
      </div>
    </div>
  );
}
