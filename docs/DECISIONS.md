# Architectural & Pedagogical Design Decisions — Loop Coach

> **Card:** `P4-T10-L5-C4` · **Roll No:** `23b2505`  
> **Topic:** Loops in Python (`for` with `range()`)  
> **Learner:** Anxious repeat learner (L5) · **Constraint:** 10-minute sessions with stop and resume (C4)

This document records the architectural and pedagogical decisions made for **Loop Coach**, detailing the chosen design, the driving rationale based on learner persona or constraint, and rejected alternatives.

---

### D-01: Zero Red Color and No Crosses (❌/✗) Anywhere in the App
- **Decision:** Use an amber/warm orange palette (`#FFFAF0` background, `#DD6B20` border, `#9C4221` text) with a lightbulb icon (`💡 Let's look at this together`) for wrong answers. Never use red text or cross marks.
- **Reason (Persona L5):** Riya has already failed her loops test once and suffers from high anxiety and low self-efficacy. Red marks trigger shame, anxiety, and task abandonment. Re-framing errors as opportunities to examine thinking maintains cognitive engagement without affective distress.
- **Alternative Rejected:** Standard educational test UI with red crossmarks (`❌ Incorrect`). Rejected because it reinforces the learner's self-perception of failure.

---

### D-02: No Percentage Scores or Marks During or After the Session
- **Decision:** The session is completely free of numerical scores, percentages, and fractions (e.g. "5/8 correct"). The final summary screen presents competency badges (`✔ Got it`, `↗ Getting there`, `↺ Let's revisit`) and a recommended next focus topic.
- **Reason (Persona L5):** Numerical scores evoke formal exam pressure and invite demotivating self-evaluation. Formative learning for anxious repeat students thrives on mastery-oriented feedback rather than evaluative scoring.
- **Alternative Rejected:** Showing a final score (e.g., "Score: 75%"). Rejected because anxious students fixate on the deficit rather than the concepts mastered.

---

### D-03: Two-Wrong-in-a-Row Decision Rule for Prerequisite Instruction
- **Decision:** The first wrong answer triggers an **Alternative Explanation** (re-representation of the specific misconception M1 or M2). Only a second consecutive wrong answer (`wrongStreak >= 2`) triggers **Prerequisite Instruction** (`PRE1` variable update basics + warm-up checks) and lowers the difficulty level.
- **Reason (P4 & L5):** A single mistake is often a minor slip or an unfamiliar question format. Intervening immediately with remedial prerequisites on the first error causes premature frustration and demotivates the student. Requiring two consecutive failures accurately identifies a fundamental gap before stepping back.
- **Alternative Rejected:** Dropping back to prerequisites on every single wrong answer. Rejected because it disrupts the flow and condescends to the learner.

---

### D-04: AI Never Computes Code Outputs or Student Answers
- **Decision:** Generative AI is strictly restricted to proposing question parameters (`{ start, stop, step }` or `{ n, word, after }`) and offering warm phrasing suggestions for written explanations. All code executions, range outputs, and misconception answers (M1, M2) are computed deterministically in JavaScript.
- **Reason (Domain Soundness & Safety):** Large language models frequently make off-by-one errors when simulating Python loops or calculating ranges. In an assessment tutor, hallucinated ground truth would irreparably damage student trust and reinforce misconceptions.
- **Alternative Rejected:** Asking the LLM to generate the entire question text, code snippet, and correct answer in one prompt. Rejected due to hallucination risk and unpredictable formatting.

---

### D-05: 100% Offline Local Parameter Generator Fallback
- **Decision:** If the Gemini API call to `/api/generate` times out (6,000ms), errors, or lacks network access, `localSpec` automatically produces valid parameters from defined level grids to instantiate the exact same parametric question templates.
- **Reason (Robustness & Reliability):** School networks, home Wi-Fi, and serverless free tiers can be unstable. An educational tutor must never hang, freeze, or lock the user out due to an API outage.
- **Alternative Rejected:** Displaying an error dialog ("AI service unavailable, please retry"). Rejected because it halts the learning session and elevates student anxiety.

---

