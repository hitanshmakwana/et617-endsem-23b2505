import React from "react";

export default function Mcq({ options, selected, onSelect }) {
  const letters = ["A", "B", "C", "D"];
  return (
    <div className="options-list">
      {options.map((opt, i) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={`option-btn ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="option-badge">
              {isSelected ? "✓" : letters[i] || opt.id.toUpperCase()}
            </span>
            <span>{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
