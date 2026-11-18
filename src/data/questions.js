export const QUESTIONS = [
  {
    id: "Q01", level: 1, format: "MCQ", concept: "range-values", tests: [],
    code: 'for i in range(3):\n    print("Hi")',
    prompt: 'How many times will "Hi" be printed?',
    options: [
      { id: "a", text: "2", tag: "GENERIC" },
      { id: "b", text: "3" },
      { id: "c", text: "4", tag: "GENERIC" },
      { id: "d", text: "1", tag: "GENERIC" }
    ],
    correctOptionId: "b",
    hint: "range(3) gives three numbers. The loop runs once for each number.",
    correctFeedback: "Yes! range(3) gives 3 numbers, so the loop runs 3 times.",
    feedbackByTag: {
      GENERIC: "Not quite yet, and that is okay. Let's count the rounds: round 1, round 2, round 3. The loop runs once for each number that range(3) gives."
    },
    walkthrough: [
      "range(3) gives the numbers 0, 1, 2.",
      "That is 3 numbers, so the loop runs 3 rounds.",
      "Each round prints Hi, so Hi is printed 3 times."
    ],
    modelAnswer: "3 times"
  },
  {
    id: "Q02", level: 1, format: "PREDICT", concept: "range-values", tests: ["M1"],
    code: "for i in range(4):\n    print(i)",
    prompt: "What does this code print?",
    answer: { correct: ["0 1 2 3"], tags: { M1: ["1 2 3 4", "0 1 2 3 4"] } },
    hint: "range(4) starts at 0. Does it print 4 itself?",
    correctFeedback: "Yes! It prints 0 1 2 3. range(4) starts at 0 and stops just before 4.",
    feedbackByTag: {
      M1: "That is a very common mix-up. Many people expect range(4) to start at 1 or to include 4. We will look at it another way.",
      GENERIC: "Not quite yet. Let's trace it: the first number is 0, then 1, 2, 3. Then the loop stops before 4."
    },
    walkthrough: [
      "range(4) gives the numbers 0, 1, 2, 3.",
      "The loop runs once for each number, so i is 0, then 1, then 2, then 3.",
      "print(i) shows each value, so the output is 0 1 2 3."
    ],
    modelAnswer: "0 1 2 3"
  },
  {
    id: "Q03", level: 1, format: "MCQ", concept: "range-values", tests: ["M1"],
    code: "range(5)",
    prompt: "Which numbers does range(5) give?",
    options: [
      { id: "a", text: "1, 2, 3, 4, 5", tag: "M1" },
      { id: "b", text: "0, 1, 2, 3, 4" },
      { id: "c", text: "0, 1, 2, 3, 4, 5", tag: "M1" },
      { id: "d", text: "1, 2, 3, 4", tag: "M1" }
    ],
    correctOptionId: "b",
    hint: "range(5) gives 5 numbers. Where does counting start in Python?",
    correctFeedback: "Yes! range(5) gives 5 numbers: 0, 1, 2, 3, 4.",
    feedbackByTag: {
      M1: "That is a very common mix-up. Many people expect range(5) to start at 1 or to include 5. We will look at it another way.",
      GENERIC: "Not quite yet. range(5) gives 5 numbers, starting from 0."
    },
    walkthrough: [
      "range(5) gives 5 numbers.",
      "Python starts counting at 0, so the numbers are 0, 1, 2, 3, 4.",
      "The number 5 is where it stops. It is not included."
    ],
    modelAnswer: "0, 1, 2, 3, 4"
  },
  {
    id: "Q04", level: 1, format: "MCQ", concept: "indent-repeat", tests: ["M2"],
    code: 'for i in range(3):\n    print("Hello")\nprint("Bye")',
    prompt: 'How many times will "Bye" be printed?',
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "3", tag: "M2" },
      { id: "c", text: "4", tag: "M2" },
      { id: "d", text: "0", tag: "GENERIC" }
    ],
    correctOptionId: "a",
    hint: 'Look at the spaces at the start of each line. Is print("Bye") pushed in like print("Hello")?',
    correctFeedback: 'Yes! print("Bye") is not indented, so it is outside the loop. It runs once, after the loop ends.',
    feedbackByTag: {
      M2: "That is a very common mix-up. Only the indented lines repeat. We will look at it another way.",
      GENERIC: 'Not quite yet. Check the spaces at the start of print("Bye"). Is it inside the loop or outside?'
    },
    walkthrough: [
      'print("Hello") is indented, so it is inside the loop and runs 3 times.',
      'print("Bye") is not indented, so it is outside the loop.',
      "Python runs it once, after the loop has finished."
    ],
    modelAnswer: "1 time"
  },
  {
    id: "Q05", level: 2, format: "PREDICT", concept: "indent-repeat", tests: ["M2"],
    code: 'for i in range(2):\n    print("A")\n    print("B")\nprint("C")',
    prompt: "What does this code print?",
    answer: { correct: ["A B A B C"], tags: { M2: ["A B C A B C"] } },
    hint: "Only the indented lines repeat. Which lines are indented?",
    correctFeedback: "Yes! A and B are indented, so they repeat twice. C is not indented, so it prints once at the end.",
    feedbackByTag: {
      M2: "That is a very common mix-up. print(\"C\") is not indented, so it does not repeat. We will look at it another way.",
      GENERIC: "Not quite yet. Let's go round by round: round 1 prints A, B. Round 2 prints A, B. Then the loop ends and C prints once."
    },
    walkthrough: [
      "Round 1: A, then B.",
      "Round 2: A, then B.",
      "The loop is finished. Now print(\"C\") runs once: C."
    ],
    modelAnswer: "A B A B C"
  },
  {
    id: "Q06", level: 2, format: "ORDER", concept: "indent-repeat", tests: [],
    prompt: "Put the lines in order. The program must print Start once, Hello three times, then Done once.",
    lines: [
      { id: "l1", text: 'print("Start")' },
      { id: "l2", text: "for i in range(3):" },
      { id: "l3", text: '    print("Hello")' },
      { id: "l4", text: 'print("Done")' }
    ],
    displayOrder: ["l4", "l3", "l1", "l2"],
    correctOrder: ["l1", "l2", "l3", "l4"],
    hint: "The line that says for comes first in the loop. The indented line goes right under it.",
    correctFeedback: "Yes! Start runs once, the indented Hello repeats 3 times, then Done runs once.",
    feedbackByTag: {
      GENERIC: "Not quite yet. The indented print(\"Hello\") must sit right under the for line. print(\"Start\") comes before the loop and print(\"Done\") comes after it."
    },
    walkthrough: [
      'First: print("Start") runs once.',
      "Then the loop line, with the indented print(\"Hello\") right under it.",
      'Last: print("Done") runs once, after the loop.'
    ],
    modelAnswer: 'print("Start")  →  for i in range(3):  →      print("Hello")  →  print("Done")'
  },
  {
    id: "Q07", level: 2, format: "PREDICT", concept: "accumulator", tests: ["M2"],
    code: "total = 0\nfor i in range(3):\n    total = total + 2\nprint(total)",
    prompt: "What is printed?",
    answer: { correct: ["6"], tags: { M2: ["2 4 6"] } },
    hint: "total grows by 2 each round. It starts at 0. After round 1 it is 2.",
    correctFeedback: "Yes! total goes 0 → 2 → 4 → 6, and print(total) runs once at the end.",
    feedbackByTag: {
      M2: "Good thinking about the steps. But print(total) is not indented, so it runs only once, after the loop. We will look at it another way.",
      GENERIC: "Not quite yet. Let's trace total: it starts at 0. Round 1: 0 + 2 = 2. Round 2: 2 + 2 = 4. Round 3: 4 + 2 = 6."
    },
    walkthrough: [
      "total starts at 0.",
      "Round 1: total = 0 + 2 = 2. Round 2: total = 2 + 2 = 4. Round 3: total = 4 + 2 = 6.",
      "The loop ends. print(total) is not indented, so it runs once and shows 6."
    ],
    modelAnswer: "6"
  },
  {
    id: "Q08", level: 2, format: "MCQ", concept: "range-values", tests: ["M1"],
    code: "for i in range(2, 6):\n    print(i)",
    prompt: "Which numbers are printed?",
    options: [
      { id: "a", text: "2 3 4 5" },
      { id: "b", text: "2 3 4 5 6", tag: "M1" },
      { id: "c", text: "3 4 5 6", tag: "GENERIC" },
      { id: "d", text: "2 6", tag: "GENERIC" }
    ],
    correctOptionId: "a",
    hint: "range(2, 6) starts at 2. It stops just before 6.",
    correctFeedback: "Yes! range(2, 6) starts at 2 and stops just before 6, so it prints 2 3 4 5.",
    feedbackByTag: {
      M1: "That is a very common mix-up. Many people expect 6 to be included. range stops just before 6. We will look at it another way.",
      GENERIC: "Not quite yet. range(2, 6) starts at 2 and goes up one at a time. It stops just before 6."
    },
    walkthrough: [
      "range(2, 6) starts at 2.",
      "It goes up by 1 each time: 2, 3, 4, 5.",
      "It stops just before 6, so 6 is not printed."
    ],
    modelAnswer: "2 3 4 5"
  },
  {
    id: "Q09", level: 2, format: "EXPLAIN", concept: "indent-repeat", tests: ["M2"],
    code: 'for i in range(3):\n    print("Hello")\nprint("Bye")',
    prompt: 'In your own words: why is "Bye" printed only one time?',
    rubric: {
      mustMention: [
        {
          id: "outside",
          label: "says Bye is not indented / outside the loop / runs once after the loop",
          patterns: [/not\s+indent/i, /no\s+indent/i, /without\s+indent/i, /outside/i, /after\s+the\s+loop/i, /not\s+(inside|part)/i, /\bonce\b/i, /only\s+1\b|one\s+time/i]
        }
      ],
      wrongPatterns: { M2: [/inside\s+the\s+loop/i, /repeats?\s+(too|also)/i] }
    },
    aiRubricText: 'A correct answer says that print("Bye") is not indented, so it is outside the loop and runs only once, after the loop finishes.',
    hint: "Look at the spaces at the start of each line. Which lines are indented?",
    correctFeedback: "Great explanation! A line that is not indented is outside the loop, so it runs only once.",
    feedbackByTag: {
      M2: "You are close. Think about the spaces at the start of the line. Does print(\"Bye\") have them?",
      GENERIC: "You are close. Look at the spaces at the start of each line. Which lines are indented?"
    },
    walkthrough: [
      'print("Hello") is indented, so it is inside the loop and repeats.',
      'print("Bye") is not indented, so it is outside the loop.',
      "Python runs it once, after the loop has finished."
    ],
    modelAnswer: 'Because print("Bye") is not indented. It is outside the loop, so it runs only once, after the loop finishes.'
  },
  {
    id: "Q10", level: 3, format: "PREDICT", concept: "range-values", tests: ["M1"],
    code: "for i in range(1, 10, 3):\n    print(i)",
    prompt: "What does this code print?",
    answer: { correct: ["1 4 7"], tags: { M1: ["1 4 7 10"] } },
    hint: "Start at 1 and jump by 3 each time. Stop just before 10.",
    correctFeedback: "Yes! It starts at 1, jumps by 3, and stops just before 10: 1 4 7.",
    feedbackByTag: {
      M1: "Close! After 7 the next number would be 10, but range stops just before 10, so 10 is not printed. We will look at it another way.",
      GENERIC: "Not quite yet. Start at 1, then add 3 each time: 1, 4, 7. The next one would be 10, but range stops just before 10."
    },
    walkthrough: [
      "range(1, 10, 3) starts at 1 and jumps by 3.",
      "The numbers are 1, 4, 7. The next would be 10, but that is the stop number.",
      "So i is 1, 4, 7 and the output is 1 4 7."
    ],
    modelAnswer: "1 4 7"
  },
  {
    id: "Q11", level: 3, format: "MCQ", concept: "range-values", tests: [],
    code: 'for i in range(2):\n    for j in range(3):\n        print("*")',
    prompt: "How many stars are printed in total?",
    options: [
      { id: "a", text: "3", tag: "GENERIC" },
      { id: "b", text: "5", tag: "GENERIC" },
      { id: "c", text: "6" },
      { id: "d", text: "2", tag: "GENERIC" }
    ],
    correctOptionId: "c",
    hint: "For each round of the outer loop, the inner loop runs completely, 3 times.",
    correctFeedback: "Yes! The outer loop runs 2 rounds. Each round prints 3 stars. 2 × 3 = 6.",
    feedbackByTag: {
      GENERIC: "Not quite yet. The outer loop runs 2 rounds. In each round the inner loop prints 3 stars. So 2 × 3 = 6."
    },
    walkthrough: [
      "Outer round 1: the inner loop prints 3 stars.",
      "Outer round 2: the inner loop prints 3 stars again.",
      "3 + 3 = 6 stars."
    ],
    modelAnswer: "6 stars"
  },
  {
    id: "Q12", level: 3, format: "EXPLAIN", concept: "range-values", tests: ["M1"],
    prompt: 'A friend says: "range(5) prints 1, 2, 3, 4, 5." In your own words, what does range(5) really give, and why?',
    rubric: {
      mustMention: [
        { id: "starts0", label: "says it starts at 0", patterns: [/\b(0|zero)\b/i] },
        {
          id: "stopsBefore",
          label: "says it stops before 5 / 5 is not included / last number is 4",
          patterns: [
            /not\s+(include|included|print|printed|go|reach|reached)/i,
            /doesn'?t\s+(include|print|go|reach)/i,
            /does\s+not\s+(include|print|go|reach)/i,
            /before\s+5/i, /up\s+to\s+4/i,
            /(till|until|to|through)\s+4/i,
            /last\s+(number\s+)?(is\s+)?4/i,
            /stops?\s+(at|before)/i,
            /excluding|except/i
          ]
        }
      ],
      wrongPatterns: { M1: [/1\s*(to|-|,)\s*5/i, /starts?\s*(at|from)\s*1/i, /includes?\s*5/i] }
    },
    aiRubricText: "A correct answer says range(5) starts at 0 and stops just before 5, so it gives 0, 1, 2, 3, 4 (five numbers) and 5 is not included.",
    hint: "Think about where range(5) starts, and whether 5 itself is included.",
    correctFeedback: "Great explanation! Starting at 0 and stopping just before 5 is exactly right.",
    feedbackByTag: {
      M1: "You are close. Think about where range(5) starts, and whether 5 itself is included.",
      GENERIC: "You are close. Think about where range(5) starts, and whether 5 itself is included."
    },
    walkthrough: [
      "range(5) gives 5 numbers.",
      "It starts at 0: 0, 1, 2, 3, 4.",
      "5 is where it stops, so 5 is not included."
    ],
    modelAnswer: "range(5) starts at 0 and stops just before 5, so it gives 0, 1, 2, 3, 4."
  },
  {
    id: "Q13", level: 1, format: "MCQ", concept: "indent-repeat", tests: ["M2"],
    code: 'for i in range(2):\n    print("Tea")\nprint("Done")',
    prompt: "What is printed?",
    options: [
      { id: "a", text: "Tea Done", tag: "GENERIC" },
      { id: "b", text: "Tea Tea Done" },
      { id: "c", text: "Tea Done Tea Done", tag: "M2" },
      { id: "d", text: "Tea Tea Done Done", tag: "M2" }
    ],
    correctOptionId: "b",
    hint: 'Only the indented line repeats. Is print("Done") indented?',
    correctFeedback: "Yes! Tea is indented, so it repeats twice. Done is not indented, so it prints once at the end.",
    feedbackByTag: {
      M2: "That is a very common mix-up. Done is not indented, so it does not repeat. We will look at it another way.",
      GENERIC: "Not quite yet. The loop runs 2 rounds, and each round prints Tea. Then Done prints once."
    },
    walkthrough: [
      "Round 1: Tea. Round 2: Tea.",
      "The loop is finished.",
      "Now print(\"Done\") runs once: Done."
    ],
    modelAnswer: "Tea Tea Done"
  },
  {
    id: "Q14", level: 3, format: "PREDICT", concept: "accumulator", tests: ["M1", "M2"],
    code: "total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)",
    prompt: "What number is printed?",
    answer: { correct: ["6"], tags: { M1: ["10"], M2: ["1 3 6"] } },
    hint: "range(1, 4) gives 1, 2, 3. Add them one by one to total.",
    correctFeedback: "Yes! total goes 0 → 1 → 3 → 6. range(1, 4) stops just before 4.",
    feedbackByTag: {
      M1: "Close! range(1, 4) stops just before 4, so i is 1, 2, 3 and not 4. We will look at it another way.",
      M2: "Good tracing! But print(total) is not indented, so it runs only once, after the loop. We will look at it another way.",
      GENERIC: "Not quite yet. i is 1, then 2, then 3. total: 0 + 1 = 1, then 1 + 2 = 3, then 3 + 3 = 6."
    },
    walkthrough: [
      "range(1, 4) gives 1, 2, 3.",
      "total: 0 + 1 = 1, then 1 + 2 = 3, then 3 + 3 = 6.",
      "print(total) is not indented, so it runs once and shows 6."
    ],
    modelAnswer: "6"
  }
];

