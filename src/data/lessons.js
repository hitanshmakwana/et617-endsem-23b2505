export const LESSONS = {
  ALT_M1: {
    title: "Another way to see range(5)",
    blocks: [
      { type: "p", text: "Let's think about a building. In India, the ground floor is floor 0. A building with 5 floors has floors 0, 1, 2, 3 and 4." },
      { type: "p", text: "range(5) works the same way. It gives 5 numbers, starting from 0: 0, 1, 2, 3, 4. The number 5 is where it stops. It is not used." },
      { type: "table", head: ["Round", "i", "Prints"], rows: [["1", "0", "0"], ["2", "1", "1"], ["3", "2", "2"], ["4", "3", "3"], ["5", "4", "4"]] },
      { type: "p", text: "5 rounds. 5 numbers. The last number is 4." },
      { type: "tip", text: "range(n) gives n numbers: from 0 up to n − 1." }
    ],
    buttonLabel: "Try a new question"
  },
  ALT_M2: {
    title: "Which lines repeat?",
    blocks: [
      { type: "p", text: "Imagine the loop is a room. Lines that are pushed in (indented) are inside the room. They repeat in every round." },
      { type: "p", text: "A line that is not pushed in is outside the room. Python runs it only once, after the loop has finished." },
      {
        type: "annotated",
        lines: [
          { text: "for i in range(2):", mark: "loop", note: "the loop line" },
          { text: '    print("Tea")', mark: "inside", note: "inside: runs 2 times" },
          { text: 'print("Done")', mark: "outside", note: "outside: runs 1 time, at the end" }
        ]
      },
      { type: "p", text: "Round 1: Tea. Round 2: Tea. The loop is finished. Now Done. The output is: Tea Tea Done." },
      { type: "tip", text: "Spaces at the start of a line mean the line is inside the loop." }
    ],
    buttonLabel: "Try a new question"
  },
  ALT_WALKTHROUGH: {
    title: "Let's go through it step by step",
    blocks: [],            // filled at runtime: show the previous question's code (if any) then its walkthrough as a numbered list
    buttonLabel: "Try a new question"
  },
  PRE1: {
    title: "A small step back: how a variable changes",
    blocks: [
      { type: "p", text: "A variable is like a labelled tiffin box. It holds one value." },
      { type: "code", text: "total = 0" },
      { type: "p", text: "This puts 0 in the box called total." },
      { type: "code", text: "total = total + 2" },
      { type: "p", text: "This means: open the box, take the value, add 2, and put the new value back." },
      { type: "table", head: ["Step", "Box total holds"], rows: [["Start: total = 0", "0"], ["total = total + 2", "2"], ["total = total + 2 (again)", "4"]] },
      { type: "tip", text: "The box always holds the newest value. The old value is replaced." }
    ],
    buttonLabel: "Start the warm-up check"
  }
};
