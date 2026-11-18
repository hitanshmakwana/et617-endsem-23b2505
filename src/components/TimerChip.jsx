import React from "react";

export default function TimerChip({ remainingSeconds, timeUp }) {
  if (timeUp || remainingSeconds <= 0) {
    return <span className="timer-chip">⏱ Time is up</span>;
  }
  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return <span className="timer-chip">⏱ {m}:{ss} left</span>;
}
