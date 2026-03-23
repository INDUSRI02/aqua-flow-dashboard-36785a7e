import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const questions = [
  { q: "How much of Earth's water is freshwater?", options: ["3%", "10%", "25%", "50%"], answer: 0 },
  { q: "What uses the most freshwater globally?", options: ["Industry", "Households", "Agriculture", "Energy"], answer: 2 },
  { q: "How many liters does a 10-min shower use?", options: ["20L", "50L", "80L", "120L"], answer: 2 },
  { q: "What is the best time to water plants?", options: ["Noon", "Evening", "Early morning", "Midnight"], answer: 2 },
  { q: "A dripping tap wastes how much per year?", options: ["500L", "1000L", "3000L", "10000L"], answer: 2 },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl"
          >
            🎉
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Quiz Complete!
          </motion.h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="gradient-primary text-primary-foreground rounded-2xl px-8 py-4 text-center"
          >
            <p className="text-4xl font-bold">{score}/{questions.length}</p>
            <p className="text-sm opacity-80">Correct Answers</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setCurrent(0); setScore(0); setSelected(null); setFinished(false); }}
            className="rounded-lg border border-primary px-6 py-2 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </PageTransition>
    );
  }

  const q = questions[current];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">🎯 Quiz & Challenges</h1>
          <p className="text-muted-foreground">Test your water conservation knowledge!</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < current ? "gradient-primary" : i === current ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <p className="text-sm text-muted-foreground mb-2">Question {current + 1} of {questions.length}</p>
              <h3 className="text-xl font-semibold text-foreground mb-6">{q.q}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  let style = "border-border hover:border-primary hover:bg-muted/50";
                  if (selected !== null) {
                    if (i === q.answer) style = "border-secondary bg-secondary/10";
                    else if (i === selected) style = "border-destructive bg-destructive/10";
                  }
                  return (
                    <motion.button
                      key={i}
                      whileHover={selected === null ? { scale: 1.03 } : {}}
                      whileTap={selected === null ? { scale: 0.97 } : {}}
                      onClick={() => handleAnswer(i)}
                      className={`rounded-lg border p-4 text-left font-medium transition-all text-foreground ${style}`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Quiz;
