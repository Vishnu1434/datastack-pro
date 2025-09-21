import React, { useState, useEffect } from "react";
import { loadTheoryQuestions } from "../theoryPage.js";

function DailyChallengeMode() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function fetchQuestions() {
            const data = await loadTheoryQuestions();
            const daily = data.sort(() => 0.5 - Math.random()).slice(0, 5); // 5 random Qs
            setQuestions(daily);
        }
        fetchQuestions();
    }, []);

    if (!questions.length) return <p>Loading daily challenge...</p>;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Today's Challenge</h3>
            {questions.map((q) => (
                <div key={q.id} className="p-4 border rounded">
                    <h4 className="font-semibold">{q.question}</h4>
                    {q.type === "theory" ? (
                        <details className="mt-2">
                            <summary className="text-blue-600">Show Answer</summary>
                            <p className="mt-2">{q.answer}</p>
                        </details>
                    ) : (
                        <ul className="mt-2 space-y-1">
                            {q.options.map((opt, i) => (
                                <li key={i} className="p-2 border rounded hover:bg-gray-100">
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

export default DailyChallengeMode;
