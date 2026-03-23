import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Trophy, RotateCcw } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
}

const Quiz = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [pastScores, setPastScores] = useState<{ score: number; total: number; completed_at: string }[]>([]);

  const fetchQuestions = async () => {
    const { data } = await supabase.from("quiz_questions").select("id, question, options, correct_index");
    if (data && data.length > 0) {
      // Shuffle and pick 5
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 5);
      setQuestions(shuffled.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options as string[] : JSON.parse(q.options as any),
      })));
    }
    setLoading(false);
  };

  const fetchPastScores = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("quiz_results")
      .select("score, total, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(5);
    if (data) setPastScores(data);
  };

  useEffect(() => { fetchQuestions(); fetchPastScores(); }, [user]);

  const handleAnswer = async (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].correct_index;
    if (correct) setScore((s) => s + 1);

    setTimeout(async () => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        const finalScore = correct ? score + 1 : score;
        setFinished(true);
        // Save result
        if (user) {
          await supabase.from("quiz_results").insert({
            user_id: user.id,
            score: finalScore,
            total: questions.length,
          });
          fetchPastScores();
        }
      }
    }, 1000);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setLoading(true);
    fetchQuestions();
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  if (questions.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
          <p>No quiz questions available yet. Check back later!</p>
        </div>
      </PageTransition>
    );
  }

  if (finished) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl">
            🎉
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-foreground">
            Quiz Complete!
          </motion.h2>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="gradient-primary text-primary-foreground rounded-2xl px-8 py-4 text-center">
            <p className="text-4xl font-bold">{score}/{questions.length}</p>
            <p className="text-sm opacity-80">Correct Answers</p>
          </motion.div>

          {pastScores.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="w-full max-w-sm">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Trophy className="h-4 w-4" /> Recent Scores
              </h4>
              <div className="space-y-1">
                {pastScores.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-foreground">{s.score}/{s.total}</span>
                    <span className="text-muted-foreground text-xs">{new Date(s.completed_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={restart}
            className="rounded-lg border border-primary px-6 py-2 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" /> New Quiz
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
          <div className="flex gap-1 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < current ? "gradient-primary" : i === current ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }} className="rounded-xl border border-border bg-card p-8">
              <p className="text-sm text-muted-foreground mb-2">Question {current + 1} of {questions.length}</p>
              <h3 className="text-xl font-semibold text-foreground mb-6">{q.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  let style = "border-border hover:border-primary hover:bg-muted/50";
                  if (selected !== null) {
                    if (i === q.correct_index) style = "border-secondary bg-secondary/10";
                    else if (i === selected) style = "border-destructive bg-destructive/10";
                  }
                  return (
                    <motion.button key={i} whileHover={selected === null ? { scale: 1.03 } : {}} whileTap={selected === null ? { scale: 0.97 } : {}}
                      onClick={() => handleAnswer(i)} className={`rounded-lg border p-4 text-left font-medium transition-all text-foreground ${style}`}>
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
