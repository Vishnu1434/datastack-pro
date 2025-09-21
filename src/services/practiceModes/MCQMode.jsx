import React, { useState, useEffect } from "react";
import { loadTheoryQuestions } from "../theoryPage.js";

function MCQMode() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        async function fetchQuestions() {
            const data = await loadTheoryQuestions();
            const mcqs = data.filter((q) => q.type === "mcq");
            setQuestions(mcqs);
        }
        fetchQuestions();
    }, []);

    if (!questions.length) return <p>Loading MCQs...</p>;

    const question = questions[current];

    const handleNext = () => {
        setSelected(null);
        setCurrent((prev) => (prev + 1) % questions.length);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">{question.question}</h3>
            <ul className="space-y-2">
                {question.options.map((opt, i) => (
                    <li
                        key={i}
                        onClick={() => setSelected(opt)}
                        className={`p-3 border rounded cursor-pointer ${
                            selected
                                ? opt === question.correct
                                    ? "bg-green-200 border-green-400"
                                    : selected === opt
                                        ? "bg-red-200 border-red-400"
                                        : "bg-gray-100"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {opt}
                    </li>
                ))}
            </ul>
            {selected && (
                <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Next Question
                </button>
            )}
        </div>
    );
}

export default MCQMode;
