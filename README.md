# Loop Coach 🚀

> **Adaptive Practice Tutor for Python Loops**  
> Built for the ET 617 End-Semester Examination.  
> **Card:** `P4-T10-L5-C4` · **Roll No:** `23b2505`  
> **Live App:** [https://et617-endsem-23b2505.vercel.app](https://et617-endsem-23b2505.vercel.app)  
> **GitHub Repo:** `et617-endsem-23b2505`

---

## 🎯 What is Loop Coach?

**Loop Coach** is an intelligent, low-anxiety adaptive tutor designed specifically for **Riya (15, Class 10)**, a repeat learner who previously failed her loops exam and experiences high anxiety and low self-efficacy.

The tutor provides 10-minute focused practice sessions on Python `for` loops with `range()`, automatically diagnosing two deep misconceptions:
- **Misconception M1:** The belief that `range(n)` starts at 1 or includes `n`.
- **Misconception M2:** The belief that unindented lines following a `for` loop also repeat.

---

## 🧠 Core Features & Pedagogical Architecture

1. **Adaptive Decision Rule (P4 Design Challenge):**
   - **HARDER (level + 1):** Triggered when the learner gets 2 consecutive correct answers with zero hints on both.
   - **ALTERNATIVE EXPLANATION:** Triggered on the first incorrect answer. Diagnoses M1 or M2 and provides a multi-modal mini-lesson (`ALT_M1` ground-floor building analogy + trace table; `ALT_M2` room boundary analogy + annotated color code lines; or `ALT_WALKTHROUGH` step-by-step breakdown).
   - **PREREQUISITE INSTRUCTION:** Triggered on the second consecutive wrong answer (`wrongStreak >= 2`). Steps back to variable update fundamentals (`PRE1` tiffin-box analogy) followed by two unscored checks (`PRE_Q1`, `PRE_Q2`), then returns to loops one level lower (`level = max(1, level - 1)`).
   - **CONTINUE:** Consolidates learning at the current level.

2. **Beyond Multiple Choice (4 Formats):**
   - **MCQ:** Interactive selection with letter badges and confirmation checkmarks.
   - **PREDICT:** Monospace typed output prediction (e.g. `0 1 2 3`).
   - **ORDER:** Two-zone tap-to-move line ordering preserving exact Python indentation.
   - **EXPLAIN:** Free-text explanation evaluated via regex rubrics, Google Gemini generative AI with kind, non-punitive hints, and deterministic local fallbacks.

3. **Safe Automatic Question Generation:**
   - AI never computes code outputs or student answers.
   - Generative AI suggests parameters (`range_values` and `after_loop` families) which are validated against rigid level grids.
   - Python loop execution and distractor generation (M1, M2) are computed deterministically in code.
   - 100% offline fallback via `localSpec` ensures the app never blocks or crashes.

4. **10-Minute Sessions with Stop and Resume (C4):**
   - 600-second countdown timer ticks only during active learning screens (`QUESTION`, `FEEDBACK`, `LESSON`) and pauses when switching tabs or viewing Welcome/About.
   - Full session state persisted to `localStorage`.
   - "Stop for now" allows pausing at any second; "Continue where I stopped" seamlessly restores the session.
   - When time expires, learners are permitted to finish their active question calmly before viewing their summary.

5. **Anxiety-Free UX Guardrails (L5):**
   - **Zero red color anywhere** (warm amber palette used for corrections).
   - **No crosses (`❌`/`✗`)** or negative labels.
   - **No percentage scores or marks** during or after the session.
   - Competency summary displays qualitative progress chips (`✔ Got it`, `↗ Getting there`, `↺ Let's revisit`, `○ Not practised yet`).
   - Non-penalizing hints and unconditional model answers.

6. **Identity Footer:**
   - Displayed consistently on all 7 screens: `ET 617 · Roll No: 23b2505 · Card P4-T10-L5-C4`.

---

## 🛠️ Tech Stack

- **Frontend:** Pure React 18, Vite 5, Vanilla CSS (Mobile-first responsive design, accessible contrast, `:focus-visible` support).
- **Backend / Serverless:** Vercel Serverless Functions (Node.js ESM) in `/api`:
  - `api/grade.js`: Free-text explanation grader using Gemini API.
  - `api/generate.js`: Question parameter suggester using Gemini API.
  - `api/_gemini.js`: Shared Gemini REST client with AbortController timeouts.
- **Persistence:** Browser `localStorage` for state and evaluation logging.

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run UI in Development Mode
```bash
npm run dev
```
*Note: In `npm run dev`, UI functions with 100% full capabilities using built-in deterministic rule evaluation and local parameter generation.*

### 3. Run with Vercel Serverless API (Full AI Integration)
```bash
# Create local .env with your Gemini API key:
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run using Vercel CLI:
npx vercel dev
```

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment Instructions (Vercel)

1. Push your repository to GitHub: `https://github.com/hitanshmakwana/et617-endsem-23b2505`
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Set the Project Name to `et617-23b2505`.
4. Framework Preset: **Vite**.
5. In **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `GEMINI_MODEL`: `gemini-2.5-flash` (or current active flash model).
6. Click **Deploy**.

---

## 📂 Documentation

- [docs/ARCHITECTURE.md](file:///c:/Users/Hitansh/et617-endsem-23b3505/docs/ARCHITECTURE.md): File tree map, state machine, data flows, and AI architecture.
- [docs/DECISIONS.md](file:///c:/Users/Hitansh/et617-endsem-23b3505/docs/DECISIONS.md): Architectural and pedagogical design records.
- [DESIGN.md](file:///c:/Users/Hitansh/et617-endsem-23b3505/DESIGN.md): The original pedagogical blueprint and exam identity card.
- [IMPLEMENTATION_SPEC.md](file:///c:/Users/Hitansh/et617-endsem-23b3505/IMPLEMENTATION_SPEC.md): Comprehensive functional specification.
