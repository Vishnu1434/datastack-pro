import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";
import { CheckCircle, XCircle, Shuffle } from "lucide-react";
import { iconForStack, difficultyBadge, filterQuestions } from "../../utils/common.jsx";

// Utility: shuffle array
const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

export default function MCQMode({ difficulty = [], techStack = [], topic = [] }) {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(true);

    // score counters
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [skippedCount, setSkippedCount] = useState(0);

    useEffect(() => {
        let mounted = true;
        async function fetchQuestions() {
            const data = await loadQuestions("mcqs");
            const mcqs = Array.isArray(data)
                ? data.filter((q) => q.type === "mcq" && q.options)
                : [];
            if (!mounted) return;
            setAllQuestions(mcqs);
            setQuestions(filterQuestions(mcqs, { difficulties: difficulty, techStacks: techStack, topics: topic }));
            setLoading(false);
        }
        fetchQuestions();
        return () => (mounted = false);
    }, []);

    useEffect(() => {
        const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: techStack, topics: topic });
        setQuestions(filtered);
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSkippedCount(0);
    }, [difficulty, techStack, topic, allQuestions]);

    const handleSelect = (optKey) => {
        if (answered) return;
        const q = questions[current];
        if (!q) return;
        setSelected(optKey);
        setAnswered(true);

        if (optKey === q.answer) {
            setCorrectCount((p) => p + 1);
        } else {
            setIncorrectCount((p) => p + 1);
        }
    };

    const handleNext = () => {
        if (!answered) {
            setSkippedCount((p) => p + 1);
        }
        setSelected(null);
        setAnswered(false);
        setCurrent((prev) => Math.min(prev + 1, Math.max(questions.length - 1, 0)));
    };

    const handleReset = () => {
        const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: techStack, topics: topic });
        setQuestions(shuffleArray([...filtered]));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSkippedCount(0);
    };

    const handleShuffle = () => {
        setQuestions((prev) => shuffleArray([...prev]));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSkippedCount(0);
    };

    if (loading) return <p>Loading MCQs...</p>;
    if (!questions.length) return <p>No questions match current filters.</p>;

    const q = questions[current] || null;
    const options = Object.entries(q.options || {});

    return (
        <div className="flex flex-col flex-1 h-screen gap-6 p-6 bg-gray-50 rounded-xl shadow-md">
            {/* Top bar: stats on left, actions on right */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mcq-stats">
                            <button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg shadow-sm">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">{correctCount} Correct</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg shadow-sm">
                                <XCircle size={16} />
                                <span className="text-sm font-medium">{incorrectCount} Incorrect</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg shadow-sm">
                                <span className="text-sm font-medium">{skippedCount} Skipped</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleShuffle}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Shuffle size={16} /> Shuffle
                        </button>
                    </div>
                </div>

                {/* Question header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center text-blue-600">
                            {iconForStack(q.stack || q.source || "")}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{q.question}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {difficultyBadge(q.difficulty)}
                        <div className="text-sm text-gray-500">{current + 1}/{questions.length}</div>
                    </div>
                </div>
            </div>

            {/* Options */}
            <ul className="space-y-2">
                {Object.entries(q.options).map(([key, value], i) => {
                    const isSelected = selected === key;
                    const isCorrect = q.answer === key;

                    return (
                        <li
                            key={key}
                            onClick={() => handleSelect(key)}
                            className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition
                            ${
                                answered
                                    ? isCorrect
                                        ? "bg-green-100 border-green-400 text-green-800"
                                        : isSelected
                                            ? "bg-red-100 border-red-400 text-red-800"
                                            : "bg-white border-gray-200"
                                    : "bg-white hover:bg-gray-50 border-gray-200"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    {answered && isCorrect ? (
                                        <CheckCircle className="text-green-600" size={18} />
                                    ) : answered && isSelected && !isCorrect ? (
                                        <XCircle className="text-red-600" size={18} />
                                    ) : (
                                        <span className="text-gray-500">{String.fromCharCode(65 + i)}</span>
                                    )}
                                </div>
                                <div className="text-sm font-medium">{value}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Footer with only Next button */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <button
                    onClick={handleNext}
                    disabled={current >= questions.length - 1}
                    className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
