import React from "react";

export default function Explain({ value, onChange, disabled }) {
  const currentLength = (value || "").length;

  return (
    <div style={{ margin: "20px 0" }}>
      <label style={{ display: "block", fontSize: "16px", color: "var(--muted)", marginBottom: "6px" }}>
        Write your explanation:
      </label>
      <textarea
        className="explain-textarea"
        rows={4}
        maxLength={300}
        placeholder="Write 1 or 2 short sentences"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="char-counter">{currentLength}/300</div>
    </div>
  );
}
