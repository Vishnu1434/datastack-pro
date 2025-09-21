import React, { useState, useEffect } from "react";
import { loadTheoryQuestions } from "../theoryPage.js";

function ExamSimulationMode() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 min
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        async function fetchQuestions() {
            const data = await loadTheoryQuestions();
            const mcqs = data.filter((q) => q.type === "mcq");
            setQuestions(mcqs.slice(0, 10)); // 10 Q exam
        }
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !finished) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setFinished(true);
        }
    }, [timeLeft, finished]);

    if (!questions.length) return <p>Loading exam...</p>;

    const question = questions[current];

    const selectAnswer = (opt) => {
        setAnswers({ ...answers, [current]: opt });
    };

    const handleNext = () => {
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        const score = questions.filter(
            (q, i) => answers[i] === q.correct
        ).length;
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Exam Finished</h3>
                <p>Your Score: {score} / {questions.length}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-right font-mono">
                Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2,"0")}
            </p>
            <h3 className="text-lg font-bold">{question.question}</h3>
            <ul className="space-y-2">
                {question.options.map((opt, i) => (
                    <li
                        key={i}
                        onClick={() => selectAnswer(opt)}
                        className={`p-3 border rounded cursor-pointer ${
                            answers[current] === opt ? "bg-blue-200" : "hover:bg-gray-100"
                        }`}
                    >
                        {opt}
                    </li>
                ))}
            </ul>
            <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {current + 1 < questions.length ? "Next" : "Submit"}
            </button>
        </div>
    );
}

export default ExamSimulationMode;
