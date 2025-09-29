import React, { useState, useEffect, useRef } from "react";
import { loadQuestions } from "../practicePage.jsx";
import { filterQuestions } from "../../utils/common.jsx";
import { Flame, Skull } from "lucide-react";

function SurvivalMode({ difficulty = [], techStack = [], topic = [] }) {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        let mounted = true;
        async function fetchQuestions() {
            const mcqs = await loadQuestions("mcqs");
            if (!mounted) return;

            setAllQuestions(mcqs);
            const filtered = filterQuestions(mcqs, { difficulties: difficulty, techStacks: techStack, topics: topic });
            setQuestions(filtered.sort(() => 0.5 - Math.random()));
            setLoading(false);
        }
        fetchQuestions();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: techStack, topics: topic });
        setQuestions(filtered.sort(() => 0.5 - Math.random()));
        setCurrent(0);
        setStreak(0);
        setSelected(null);
        setShowFeedback(false);
        setGameOver(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, [difficulty, techStack, topic, allQuestions]);

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    if (loading) return <p>Loading survival mode...</p>;
    if (!questions.length) return <p>No questions match current filters.</p>;

    const question = questions[current];

    const moveNext = () => {
        setCurrent((prev) => (prev + 1) % questions.length);
        setSelected(null);
        setShowFeedback(false);
    };

    const restart = () => {
        setStreak(0);
        setCurrent(0);
        setSelected(null);
        setShowFeedback(false);
        setGameOver(false);
        setQuestions((prev) => prev.slice().sort(() => 0.5 - Math.random()));
    };

    const selectAnswer = (optKey) => {
        if (showFeedback || gameOver) return;
        setSelected(optKey);
        const isCorrect = optKey === question.answer;
        if (isCorrect) {
            setShowFeedback(true);
            timerRef.current = setTimeout(() => {
                setStreak((s) => s + 1);
                moveNext();
            }, 800);
        } else {
            setShowFeedback(true);
            setGameOver(true);
        }
    };

    const optionClasses = (key) => {
        const base = "p-4 rounded-lg border flex items-center justify-between transition select-none";
        const isCorrectKey = key === question.answer;
        const isSelected = selected === key;

        if (showFeedback) {
            if (isCorrectKey) return `${base} bg-green-100 border-green-400 text-green-800`;
            if (isSelected) return `${base} bg-red-100 border-red-400 text-red-800`;
            return `${base} bg-white border-gray-200`;
        }

        // Before feedback is shown
        return `${base} bg-white hover:bg-gray-50 border-gray-200 cursor-pointer`;
    };

    return (
        <div className="px-4 py-6">
            {/* Streak badge */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 shadow-sm text-blue-700">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">Streak</span>
                    <span className="text-lg font-extrabold tabular-nums">{streak}</span>
                </div>
            </div>

            <div className="text-center space-y-6">
                <h3 className="text-lg font-bold">{question.question}</h3>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto text-left">
                    {Object.entries(question.options).map(([key, opt]) => (
                        <li
                            key={key}
                            onClick={() => selectAnswer(key)}
                            className={optionClasses(key)}
                            role="button"
                            tabIndex={0}
                            aria-disabled={showFeedback || gameOver}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>

                {gameOver && (
                    <div className="max-w-md mx-auto w-full mt-6">
                        <div className="rounded-lg border border-red-400 bg-red-100 p-4 shadow-sm text-center">
                            <div className="flex items-center justify-center gap-2 text-red-700 font-semibold">
                                <Skull className="h-5 w-5" />
                                <span>Game Over</span>
                            </div>
                            <p className="mt-1 text-red-700">Final streak: <span className="font-bold">{streak}</span></p>
                            <div className="mt-3 flex justify-center">
                                <button onClick={restart} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm">
                                    Restart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SurvivalMode;
