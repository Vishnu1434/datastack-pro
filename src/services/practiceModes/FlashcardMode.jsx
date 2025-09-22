import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";

function FlashcardMode() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        async function fetchQuestions() {
            const data = await loadQuestions("theory");
            const theoryQs = data.filter((q) => q.type === "theory");
            setQuestions(theoryQs);
        }
        fetchQuestions();
    }, []);

    if (!questions.length) return <p>Loading flashcards...</p>;

    const nextQuestion = () =>
        setCurrent((prev) => (prev + 1) % questions.length);

    return (
        <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold">{questions[current].question}</h3>
            <details className="mt-2 cursor-pointer">
                <summary className="text-blue-600">Show Answer</summary>
                <p className="mt-2 text-gray-700">{questions[current].answer}</p>
            </details>
            <button
                onClick={nextQuestion}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Next
            </button>
        </div>
    );
}

export default FlashcardMode;
