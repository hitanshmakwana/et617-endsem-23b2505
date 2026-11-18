// Range generator helper
function rangeVals(start, stop, step) {
  const vals = [];
  for (let i = start; i < stop; i += step) {
    vals.push(i);
  }
  return vals;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function specKey(spec) {
  if (!spec || !spec.family || !spec.params) return "";
  return JSON.stringify({ family: spec.family, params: spec.params, format: spec.format });
}

export function buildFromSpec(spec, level, n) {
  if (!spec || !spec.family || !spec.params) return null;
  const p = spec.params;
  const format = spec.format || "PREDICT";

  if (spec.family === "range_values") {
    const start = Number(p.start);
    const stop = Number(p.stop);
    const step = Number(p.step || 1);

    if (isNaN(start) || isNaN(stop) || isNaN(step)) return null;
    if (start < 0 || step < 1 || stop <= start || stop > 20) return null;

    const count = Math.ceil((stop - start) / step);
    if (count < 3 || count > 6) return null;

    const vals = rangeVals(start, stop, step);
    const inclusive = rangeVals(start, stop + 1, step);
    if (vals.join(" ") === inclusive.join(" ")) return null;

    // Check level grids
    if (level === 1) {
      if (start !== 0 || step !== 1 || stop < 3 || stop > 6) return null;
    } else if (level === 2) {
      if (![1, 2, 3, 5].includes(start) || step !== 1 || ![3, 4, 5].includes(stop - start)) return null;
    } else if (level === 3) {
      if (![2, 3].includes(step) || ![0, 1, 2].includes(start) || ![3, 4].includes(count) || (stop - start) % step !== 0) {
        return null;
      }
    } else {
      return null;
    }

    const rangeText = step === 1
      ? (start === 0 ? `range(${stop})` : `range(${start}, ${stop})`)
      : `range(${start}, ${stop}, ${step})`;

    const correct = vals.join(" ");
    const m1Answers = [inclusive.join(" ")];
    if (start === 0 && step === 1) {
      m1Answers.push(vals.map(v => v + 1).join(" "));
    }

    // Support MCQ format dynamically if requested
    if (format === "MCQ") {
      const rawOpts = [
        { text: correct, isCorrect: true },
        { text: inclusive.join(" "), tag: "M1" },
        { text: vals.map(v => v + 1).join(" "), tag: "M1" },
        { text: `${start} ${stop}`, tag: "GENERIC" }
      ];
      // Deduplicate options if any texts collide
      const uniqueOpts = [];
      const seenTexts = new Set();
      for (const opt of rawOpts) {
        if (!seenTexts.has(opt.text)) {
          seenTexts.add(opt.text);
          uniqueOpts.push(opt);
        }
      }
      if (uniqueOpts.length < 3) {
        uniqueOpts.push({ text: `${start} to ${stop}`, tag: "GENERIC" });
      }

      const shuffled = shuffle(uniqueOpts);
      const letterIds = ["a", "b", "c", "d"];
      let correctId = "a";
      const finalOptions = shuffled.slice(0, 4).map((opt, idx) => {
        const id = letterIds[idx] || `opt${idx}`;
        if (opt.isCorrect) correctId = id;
        return {
          id,
          text: opt.text,
          tag: opt.isCorrect ? undefined : (opt.tag || "GENERIC")
        };
      });

      return {
        id: `G-${n}`,
        source: "generated",
        level,
        format: "MCQ",
        concept: "range-values",
        tests: ["M1"],
        code: `for i in ${rangeText}:\n    print(i)`,
        prompt: "Which numbers are printed?",
        options: finalOptions,
        correctOptionId: correctId,
        hint: `Start at ${start}.${step > 1 ? ` Jump by ${step} each time.` : ""} Stop just before ${stop}.`,
        correctFeedback: `Yes! range starts at ${start}${step > 1 ? `, jumps by ${step},` : ""} and stops just before ${stop}: ${correct}.`,
        feedbackByTag: {
          M1: `Many people expect ${stop} to be included. But range stops just before ${stop}. We will look at it another way.`,
          GENERIC: `Not quite yet. Let's trace it: i takes the values ${vals.join(", ")}, one value in each round.`
        },
        walkthrough: [
          `${rangeText} gives: ${vals.join(", ")}.`,
          `The loop runs once for each value, so i is ${vals.join(", ")} in turn.`,
          `print(i) shows each value, so the output is ${correct}.`
        ],
        modelAnswer: correct
      };
    }

    // Default PREDICT format
    return {
      id: `G-${n}`,
      source: "generated",
      level,
      format: "PREDICT",
      concept: "range-values",
      tests: ["M1"],
      code: `for i in ${rangeText}:\n    print(i)`,
      prompt: "What does this code print?",
      answer: { correct: [correct], tags: { M1: m1Answers } },
      hint: `Start at ${start}.${step > 1 ? ` Jump by ${step} each time.` : ""} Stop just before ${stop}.`,
      correctFeedback: `Yes! This prints ${correct}. It starts at ${start}${step > 1 ? `, jumps by ${step},` : ""} and stops just before ${stop}.`,
      feedbackByTag: {
        M1: `Many people expect ${stop} to be included. But range stops just before ${stop}. We will look at it another way.`,
        GENERIC: `Not quite yet. Let's trace it: i takes the values ${vals.join(", ")}, one value in each round.`
      },
      walkthrough: [
        `${rangeText} gives: ${vals.join(", ")}.`,
        `The loop runs once for each value, so i is ${vals.join(", ")} in turn.`,
        `print(i) shows each value, so the output is ${correct}.`
      ],
      modelAnswer: correct
    };
  }

  if (spec.family === "after_loop") {
    const loopN = Number(p.n);
    const word = String(p.word || "");
    const after = String(p.after || "");

    if (![2, 3, 4].includes(loopN)) return null;
    const allowedWords = ["Tea", "Chai", "Hi", "Go", "Roti", "Lap", "Step", "Wave", "Star"];
    const allowedAfter = ["Done", "Bye", "End", "Next", "Stop"];
    if (!allowedWords.includes(word)) return null;
    if (!allowedAfter.includes(after)) return null;
    if (level !== 1 && level !== 2) return null;

    const correct = Array(loopN).fill(word).join(" ") + " " + after;
    const m2a = (word + " " + after + " ").repeat(loopN).trim();
    const m2b = Array(loopN).fill(word).join(" ") + " " + Array(loopN).fill(after).join(" ");

    // Support MCQ format dynamically if requested
    if (format === "MCQ") {
      const rawOpts = [
        { text: correct, isCorrect: true },
        { text: m2a, tag: "M2" },
        { text: m2b, tag: "M2" },
        { text: `${word} ${after}`, tag: "GENERIC" }
      ];
      const uniqueOpts = [];
      const seenTexts = new Set();
      for (const opt of rawOpts) {
        if (!seenTexts.has(opt.text)) {
          seenTexts.add(opt.text);
          uniqueOpts.push(opt);
        }
      }
      const shuffled = shuffle(uniqueOpts);
      const letterIds = ["a", "b", "c", "d"];
      let correctId = "a";
      const finalOptions = shuffled.slice(0, 4).map((opt, idx) => {
        const id = letterIds[idx] || `opt${idx}`;
        if (opt.isCorrect) correctId = id;
        return {
          id,
          text: opt.text,
          tag: opt.isCorrect ? undefined : (opt.tag || "GENERIC")
        };
      });

      return {
        id: `G-${n}`,
        source: "generated",
        level,
        format: "MCQ",
        concept: "indent-repeat",
        tests: ["M2"],
        code: `for i in range(${loopN}):\n    print("${word}")\nprint("${after}")`,
        prompt: "What is printed?",
        options: finalOptions,
        correctOptionId: correctId,
        hint: `Only the indented line repeats. Is print("${after}") indented?`,
        correctFeedback: `Yes! "${word}" repeats ${loopN} times because it is indented. "${after}" runs once at the end.`,
        feedbackByTag: {
          M2: `That is a very common mix-up. Only indented lines repeat. print("${after}") is not indented, so it runs once. We will look at it another way.`,
          GENERIC: `Not quite yet. Let's go round by round: ${word} is printed ${loopN} times. Then the loop ends and ${after} is printed once.`
        },
        walkthrough: [
          `The loop runs ${loopN} rounds. Each round prints ${word}.`,
          `The loop is finished.`,
          `Now print("${after}") runs once: ${after}.`
        ],
        modelAnswer: correct
      };
    }

    // Default PREDICT format
    return {
      id: `G-${n}`,
      source: "generated",
      level,
      format: "PREDICT",
      concept: "indent-repeat",
      tests: ["M2"],
      code: `for i in range(${loopN}):\n    print("${word}")\nprint("${after}")`,
      prompt: "What does this code print?",
      answer: { correct: [correct], tags: { M2: [m2a, m2b] } },
      hint: `Only the indented line repeats. Is print("${after}") indented?`,
      correctFeedback: `Yes! "${word}" repeats ${loopN} times because it is indented. "${after}" is not indented, so it prints once at the end.`,
      feedbackByTag: {
        M2: `That is a very common mix-up. Only indented lines repeat. print("${after}") is not indented, so it runs once. We will look at it another way.`,
        GENERIC: `Not quite yet. Let's go round by round: ${word} is printed ${loopN} times. Then the loop ends and ${after} is printed once.`
      },
      walkthrough: [
        `The loop runs ${loopN} rounds. Each round prints ${word}.`,
        `The loop is finished.`,
        `Now print("${after}") runs once: ${after}.`
      ],
      modelAnswer: correct
    };
  }

  // Family 3: Accumulator (concepts: accumulator, indent-repeat, tests: M2)
  if (spec.family === "accumulator") {
    const loopN = Number(p.n || 3);
    const stepVal = Number(p.step || 2);
    if (![2, 3, 4].includes(loopN)) return null;
    if (![1, 2, 3, 5].includes(stepVal)) return null;

    const total = loopN * stepVal;
    const correct = String(total);

    // M2 misconception: print inside the loop would print running values
    const runningVals = [];
    let acc = 0;
    for (let r = 0; r < loopN; r++) {
      acc += stepVal;
      runningVals.push(acc);
    }
    const m2Tag = runningVals.join(" ");

    return {
      id: `G-${n}`,
      source: "generated",
      level: Math.min(3, Math.max(2, level)),
      format: "PREDICT",
      concept: "accumulator",
      tests: ["M2"],
      code: `total = 0\nfor i in range(${loopN}):\n    total = total + ${stepVal}\nprint(total)`,
      prompt: "What is printed?",
      answer: { correct: [correct], tags: { M2: [m2Tag] } },
      hint: `total starts at 0 and grows by ${stepVal} each round. print(total) is outside the loop.`,
      correctFeedback: `Yes! total grows to ${total}, and print(total) runs once at the end.`,
      feedbackByTag: {
        M2: `Good step-by-step tracing! But print(total) is outside the loop, so it prints only once, at the very end.`,
        GENERIC: `Not quite yet. Let's trace total: it starts at 0. Each of the ${loopN} rounds adds ${stepVal}.`
      },
      walkthrough: [
        `total starts at 0.`,
        ...runningVals.map((val, idx) => `Round ${idx + 1}: total = total + ${stepVal} = ${val}.`),
        `The loop ends. print(total) runs once and shows ${total}.`
      ],
      modelAnswer: correct
    };
  }

  return null;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function localSpec(level, targetTag, usedKeys = []) {
  let family;
  if (level === 3) {
    family = Math.random() < 0.6 ? "range_values" : "accumulator";
  } else if (targetTag === "M1") {
    family = "range_values";
  } else if (targetTag === "M2") {
    family = Math.random() < 0.7 ? "after_loop" : "accumulator";
  } else {
    const families = level === 1 ? ["range_values", "after_loop"] : ["range_values", "after_loop", "accumulator"];
    family = randomChoice(families);
  }

  const chosenFormat = Math.random() < 0.45 ? "MCQ" : "PREDICT";

  for (let attempt = 0; attempt < 30; attempt++) {
    let spec = null;
    if (family === "range_values") {
      let start, stop, step;
      if (level === 1) {
        start = 0;
        step = 1;
        stop = randomChoice([3, 4, 5, 6]);
      } else if (level === 2) {
        start = randomChoice([1, 2, 3, 5]);
        step = 1;
        const diff = randomChoice([3, 4, 5]);
        stop = start + diff;
      } else {
        step = randomChoice([2, 3]);
        start = randomChoice([0, 1, 2]);
        const count = randomChoice([3, 4]);
        stop = start + count * step;
      }
      spec = { family: "range_values", format: chosenFormat, params: { start, stop, step } };
    } else if (family === "after_loop") {
      const n = randomChoice([2, 3, 4]);
      const word = randomChoice(["Tea", "Chai", "Hi", "Go", "Roti", "Lap", "Step", "Wave", "Star"]);
      const after = randomChoice(["Done", "Bye", "End", "Next", "Stop"]);
      spec = { family: "after_loop", format: chosenFormat, params: { n, word, after } };
    } else {
      const n = randomChoice([2, 3, 4]);
      const step = randomChoice([1, 2, 3, 5]);
      spec = { family: "accumulator", format: "PREDICT", params: { n, step } };
    }

    const key = specKey(spec);
    if (!usedKeys.includes(key)) {
      return spec;
    }
  }

  // Safe fallback if all attempts had used keys
  if (family === "range_values") {
    return { family: "range_values", format: chosenFormat, params: { start: 0, stop: 4, step: 1 } };
  }
  return { family: "after_loop", format: chosenFormat, params: { n: 2, word: "Tea", after: "Done" } };
}
