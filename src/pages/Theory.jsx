import React, { useState, useEffect } from "react";
import { loadTheoryQuestions } from "../services/theoryPage";

function TheoryPage() {
    const [questions, setQuestions] = useState([]);
    const [selectedStack, setSelectedStack] = useState("all");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await loadTheoryQuestions();
                setQuestions(data);
            } catch (err) {
                console.error("Failed to load questions:", err);
                setError("Could not load questions. Please try again later.");
            }
        }
        fetchQuestions();
    }, []);

    // Unique stack list
    const stacks = ["all", ...new Set(questions.map((q) => q.stack))];

    // Filtered questions
    const filteredQuestions =
        selectedStack === "all"
            ? questions
            : questions.filter((q) => q.stack === selectedStack);

    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-800 rounded-lg border border-red-200">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">Theory Questions</h2>
            <p className="text-gray-600">
                Dive deep into the core concepts of data engineering.
            </p>

            {/* Dropdown */}
            <div className="flex items-center space-x-3">
                <label htmlFor="stack" className="font-medium text-gray-700">
                    Filter by Tech Stack:
                </label>
                <select
                    id="stack"
                    value={selectedStack}
                    onChange={(e) => setSelectedStack(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    {stacks.map((stack) => (
                        <option key={stack} value={stack}>
                            {stack === "all" ? "All Stacks" : stack.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Questions */}
            {filteredQuestions.length === 0 ? (
                <p className="text-gray-500">No questions available for this stack.</p>
            ) : (
                filteredQuestions.map((q) => (
                    <div
                        key={q.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-700">
                            {q.id}. {q.question}
                        </h3>
                        <details className="mt-2 p-3 bg-white rounded-lg border">
                            <summary className="font-semibold text-gray-700 cursor-pointer">
                                Show Answer
                            </summary>
                            <p className="mt-2 text-gray-600">{q.answer}</p>
                        </details>
                    </div>
                ))
            )}
        </div>
    );
}

export default TheoryPage;
