import React from "react";

export default function Order({ lines, placedIds, onPlace, onRemove }) {
  const unplaced = lines.filter((l) => !placedIds.includes(l.id));
  const placed = placedIds.map((id) => lines.find((l) => l.id === id)).filter(Boolean);

  return (
    <div className="order-zone">
      <div>
        <div className="zone-label">Lines to place (tap one):</div>
        <div className="order-box" style={{ marginBottom: "16px" }}>
          {unplaced.length === 0 ? (
            <span style={{ fontSize: "14px", color: "var(--muted)", fontStyle: "italic", padding: "8px" }}>
              All lines placed below
            </span>
          ) : (
            unplaced.map((l) => (
              <div
                key={l.id}
                className="order-item"
                onClick={() => onPlace(l.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPlace(l.id)}
              >
                {l.text}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="zone-label">Your program (tap a line to take it back):</div>
        <div className="order-box" style={{ background: "#FFFFFF", borderStyle: "solid" }}>
          {placed.length === 0 ? (
            <span style={{ fontSize: "14px", color: "var(--muted)", fontStyle: "italic", padding: "8px" }}>
              Tap lines above to build your program here
            </span>
          ) : (
            placed.map((l) => (
              <div
                key={l.id}
                className="order-item"
                onClick={() => onRemove(l.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onRemove(l.id)}
              >
                {l.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
