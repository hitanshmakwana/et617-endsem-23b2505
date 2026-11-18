import React, { useState } from "react";
import CodeBlock from "./CodeBlock.jsx";

export default function Intro({ onStartSession }) {
  const [step, setStep] = useState(0);

  // Dynamic state for Card 1
  const [c1Times, setC1Times] = useState(3);
  const [c1Running, setC1Running] = useState(false);
  const [c1Output, setC1Output] = useState([]);

  // Dynamic state for Card 2
  const [c2Stop, setC2Stop] = useState(3);
  const [c2Running, setC2Running] = useState(false);
  const [c2Rounds, setC2Rounds] = useState([]);

  // Dynamic state for Card 3
  const [c3Running, setC3Running] = useState(false);
  const [c3Executed, setC3Executed] = useState(false);

  const runCard1 = () => {
    setC1Running(true);
    setC1Output([]);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setC1Output(prev => [...prev, `Round ${count}: Hi`]);
      if (count >= c1Times) {
        clearInterval(interval);
        setC1Running(false);
      }
    }, 350);
  };

  const runCard2 = () => {
    setC2Running(true);
    setC2Rounds([]);
    let i = 0;
    const interval = setInterval(() => {
      setC2Rounds(prev => [...prev, { round: i + 1, val: i }]);
      i++;
      if (i >= c2Stop) {
        clearInterval(interval);
        setC2Running(false);
      }
    }, 350);
  };

  const runCard3 = () => {
    setC3Running(true);
    setC3Executed(true);
    setTimeout(() => {
      setC3Running(false);
    }, 600);
  };

  return (
    <div className="card-box">
      <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px" }}>
        Concept {step + 1} of 3
      </div>

      {step === 0 && (
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "14px", color: "var(--primary-dark)" }}>
            A loop repeats lines for us
          </h2>
          <p style={{ marginBottom: "12px" }}>
            A loop runs the same lines again and again. Let's see one.
          </p>
          <CodeBlock code={`for i in range(${c1Times}):\n    print("Hi")`} />
          <p style={{ marginTop: "12px", marginBottom: "16px" }}>
            This prints Hi {c1Times} times.
          </p>

          <div style={{ background: "var(--blue-bg)", padding: "14px", borderRadius: "10px", margin: "16px 0", border: "1px solid #BEE3F8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--primary-dark)" }}>
                Try it dynamically:
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>range(</span>
                <button
                  type="button"
                  className="btn-stop"
                  style={{ padding: "2px 10px", minHeight: "32px", fontWeight: "bold" }}
                  onClick={() => { setC1Times(n => Math.max(1, n - 1)); setC1Output([]); }}
                  disabled={c1Running || c1Times <= 1}
                >
                  -
                </button>
                <strong style={{ fontSize: "16px", minWidth: "16px", textAlign: "center" }}>{c1Times}</strong>
                <button
                  type="button"
                  className="btn-stop"
                  style={{ padding: "2px 10px", minHeight: "32px", fontWeight: "bold" }}
                  onClick={() => { setC1Times(n => Math.min(6, n + 1)); setC1Output([]); }}
                  disabled={c1Running || c1Times >= 6}
                >
                  +
                </button>
                <span style={{ fontSize: "14px" }}>)</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", minHeight: "42px", fontSize: "15px", padding: "8px" }}
              onClick={runCard1}
              disabled={c1Running}
            >
              {c1Running ? "Running loop…" : "▶ Run this loop step-by-step"}
            </button>

            {c1Output.length > 0 && (
              <div style={{ marginTop: "12px", background: "#FFFFFF", padding: "10px", borderRadius: "6px", fontFamily: "ui-monospace, monospace", fontSize: "15px" }}>
                {c1Output.map((line, idx) => (
                  <div key={idx} style={{ color: "var(--primary-dark)", padding: "2px 0" }}>
                    ✓ {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "14px", color: "var(--primary-dark)" }}>
            range(3) gives 3 numbers
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Here i takes one number in every round. Let's see which numbers.
          </p>
          <CodeBlock code={`for i in range(${c2Stop}):\n    print(i)`} />
          <p style={{ marginTop: "12px", marginBottom: "16px" }}>
            This prints {c2Stop === 3 ? "0, then 1, then 2." : `0 up to ${c2Stop - 1}.`}
          </p>

          <div style={{ background: "var(--blue-bg)", padding: "14px", borderRadius: "10px", margin: "16px 0", border: "1px solid #BEE3F8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--primary-dark)" }}>
                Watch where counting starts:
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className="btn-stop"
                    style={{
                      padding: "4px 10px",
                      minHeight: "32px",
                      background: c2Stop === n ? "var(--primary)" : "#FFFFFF",
                      color: c2Stop === n ? "#FFFFFF" : "var(--text)"
                    }}
                    onClick={() => { setC2Stop(n); setC2Rounds([]); }}
                    disabled={c2Running}
                  >
                    range({n})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", minHeight: "42px", fontSize: "15px", padding: "8px" }}
              onClick={runCard2}
              disabled={c2Running}
            >
              {c2Running ? "Watching loop rounds…" : `▶ Step through range(${c2Stop})`}
            </button>

            {c2Rounds.length > 0 && (
              <div style={{ marginTop: "12px", background: "#FFFFFF", padding: "10px", borderRadius: "6px", fontSize: "15px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: "13px" }}>
                      <th style={{ padding: "4px" }}>Round</th>
                      <th style={{ padding: "4px" }}>i value</th>
                      <th style={{ padding: "4px" }}>Prints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c2Rounds.map(r => (
                      <tr key={r.round} style={{ borderBottom: "1px solid #EDF2F7", fontFamily: "ui-monospace, monospace" }}>
                        <td style={{ padding: "6px 4px" }}>Round {r.round}</td>
                        <td style={{ padding: "6px 4px", color: "var(--primary)" }}>i = {r.val}</td>
                        <td style={{ padding: "6px 4px", fontWeight: "bold" }}>{r.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: "13px", color: "var(--teal)", marginTop: "6px" }}>
                  💡 Starts at 0. Stops before {c2Stop}. Never reaches {c2Stop}!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "14px", color: "var(--primary-dark)" }}>
            Only indented lines repeat
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Lines pushed in with spaces are inside the loop. They repeat. A line that is not pushed in runs once, after the loop.
          </p>
          <CodeBlock code={'for i in range(2):\n    print("Tea")\nprint("Done")'} />
          <p style={{ marginTop: "12px", marginBottom: "16px" }}>
            This prints Tea, Tea, Done.
          </p>

          <div style={{ background: "var(--blue-bg)", padding: "14px", borderRadius: "10px", margin: "16px 0", border: "1px solid #BEE3F8" }}>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--primary-dark)", marginBottom: "8px" }}>
              Visualizing the indentation boundary:
            </div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "15px", marginBottom: "12px" }}>
              <div style={{ background: "var(--blue-bg)", padding: "4px 8px", borderRadius: "4px" }}>
                for i in range(2): <span style={{ fontSize: "12px", color: "var(--muted)" }}>(loop header)</span>
              </div>
              <div style={{ background: "var(--teal-bg)", padding: "4px 8px", borderRadius: "4px", margin: "3px 0", color: "var(--teal)" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;print("Tea") <span style={{ fontSize: "12px" }}>(indented: repeats 2 times)</span>
              </div>
              <div style={{ background: "var(--orange-bg)", padding: "4px 8px", borderRadius: "4px", color: "#C05621" }}>
                print("Done") <span style={{ fontSize: "12px" }}>(not indented: runs once at end)</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", minHeight: "42px", fontSize: "15px", padding: "8px" }}
              onClick={runCard3}
              disabled={c3Running}
            >
              {c3Running ? "Tracing line by line…" : "▶ Trace line execution"}
            </button>

            {c3Executed && (
              <div style={{ marginTop: "12px", background: "#FFFFFF", padding: "10px", borderRadius: "6px", fontFamily: "ui-monospace, monospace", fontSize: "15px" }}>
                <div style={{ color: "var(--teal)" }}>1. Round 1 inside loop: "Tea"</div>
                <div style={{ color: "var(--teal)" }}>2. Round 2 inside loop: "Tea"</div>
                <div style={{ color: "#C05621", fontWeight: "bold" }}>3. Loop ends. Now outside line runs: "Done"</div>
                <div style={{ marginTop: "6px", fontWeight: "bold", borderTop: "1px solid #EDF2F7", paddingTop: "4px" }}>
                  Output: Tea Tea Done
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", marginTop: "24px" }}>
        {step > 0 ? (
          <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
            Back
          </button>
        ) : <div />}
        {step === 2 ? (
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