export const PREREQ_QUESTIONS = [
  {
    id: "PRE_Q1", level: 0, format: "MCQ", concept: "accumulator", tests: [], isPrereqCheck: true,
    code: "x = 5\nx = x + 3\nprint(x)",
    prompt: "What is printed?",
    options: [
      { id: "a", text: "5", tag: "GENERIC" },
      { id: "b", text: "3", tag: "GENERIC" },
      { id: "c", text: "8" },
      { id: "d", text: "x + 3", tag: "GENERIC" }
    ],
    correctOptionId: "c",
    hint: "x = x + 3 means: take the value of x, add 3, and put the new value back in x.",
    correctFeedback: "Yes! x was 5. After x = x + 3 it is 8.",
    feedbackByTag: { GENERIC: "Not quite yet. x starts as 5. Then x = x + 3 takes 5, adds 3, and puts 8 back in x. So 8 is printed." },
    walkthrough: ["x starts as 5.", "x = x + 3 makes it 5 + 3 = 8.", "print(x) shows 8."],
    modelAnswer: "8"
  },
  {
    id: "PRE_Q2", level: 0, format: "PREDICT", concept: "accumulator", tests: [], isPrereqCheck: true,
    code: "count = 1\ncount = count + 1\ncount = count + 1\nprint(count)",
    prompt: "What is printed?",
    answer: { correct: ["3"], tags: {} },
    hint: "count starts at 1. Each line adds 1 and puts the answer back.",
    correctFeedback: "Yes! count goes 1 → 2 → 3.",
    feedbackByTag: { GENERIC: "Not quite yet. count starts at 1. The first update makes it 2. The second update makes it 3." },
    walkthrough: ["count starts at 1.", "First update: 1 + 1 = 2.", "Second update: 2 + 1 = 3. print shows 3."],
    modelAnswer: "3"
  }
];