### D-06: Timer Counts Active Learning Time Only (Constraint C4)
- **Decision:** The 600-second session timer counts down only when the learner is on active interaction screens (`QUESTION`, `FEEDBACK`, `LESSON`) and when `document.visibilityState === "visible"`. Time spent on `WELCOME` or `ABOUT`, or when switching away from the browser tab, is completely frozen.
- **Reason (Constraint C4 & L5):** Riya is using a shared family laptop or her mother's phone in the evening with frequent domestic interruptions. Punishing her for stepping away or taking a breather defeats the 10-minute focused practice goal.
- **Alternative Rejected:** Wall-clock timer that expires 10 minutes after clicking Start regardless of pauses or background state. Rejected because it induces panic and punishes interruptions.

---

### D-07: Uninterrupted Time-Up Completion
- **Decision:** When the 10-minute timer reaches 0, the tutor displays a gentle banner: *"10 minutes are up. Let's finish this question, then we'll wrap up."* The learner is permitted to complete and submit their current question normally before proceeding to the summary.
- **Reason (Persona L5):** Cutting off a student mid-sentence or mid-question when a timer buzzer rings spikes anxiety and leaves unresolved cognitive tension.
- **Alternative Rejected:** Hard cutoff modal that blocks interaction the moment the timer hits 00:00. Rejected because it feels abrupt and punitive.

---

### D-08: Complete State Persistence & Seamless Resume (Constraint C4)
- **Decision:** Every interaction state (active question, elapsed time, streaks, results, hint status) is synchronized to browser `localStorage`. Tapping "Stop for now" returns to Welcome, where a prominent "Continue where I stopped" button displays the exact remaining time and question index.
- **Reason (Constraint C4):** C4 explicitly requires that *"the learner can stop and resume where they left off"*. This guarantees zero loss of progress across accidental reloads or device sharing.
- **Alternative Rejected:** In-memory state only (lost on page reload). Rejected as a direct violation of constraint C4.

---

### D-09: Four Diverse Question Formats (Beyond Multiple Choice)
- **Decision:** Loop Coach implements four distinct, interactive formats: Multiple Choice (`MCQ`), Output Prediction (`PREDICT`), Indentation-Preserving Program Ordering (`ORDER`), and Free-Text Explanation (`EXPLAIN`).
- **Reason (Problem P4):** P4 mandates supporting at least three question formats and evaluating learner explanations. Offering multiple representations prevents rote guessing and accurately assesses Bloom's levels (Understand, Apply, Analyze).
- **Alternative Rejected:** Pure MCQ with distractors. Rejected because it encourages superficial guessing and cannot evaluate deep conceptual explanations.

---

### D-10: Two Initial Diagnostic Questions
- **Decision:** The session always initiates with a two-question diagnostic pair (`Q03` testing range start/stop misconception M1, and `Q04` testing indentation misconception M2) before open branching.
- **Reason (P4 & T10):** Early diagnostic questions immediately map the student's conceptual landscape on both core failure points, allowing subsequent questions and lessons to adapt precisely to the learner's actual needs.
- **Alternative Rejected:** Randomly shuffling the question bank from the first question. Rejected because it delays misconception detection and adaptive intervention.

---

### D-11: Hint Usage Prevents Automatic Progression to HARDER
- **Decision:** Advancing to a harder question requires two consecutive correct answers with **zero hints** used on both (`recentNoHintCorrect >= 2`). Answering correctly with a hint used still counts as correct, but resets `recentNoHintCorrect` to 0.
- **Reason (Adaptive Rigor):** A student who required a hint has not yet achieved unassisted automaticity. Pushing them to a harder level prematurely causes difficulty spikes and triggers anxiety.
- **Alternative Rejected:** Leveling up based on raw correct count alone regardless of hint usage. Rejected because assisted answers do not demonstrate independent mastery.

---

### D-12: Zero Heavy Frontend Dependencies
- **Decision:** Use vanilla React 18, Vite, and custom CSS without external UI component libraries, state management libraries (Redux/Zustand), CSS frameworks (Tailwind/Bootstrap), or routers.
- **Reason (Performance, Reliability, Explainability):** Minimizes build fragility, guarantees fast loading on low-end mobile devices (360px), and ensures every single line of code and styling can be clearly explained during project evaluation.
- **Alternative Rejected:** Next.js or heavy component frameworks like Material UI / Chakra UI. Rejected due to bundle bloat, styling conflicts, and black-box complexity.
