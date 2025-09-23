import React, { useState, useEffect } from "react";
import { loadQuestions } from "../practicePage.js";
import { CheckCircle, XCircle, Shuffle } from "lucide-react";

import SparkIcon from "../../icons/spark.svg";
import PythonIcon from "../../icons/python.svg";
import JavaIcon from "../../icons/java.svg";
import SqlIcon from "../../icons/sql.svg";
import AirflowIcon from "../../icons/airflow.svg";
import DefaultIcon from "../../icons/default.svg";

const iconForStack = (stack) => {
    if (!stack) return <img src={DefaultIcon} alt="Default" className="w-6 h-6" />;
    const s = stack.toLowerCase();
    if (s.includes("spark")) return <img src={SparkIcon} alt="Spark" className="w-6 h-6" />;
    if (s.includes("python")) return <img src={PythonIcon} alt="Python" className="w-6 h-6" />;
    if (s.includes("java")) return <img src={JavaIcon} alt="Java" className="w-6 h-6" />;
    if (s.includes("sql")) return <img src={SqlIcon} alt="SQL" className="w-6 h-6" />;
    if (s.includes("airflow")) return <img src={AirflowIcon} alt="Airflow" className="w-6 h-6" />;
    return <img src={DefaultIcon} alt="Default" className="w-6 h-6" />;
};

const DifficultyBadge = ({ level }) => {
    const lvl = (level || "").toLowerCase();
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (lvl === "easy") return <span className={`${base} bg-green-100 text-green-700`}>Easy</span>;
    if (lvl === "medium") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Medium</span>;
    if (lvl === "hard") return <span className={`${base} bg-red-100 text-red-700`}>Hard</span>;
    return <span className={`${base} bg-gray-100 text-gray-700`}>{level || "N/A"}</span>;
};

// Utility: shuffle array
const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

export default function MCQMode() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchQuestions() {
            const data = await loadQuestions("mcqs");
            const mcqs = Array.isArray(data)
                ? data.filter((q) => q.type === "mcq" && q.options)
                : [];
            if (!mounted) return;
            setQuestions(mcqs);
        }
        fetchQuestions();
        return () => (mounted = false);
    }, []);

    const handleSelect = (optKey) => {
        if (answered) return;
        setSelected(optKey);
        setAnswered(true);
    };

    const handleNext = () => {
        setSelected(null);
        setAnswered(false);
        setCurrent((prev) => Math.min(prev + 1, questions.length - 1));
    };

    const handleReset = () => {
        setSelected(null);
        setAnswered(false);
        setCurrent(0);
    };

    const handleShuffle = () => {
        setQuestions((prev) => shuffleArray([...prev]));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
    };

    if (!questions.length) return <p>Loading MCQs...</p>;

    const q = questions[current] || null;
    const options = Object.entries(q.options || {});

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-6 p-6 bg-gray-50 rounded-xl shadow-md">
            {/* Question header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-blue-600">
                        {iconForStack(q.stack || q.source || "")}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{q.question}</h3>
                </div>

                <div className="flex items-center gap-3">
                    <DifficultyBadge level={q.difficulty} />
                    <div className="text-sm text-gray-500">
                        {current + 1}/{questions.length}
                    </div>
                </div>
            </div>

            {/* Options */}
            <ul className="space-y-2">
                {Object.entries(q.options).map(([key, value], i) => {
                    const isSelected = selected === key;
                    const isCorrect = q.answer === key; // 👈 compare against key, not value

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

            {/* Footer buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                    Reset
                </button>
                <button
                    onClick={handleShuffle}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                    <Shuffle size={16} /> Shuffle
                </button>
                <button
                    onClick={handleNext}
                    disabled={current >= questions.length - 1}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
