import React, { useState, useEffect, useRef } from "react";
import { loadQuestions } from "../practicePage.js";
import { CheckCircle, XCircle, Shuffle } from "lucide-react";
import { iconForStack, difficultyBadge, filterQuestions } from "../../utils/common.jsx";

// Utility: shuffle array
const shuffleArray = (arr) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

export default function MCQMode({ difficulty = [], techStack = [], topic = [], practiceType = "Self-Paced", onExamStateChange = () => {} }) {
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

    // exam state: idle | running | ended
    const [examState, setExamState] = useState("idle");

    // timers (seconds)
    const [totalRemaining, setTotalRemaining] = useState(0);
    const [questionRemaining, setQuestionRemaining] = useState(0);
    const timerRef = useRef(null);

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

    useEffect(() => {
        // notify parent of state changes
        onExamStateChange(examState);
    }, [examState]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startExam = () => {
        if (!questions.length) return;
        // default durations (seconds)
        const perQuestionDefault = 30; // 30s per question
        if (practiceType === "Overall Time") {
            const total = Math.max(questions.length * perQuestionDefault, 60);
            setTotalRemaining(total);
            setQuestionRemaining(0);
        } else if (practiceType === "Per Question Time") {
            setQuestionRemaining(perQuestionDefault);
            setTotalRemaining(0);
        }
        setExamState("running");

        timerRef.current = setInterval(() => {
            setTotalRemaining((prev) => {
                if (practiceType === "Overall Time") {
                    if (prev <= 1) {
                        endExam();
                        return 0;
                    }
                    return prev - 1;
                }
                return prev;
            });

            setQuestionRemaining((prevQ) => {
                if (practiceType === "Per Question Time") {
                    if (prevQ <= 1) {
                        // treat as skipped if not answered
                        if (!answered) setSkippedCount((p) => p + 1);
                        // move to next question or end
                        setSelected(null);
                        setAnswered(false);
                        setCurrent((prev) => {
                            const nxt = Math.min(prev + 1, Math.max(questions.length - 1, 0));
                            // if last question reached, end
                            if (nxt >= questions.length - 1) {
                                // end after small delay to allow UI update
                                setTimeout(() => endExam(), 300);
                            }
                            return nxt;
                        });
                        // reset per question timer
                        return 30;
                    }
                    return prevQ - 1;
                }
                // For overall mode we still optionally show a per-question timer derived from totalRemaining
                return prevQ;
            });
        }, 1000);
    };

    const endExam = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setExamState("ended");
    };

    const handleSelect = (optKey) => {
        if (examState === "running" || examState === "idle") {
            // allow selection in running mode only; in idle selection shouldn't happen (UI blocks)
        }
        if (answered || examState !== "running") return;
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
        if (examState === "running") {
            if (!answered) {
                setSkippedCount((p) => p + 1);
            }
            setSelected(null);
            setAnswered(false);
            setCurrent((prev) => Math.min(prev + 1, Math.max(questions.length - 1, 0)));
            // reset per-question timer if in per-question mode
            if (practiceType === "Per Question Time") {
                setQuestionRemaining(30);
            }
            return;
        }

        // non-running behavior: move to next as normal
        if (!answered) {
            setSkippedCount((p) => p + 1);
        }
        setSelected(null);
        setAnswered(false);
        setCurrent((prev) => Math.min(prev + 1, Math.max(questions.length - 1, 0)));
    };

    const handleReset = () => {
        if (examState === "running") return;
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
        if (examState === "running") return;
        setQuestions((prev) => shuffleArray([...prev]));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSkippedCount(0);
    };

    if (loading)
        return (
            <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <div className="mb-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin" />
                    </div>
                    <div className="text-sm text-gray-700 font-medium">Loading MCQs...</div>
                </div>
            </div>
        );
    if (!questions.length) return <p>No questions match current filters.</p>;

    const q = questions[current] || null;

    // helper to format seconds
    const fmt = (s) => {
        const mm = Math.floor(s / 60)
            .toString()
            .padStart(2, "0");
        const ss = Math.floor(s % 60)
            .toString()
            .padStart(2, "0");
        return `${mm}:${ss}`;
    };

    return (
        <div className="flex flex-col flex-1 h-screen gap-6 p-6 bg-gray-50 rounded-xl shadow-md">
            {/* Top bar: stats on left, actions on right */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mcq-stats">
                            {/* Hide live scoring while exam running, but keep counts updating */}
                            {examState !== "running" && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* While exam running hide Reset and Shuffle; otherwise show */}
                        {examState !== "running" && (
                            <>
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
                            </>
                        )}
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

            {/* If practice is timed and exam not started, show centered info + start button */}
            {(practiceType === "Overall Time" || practiceType === "Per Question Time") && examState === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">{practiceType} Mode</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {practiceType === "Overall Time"
                                ? "A total time will be allotted to solve all questions. Apply filters now and click Start to begin the timed session. Live scoring will be hidden during the run and revealed at the end."
                                : "Each question will have a fixed time limit. Apply filters now and click Start to begin. Live scoring will be hidden during the run and revealed at the end."}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={startExam}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* If exam running show question UI but hide live stats; show timer and End button */}
            {examState === "running" && (
                <>
                    {/* Timer display */}
                    <div className="flex items-center justify-center text-sm text-gray-700 gap-4">
                        {practiceType === "Overall Time" && <div>Total time left: <strong>{fmt(totalRemaining)}</strong></div>}
                        {practiceType === "Per Question Time" && <div>Question time left: <strong>{fmt(questionRemaining)}</strong></div>}
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

                    {/* Footer with Next and End button */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={handleNext}
                            disabled={current >= questions.length - 1}
                            className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                        <button
                            onClick={endExam}
                            className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            End
                        </button>
                    </div>
                </>
            )}

            {/* Normal (non-running) mode: show full UI (options + actions) */}
            {examState !== "running" && !((practiceType === "Overall Time" || practiceType === "Per Question Time") && examState === "idle") && (
                <>
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

                    {/* Footer with only Next button (and Reset/Shuffle are in top actions) */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={handleNext}
                            disabled={current >= questions.length - 1}
                            className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* When exam ended show final score summary centered */}
            {examState === "ended" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded-lg shadow max-w-md text-center">
                        <h3 className="text-lg font-semibold mb-2">Exam Finished</h3>
                        <p className="text-sm text-gray-600 mb-4">Your scores for this session:</p>
                        <div className="flex items-center justify-around mb-4">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                                <div className="text-sm text-gray-500">Correct</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                                <div className="text-sm text-gray-500">Incorrect</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-700">{skippedCount}</div>
                                <div className="text-sm text-gray-500">Skipped</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => {
                                    // reset exam state and allow parent to enable filters again
                                    setExamState("idle");
                                    // keep scores visible until user interacts; parent already re-enabled filters
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
