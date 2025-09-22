import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";
import { BookOpen, Shuffle } from "lucide-react";

const shuffleArray = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const iconForStack = (stack) => {
  if (!stack) return null;
  const s = stack.toLowerCase();
  if (s.includes("spark")) return "⚡";
  if (s.includes("python")) return "🐍";
  if (s.includes("java")) return "☕";
  if (s.includes("sql")) return "🗄️";
  if (s.includes("airflow")) return "🌬️";
  return "📘";
};

const DifficultyBadge = ({ level }) => {
  const lvl = (level || "").toLowerCase();
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  if (lvl === "easy") return <span className={`${base} bg-green-100 text-green-700`}>Easy</span>;
  if (lvl === "medium") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Medium</span>;
  if (lvl === "hard") return <span className={`${base} bg-red-100 text-red-700`}>Hard</span>;
  return <span className={`${base} bg-gray-100 text-gray-700`}>{level || "N/A"}</span>;
};

export default function FlashcardMode() {
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchQuestions() {
      const data = await loadQuestions("theory");
      const theoryQs = Array.isArray(data) ? data.filter((q) => q.type === "theory") : [];
      if (!mounted) return;
      setQuestions(theoryQs);
    }
    fetchQuestions();
    return () => (mounted = false);
  }, []);

  const toggleAnswer = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));
  const shuffleQuestions = () => setQuestions((prev) => shuffleArray(prev));

  if (!questions.length) return <p>Loading flashcards...</p>;

  return (
      <div className="flex flex-col min-h-[50vh] max-h-[70vh] h-auto bg-gray-50 rounded-md shadow overflow-hidden">
        {/* Header - stays fixed, no scroll */}
        <div className="flex items-center justify-between p-3 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">
            <span className="text-blue-600">Theory</span> Questions ({questions.length})
          </h3>
          <button
              onClick={shuffleQuestions}
              aria-label="Shuffle questions"
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>

        {/* Only this container scrolls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {questions.map((q, idx) => (
              <article
                  key={`${q.question}-${idx}`}
                  className="bg-white rounded-md shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    {iconForStack(q.stack || q.source || "")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{q.question}</h4>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <DifficultyBadge level={q.difficulty} />
                        <button
                            onClick={() => toggleAnswer(idx)}
                            className={`p-2 rounded-md transition ${
                                openIndex === idx
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          <BookOpen size={18} />
                        </button>
                      </div>
                    </div>

                    {openIndex === idx && (
                        <div className="mt-3 text-gray-700 text-sm border-t pt-3">{q.answer}</div>
                    )}
                  </div>
                </div>
              </article>
          ))}
        </div>
      </div>
  );
}
