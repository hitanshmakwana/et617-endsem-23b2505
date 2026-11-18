import React from "react";

export default function Predict({ value, onChange, onSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <label style={{ display: "block", fontSize: "16px", color: "var(--muted)", marginBottom: "6px" }}>
        Type what is printed. Put a space between items.
      </label>
      <input
        type="text"
        className="predict-input"
        placeholder="e.g. 7 8 9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}
