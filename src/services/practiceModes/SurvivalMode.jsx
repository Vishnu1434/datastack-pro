import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";
import { filterQuestions } from "../../utils/common.jsx";

function SurvivalMode({ difficulty = [], techStack = [], topic = [] }) {
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [alive, setAlive] = useState(true);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchQuestions() {
            const data = await loadQuestions();
            const mcqs = Array.isArray(data) ? data.filter((q) => q.type === "mcq") : [];
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
        setAlive(true);
        setStreak(0);
    }, [difficulty, techStack, topic, allQuestions]);

    if (loading) return <p>Loading survival mode...</p>;
    if (!questions.length) return <p>No questions match current filters.</p>;

    if (!alive) {
        return (
            <div className="space-y-4 text-center">
                <h3 className="text-xl font-bold text-red-600">Game Over!</h3>
                <p>Your streak: {streak}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Restart
                </button>
            </div>
        );
    }

    const question = questions[current];

    const selectAnswer = (opt) => {
        if (opt === question.correct) {
            setStreak((s) => s + 1);
            setCurrent((prev) => (prev + 1) % questions.length);
        } else {
            setAlive(false);
        }
    };

    return (
        <div className="space-y-4 text-center">
            <p className="font-mono">Streak: {streak}</p>
            <h3 className="text-lg font-bold">{question.question}</h3>
            <ul className="space-y-2">
                {question.options.map((opt, i) => (
                    <li
                        key={i}
                        onClick={() => selectAnswer(opt)}
                        className="p-3 border rounded cursor-pointer hover:bg-gray-100"
                    >
                        {opt}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SurvivalMode;
