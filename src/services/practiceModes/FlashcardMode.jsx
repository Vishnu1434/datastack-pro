import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";
import { BookOpen, Shuffle } from "lucide-react";

// Small util to shuffle an array (Fisher-Yates)
const shuffleArray = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// Render a simple monochrome stack icon (initials inside a circle)
const StackIcon = ({ stack }) => {
    const initials = (stack || "?")
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-xs font-semibold flex-shrink-0">
            {initials}
        </div>
    );
};

// Stylish difficulty badge
const DifficultyBadge = ({ level }) => {
    const lvl = (level || "").toLowerCase();
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block";
    if (lvl === "easy") return <span className={`${base} bg-green-100 text-green-800 border border-green-200`}>Easy</span>;
    if (lvl === "medium") return <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-200`}>Medium</span>;
    if (lvl === "hard") return <span className={`${base} bg-red-100 text-red-800 border border-red-200`}>Hard</span>;
    return <span className={`${base} bg-gray-100 text-gray-800 border border-gray-200`}>{level || "N/A"}</span>;
};

function FlashcardMode() {
    const [questions, setQuestions] = useState([]);
    const [openAnswers, setOpenAnswers] = useState({});

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

    if (!questions.length) return <p>Loading flashcards...</p>;

    const toggleAnswer = (idx) => {
        setOpenAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const shuffleQuestions = () => setQuestions((prev) => shuffleArray(prev));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Theory Questions ({questions.length})</h3>
                <button
                    onClick={shuffleQuestions}
                    aria-label="Shuffle questions"
                    className="flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm hover:shadow"
                >
                    <Shuffle size={16} />
                    <span className="hidden sm:inline">Shuffle</span>
                </button>
            </div>

            <div className="bg-white border rounded-md shadow-sm overflow-auto" style={{ maxHeight: 420 }}>
                <ul className="divide-y">
                    {questions.map((q, idx) => (
                        <li key={`${q.question}-${idx}`} className="flex items-start gap-4 p-3">
                            <div className="flex items-start gap-3 w-full">
                                <div className="flex-shrink-0">
                                    <StackIcon stack={q.stack || q.source || q.tag || "?"} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="text-sm font-medium text-gray-900 break-words">{q.question}</div>
                                        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                                            <DifficultyBadge level={q.difficulty} />
                                            <button
                                                onClick={() => toggleAnswer(idx)}
                                                aria-expanded={!!openAnswers[idx]}
                                                aria-label={openAnswers[idx] ? "Hide answer" : "Show answer"}
                                                className="p-2 rounded hover:bg-gray-100"
                                            >
                                                <BookOpen size={18} className="text-gray-700" />
                                            </button>
                                        </div>
                                    </div>

                                    {openAnswers[idx] && (
                                        <div className="mt-2 text-gray-700 text-sm">
                                            {q.answer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FlashcardMode;
