// Range generator helper
function rangeVals(start, stop, step) {
  const vals = [];
  for (let i = start; i < stop; i += step) {
    vals.push(i);
  }
  return vals;
}

export function specKey(spec) {
  if (!spec || !spec.family || !spec.params) return "";
  return JSON.stringify({ family: spec.family, params: spec.params });
}

export function buildFromSpec(spec, level, n) {
  if (!spec || !spec.family || !spec.params) return null;
  const p = spec.params;

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
    if (!["Tea", "Chai", "Hi", "Go", "Roti"].includes(word)) return null;
    if (!["Done", "Bye", "End"].includes(after)) return null;
    if (level !== 1 && level !== 2) return null;

    const correct = Array(loopN).fill(word).join(" ") + " " + after;
    const m2a = (word + " " + after + " ").repeat(loopN).trim();
    const m2b = Array(loopN).fill(word).join(" ") + " " + Array(loopN).fill(after).join(" ");

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

  return null;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function localSpec(level, targetTag, usedKeys = []) {
  let family;
  if (level === 3) {
    family = "range_values";
  } else if (targetTag === "M1") {
    family = "range_values";
  } else if (targetTag === "M2") {
    family = "after_loop";
  } else {
    family = Math.random() < 0.5 ? "range_values" : "after_loop";
  }

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
      spec = { family: "range_values", params: { start, stop, step } };
    } else {
      const n = randomChoice([2, 3, 4]);
      const word = randomChoice(["Tea", "Chai", "Hi", "Go", "Roti"]);
      const after = randomChoice(["Done", "Bye", "End"]);
      spec = { family: "after_loop", params: { n, word, after } };
    }

    const key = specKey(spec);
    if (!usedKeys.includes(key)) {
      return spec;
    }
  }

  // Fallback if all attempts had used keys
  if (family === "range_values") {
    return { family: "range_values", params: { start: 0, stop: 4, step: 1 } };
  }
  return { family: "after_loop", params: { n: 2, word: "Tea", after: "Done" } };
}
