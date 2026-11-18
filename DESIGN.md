# DESIGN.md — ET 617 End-Sem

## Identity card
| Field | Value |
|---|---|
| P — Problem | **P4** Adaptive tutor with automatic question generation |
| T — Topic | **P4-T10** Loops in block or Python programming (Class 8–11) — Python `for` loops with `range()` |
| L — Learner | **L5** Learner repeating the topic after failing it once, high anxiety, low self-efficacy |
| C — Constraint | **C4** 10-minute sessions (one full sequence fits in 10 min; stop and resume where left off) |
| ID — Roll number | **23b2505** |
| Live URL | `https://et617-endsem-23b2505.vercel.app` |
| Repo | `et617-endsem-23b2505` |

App name: **Loop Coach**

---

## 1. Educational problem (D1)
Class 10 students often fail their first loops test because they hold two quiet misconceptions: they think `range(n)` starts at 1 or includes `n`, and they think every line after a `for` line repeats, whatever the indentation. A repeat learner who has already failed once is anxious, expects to be wrong, and quits when practice feels like another test. A fixed worksheet cannot tell which misconception a learner holds, so it cannot respond to it. This app gives short, private, low-pressure practice. It diagnoses the misconception from the learner's answers and then chooses what to do next: a harder question, a different explanation, or a step back to a prerequisite.

### Learning outcomes (measurable)
1. **Predict** the exact output of a `for` loop that uses `range(n)`, `range(start, stop)` or `range(start, stop, step)`.
2. **Explain** in their own words why `range(n)` stops before `n`, and why an unindented line after a loop runs only once.
3. **Trace** a loop with a running total (`total = total + 2`) and state the final value.

### Context of use
At home, in the evening, about 10 minutes after dinner. Device: the family laptop (Chrome) or a parent's Android phone (360 px wide). Interface language: simple English.

## 2. Learner persona (D2)
**Riya Shah, 15, Class 10, Ahmedabad.** She repeats the loops topic after scoring 9/25 on the unit test, and a re-test is next Friday.
- **Prior knowledge:** can use `print()`, can store a number in a variable, has seen `for` and `range` in class but has not understood them.
- **Device and time:** shared family laptop or her mother's phone, about 10 minutes in the evening.
- **Language:** English-medium school, simple English works best, speaks Gujarati at home.
- **Motivation:** wants to pass the re-test, and wants to practise without anyone watching her get things wrong.
- **Emotional state:** anxious, low self-efficacy. She stops when she sees red marks or scores.
- **Misconception M1:** `range(5)` gives 1, 2, 3, 4, 5. She thinks it starts at 1 or includes the end number.
- **Misconception M2:** every line written after the `for` line repeats. She ignores indentation, so she thinks `print("Bye")` also runs every round.

## 3. Content plan (D3)
**One learning activity: "Which numbers? Which lines repeat?"**
- **Short concept cards (3):** a loop repeats lines, `range(3)` gives 0, 1, 2, only indented lines repeat.
- **Question bank:** 14 hand-written questions (levels 1–3) in 4 formats: multiple choice, predict the output (typed), put lines in order, explain in your own words.
- **Generated questions:** parametric questions built by code and chosen with the AI helper's suggestion, targeted at the learner's misconception. Answers are always computed by code, never by AI.
- **Feedback:** for each question, one correct feedback text, one text per misconception (M1, M2), and one generic text.
- **Mini-lessons:** `ALT_M1` (ground-floor analogy and trace table), `ALT_M2` (room analogy and annotated code), `ALT_WALKTHROUGH` (step-by-step trace), `PRE1` (variables as a tiffin box, with 2 check questions).

## 4. Adaptive decision rule (the design challenge)
After every scored answer the tutor decides one of three things.

| Situation | Outcome |
|---|---|
| Two correct in a row, with no hint used | **HARDER**: level goes up by 1 (max 3) |
| First wrong answer (diagnosed misconception M1 or M2, or a generic error) | **ALTERNATIVE EXPLANATION**: show a different-representation mini-lesson, then ask a similar question |
| Second wrong answer in a row | **PREREQUISITE**: variable-tracing mini-lesson plus 2 easy checks, then return one level lower |

Otherwise the tutor continues at the same level. The learner always sees a short, kind reason: "Why this next?"

## 5. Design decisions tied to persona and constraint
- **L5 (anxious repeat learner):** no red colours, no crosses, no score during the session, retries are free, every wrong answer starts with a gentle sentence, and the first two questions are a quick diagnostic, not a test.
- **C4 (10-minute sessions):** a visible 10:00 countdown that runs only while the learner is working; maximum 8 scored questions; "Stop for now" on every screen; the exact screen and question are saved in the browser, and "Resume" returns to them.
- **Language:** short sentences, "we" and "let's", code always shown in a monospace box, key words highlighted.

## 6. AI plan (summary; full specification is in IMPLEMENTATION_SPEC.md)
1. **Explanation grader:** the AI helper judges free-text explanations against a rubric. Simple rules run first. The output is validated, and there is a built-in fallback.
2. **Question generator:** the AI helper suggests parameters for a new question. Our code validates them, builds the question, and computes the answer. A local generator is the fallback.
The core app works fully with no AI at all.

## 7. Process plan
- 0:30 this file committed
- 1:00 first deployment live
- Commit at least every 30 minutes
- API key only in Vercel environment variables
- Template and libraries used: Vite + React (named in the report)
