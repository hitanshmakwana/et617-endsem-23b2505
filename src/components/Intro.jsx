import React, { useState } from "react";
import CodeBlock from "./CodeBlock.jsx";

const INTRO_CARDS = [
  {
    title: "A loop repeats lines for us",
    text1: "A loop runs the same lines again and again. Let's see one.",
    code: 'for i in range(3):\n    print("Hi")',
    text2: "This prints Hi three times."
  },
  {
    title: "range(3) gives 3 numbers",
    text1: "Here i takes one number in every round. Let's see which numbers.",
    code: "for i in range(3):\n    print(i)",
    text2: "This prints 0, then 1, then 2."
  },
  {
    title: "Only indented lines repeat",
    text1: "Lines pushed in with spaces are inside the loop. They repeat. A line that is not pushed in runs once, after the loop.",
    code: 'for i in range(2):\n    print("Tea")\nprint("Done")',
    text2: "This prints Tea, Tea, Done."
  }
];

export default function Intro({ onStartSession }) {
  const [step, setStep] = useState(0);
  const card = INTRO_CARDS[step];
  const isLast = step === INTRO_CARDS.length - 1;

  return (
    <div className="card-box">
      <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px" }}>
        Concept {step + 1} of 3
      </div>
      <h2 style={{ fontSize: "22px", marginBottom: "14px", color: "var(--primary-dark)" }}>
        {card.title}
      </h2>
      <p style={{ marginBottom: "12px" }}>{card.text1}</p>
      <CodeBlock code={card.code} />
      <p style={{ marginTop: "12px", marginBottom: "24px" }}>{card.text2}</p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
        {step > 0 ? (
          <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
            Back
          </button>
        ) : <div />}
        {isLast ? (
          <button className="btn btn-primary" onClick={onStartSession} style={{ width: "auto" }}>
            Let's try one
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} style={{ width: "auto" }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
