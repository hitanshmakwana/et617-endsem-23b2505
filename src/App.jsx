import React, { useState } from "react";
import Footer from "./components/Footer.jsx";
import Welcome from "./components/Welcome.jsx";
import Intro from "./components/Intro.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import Feedback from "./components/Feedback.jsx";
import Lesson from "./components/Lesson.jsx";
import Summary from "./components/Summary.jsx";
import About from "./components/About.jsx";

export default function App() {
  const [screen, setScreen] = useState("WELCOME");
  const [prevScreen, setPrevScreen] = useState("WELCOME");
  const [remainingSeconds, setRemainingSeconds] = useState(600);
  const [timeUp, setTimeUp] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const goToAbout = () => {
    setPrevScreen(screen);
    setScreen("ABOUT");
  };

  const backFromAbout = () => {
    setScreen(prevScreen || "WELCOME");
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {screen === "WELCOME" && (
          <Welcome
            savedSession={null}
            onStart={() => setScreen("INTRO")}
            onResume={() => setScreen("QUESTION")}
            onStartFresh={() => setScreen("INTRO")}
            onGoAbout={goToAbout}
          />
        )}
        {screen === "INTRO" && (
          <Intro onStartSession={() => setScreen("QUESTION")} />
        )}
        {screen === "QUESTION" && (
          <QuestionScreen
            question={{
              id: "Q03",
              level: 1,
              format: "MCQ",
              concept: "range-values",
              prompt: "Which numbers does range(5) give?",
              options: [
                { id: "a", text: "1, 2, 3, 4, 5" },
                { id: "b", text: "0, 1, 2, 3, 4" },
                { id: "c", text: "0, 1, 2, 3, 4, 5" },
                { id: "d", text: "1, 2, 3, 4" }
              ],
              hint: "range(5) gives 5 numbers. Where does counting start in Python?"
            }}
            remainingSeconds={remainingSeconds}
            timeUp={timeUp}
            answeredCount={answeredCount}
            hintsUsed={0}
            onUseHint={() => {}}
            onSubmitAnswer={() => setScreen("FEEDBACK")}
            onStopForNow={() => setScreen("WELCOME")}
            isChecking={false}
          />
        )}
        {screen === "FEEDBACK" && (
          <Feedback
            feedback={{
              verdict: "correct",
              tag: null,
              feedbackText: "Yes! range(5) gives 5 numbers: 0, 1, 2, 3, 4.",
              answerText: "0, 1, 2, 3, 4",
              checkedBy: "rules",
              decision: {
                type: "CONTINUE",
                reason: "Here's another one at the same level to build your confidence."
              }
            }}
            question={{
              id: "Q03",
              format: "MCQ",
              modelAnswer: "0, 1, 2, 3, 4"
            }}
            remainingSeconds={remainingSeconds}
            timeUp={timeUp}
            answeredCount={1}
            onContinue={() => setScreen("SUMMARY")}
            onStopForNow={() => setScreen("WELCOME")}
            isGenerating={false}
          />
        )}
        {screen === "LESSON" && (
          <Lesson
            lesson={{
              title: "Another way to see range(5)",
              blocks: [
                { type: "p", text: "Let's think about a building. In India, the ground floor is floor 0." }
              ],
              buttonLabel: "Try a new question"
            }}
            remainingSeconds={remainingSeconds}
            timeUp={timeUp}
            answeredCount={1}
            onFinishLesson={() => setScreen("QUESTION")}
            onStopForNow={() => setScreen("WELCOME")}
          />
        )}
        {screen === "SUMMARY" && (
          <Summary
            answeredCount={answeredCount || 1}
            skillsSummary={[
              { concept: "range-values", label: "Numbers that range() gives", status: "GOT_IT" },
              { concept: "indent-repeat", label: "Which lines repeat", status: "GETTING_THERE" },
              { concept: "accumulator", label: "Keeping a running total", status: "NOT_PRACTISED" }
            ]}
            nextFocus="Which lines repeat"
            onPractiseAgain={() => {
              setAnsweredCount(0);
              setScreen("WELCOME");
            }}
            onGoAbout={goToAbout}
          />
        )}
        {screen === "ABOUT" && (
          <About onBack={backFromAbout} />
        )}
      </main>
      <Footer />
    </div>
  );
}
