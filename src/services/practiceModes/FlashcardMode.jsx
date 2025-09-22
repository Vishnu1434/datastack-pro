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

// Inline monochrome SVG icons for known stacks
const SparkIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2s1.5 3 4 4c0 0-1 3-1 5s1 4 1 4-3 0-5 1-4 2-4 2 1-3 1-6-2-6-2-6 3 1 5-1 2-3 2-3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PythonIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v3a3 3 0 0 1-3 3H6v3h3a6 6 0 0 0 6-6V3h-3z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21v-3a3 3 0 0 0 3-3h3v-3h-3a6 6 0 0 1-6 6v3z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const JavaIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 7c0 0 2-1 4-1s4 1 4 1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12s1 1 3 1 3-1 3-1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3v2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SQLIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.2" />
    <path d="M8 8h8M8 12h8M8 16h5" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const AirflowIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3" strokeWidth="1.2" />
    <path d="M5 21s3-4 7-4 7 4 7 4" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const iconForStack = (stack) => {
  if (!stack) return null;
  const s = stack.toLowerCase();
  if (s.includes("spark")) return <SparkIcon />;
  if (s.includes("python")) return <PythonIcon />;
  if (s.includes("java")) return <JavaIcon />;
  if (s.includes("sql")) return <SQLIcon />;
  if (s.includes("airflow")) return <AirflowIcon />;
  if (s.includes("pyspark")) return <SparkIcon />;
  return null;
};

const DifficultyBadge = ({ level }) => {
  const lvl = (level || "").toLowerCase();
  const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block";
  if (lvl === "easy") return <span className={`${base} bg-green-100 text-green-800 border border-green-200`}>Easy</span>;
  if (lvl === "medium") return <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-200`}>Medium</span>;
  if (lvl === "hard") return <span className={`${base} bg-red-100 text-red-800 border border-red-200`}>Hard</span>;
  return <span className={`${base} bg-gray-100 text-gray-800 border border-gray-200`}>{level || "N/A"}</span>;
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

  const toggleAnswer = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const shuffleQuestions = () => setQuestions((prev) => shuffleArray(prev));

  if (!questions.length) return <p>Loading flashcards...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Theory Questions ({questions.length})</h3>
        <div className="flex items-center gap-2">
          <button onClick={shuffleQuestions} aria-label="Shuffle questions" className="flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm hover:shadow">
            <Shuffle size={16} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q, idx) => {
          const stackLabel = q.stack || q.source || (q.tags && q.tags[0]) || "";
          const Icon = iconForStack(stackLabel);
          return (
            <article key={`${q.question}-${idx}`} className="bg-white border rounded-md shadow-sm p-4 flex flex-col h-full">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-gray-700">
                  {Icon ? (
                    <div className="w-10 h-10 flex items-center justify-center text-black">
                      {Icon}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                      {(stackLabel || "?")
                        .toString()
                        .split(/[^A-Za-z0-9]+/)
                        .filter(Boolean)
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 break-words">{q.question}</h4>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">{stackLabel}</div>

                    <div className="flex items-center gap-3">
                      <DifficultyBadge level={q.difficulty} />

                      <button
                        onClick={() => toggleAnswer(idx)}
                        aria-expanded={openIndex === idx}
                        aria-label={openIndex === idx ? "Hide answer" : "Show answer"}
                        className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 border"
                      >
                        <BookOpen size={18} className={`${openIndex === idx ? "text-blue-600" : "text-gray-700"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {openIndex === idx && (
                <div className="mt-3 text-gray-700 text-sm border-t pt-3">
                  {q.answer}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
