import {resetStats} from "./practiceModes/MCQMode.jsx";
import {iconForStack} from "../utils/common.jsx";
import React, {useState} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const props = {
    techStack: ["java"],

    stack: "java",
    setStack: () => {},

    stackIndex: 0,
    setStackIndex: () => {},
    // State tracking answers per stack
    testMetrics: {
        python: {
            correctIds: [1, 3, 5],
            incorrectIds: [2, 4],
            skippedIds: [6],
        },
        java: {
            correctIds: [11, 12],
            incorrectIds: [13],
            skippedIds: [],
        },
    },

    // Full list of questions
    questions: [
        { id: 1, stack: "python", type: "mcq", topic: "Strings", difficulty: "easy", question: "Q1" },
        { id: 2, stack: "python", type: "mcq", topic: "Loops", difficulty: "medium", question: "Q2" },
        { id: 3, stack: "python", type: "mcq", topic: "Functions", difficulty: "easy", question: "Q3" },
        { id: 4, stack: "python", type: "mcq", topic: "Lists", difficulty: "hard", question: "Q4" },
        { id: 5, stack: "python", type: "mcq", topic: "Dicts", difficulty: "medium", question: "Q5" },
        { id: 6, stack: "python", type: "mcq", topic: "Strings", difficulty: "easy", question: "Q6" },
        { id: 7, stack: "python", type: "mcq", topic: "Sets", difficulty: "easy", question: "Q7" }, // unattempted

        { id: 11, stack: "java", type: "mcq", topic: "Arrays", difficulty: "easy", question: "Q11" },
        { id: 12, stack: "java", type: "mcq", topic: "Objects", difficulty: "medium", question: "Q12" },
        { id: 13, stack: "java", type: "mcq", topic: "Loops", difficulty: "hard", question: "Q13" },
        { id: 14, stack: "java", type: "mcq", topic: "Functions", difficulty: "easy", question: "Q14" }, // unattempted
    ],

    // Optional: total counts already computed (can match testMetrics)
    correctCount: 5,       // sum of correctIds across stacks
    incorrectCount: 3,     // sum of incorrectIds across stacks
    skippedCount: 1,       // sum of skippedIds across stacks
};


export function GetReport(localProps) {
    const {setStack, setStackIndex} = localProps;
    props.setStack = setStack;
    props.setStackIndex = setStackIndex;
    localProps = props;

    return (
        <div className="w-[90%] mx-auto my-8 transition duration-300 hover:shadow-xl">
            <div className="flex gap-6 h-full">
                {/* LEFT → Summary Report */}
                <div className="flex flex-col w-[30%] bg-white rounded-xl shadow-lg hover:shadow-xl p-4">
                    {getSummaryReport(localProps)}
                </div>

                {/* RIGHT → Detailed Report */}
                <div className="flex flex-col flex-1 bg-white rounded-xl shadow-lg hover:shadow-xl p-4">
                    {getDetailedReport(localProps)}
                </div>
            </div>
        </div>
    );
}

function getSummaryReport(localProps) {
    const {correctCount, incorrectCount, skippedCount, questions} = localProps;
    const totalQuestions = questions.length;
    const unattemptedCount = totalQuestions - correctCount - incorrectCount - skippedCount;

    const metrics = [
        { label: "Correct", count: correctCount, colorClass: "text-green-600" },
        { label: "Incorrect", count: incorrectCount, colorClass: "text-red-600" },
        { label: "Skipped", count: skippedCount, colorClass: "text-yellow-600" },
        { label: "Unattempted", count: unattemptedCount, colorClass: "text-gray-500" },
    ];

    return (
        <div>
            <div className="text-center mb-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Test Finished</h3>
                <p className="text-xs text-gray-600">Your performance summary:</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-5 flex justify-between items-center">
                <div className="text-sm font-semibold text-blue-700">Total Questions:</div>
                <div className="text-2xl font-extrabold text-blue-600">{totalQuestions}</div>
            </div>

            <div className="space-y-1.5">
                <div className="grid grid-cols-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-1.5">
                    <div className="text-left">Metric</div>
                    <div className="text-center">Count</div>
                    <div className="text-right">Percentage</div>
                </div>
                {metrics.map((metric) => (getSummaryRow(totalQuestions, metric)))}
            </div>

            <div className="flex items-center justify-center mt-6">
                <button onClick={() => resetStats(localProps)} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-300">
                    Close Results
                </button>
            </div>
        </div>
    )
}

function getDetailedReport(localProps) {
    const {stackIndex, testMetrics, questions, techStack} = localProps;

    const stack = techStack[stackIndex];
    console.log("stack index is: ", stackIndex);
    console.log("stack is: ", stack);

    const stackMetrics = testMetrics[stack];
    const {correctIds, incorrectIds, skippedIds} = stackMetrics;

    const stackQuestions = questions.filter(q => q.stack === stack);
    const stackQuestionsCount = stackQuestions.length;
    const attemptedCount  = correctIds.length + incorrectIds.length + skippedIds.length;
    const unattemptedCount = stackQuestionsCount - attemptedCount;

    const stackCount = techStack.length;
    console.log("stack count is: ", stackCount);

    return (
        <div>
            <div className="flex items-center justify-between p-4 bg-white/80 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">{iconForStack(stack)}</div>
                    <div>
                        <div className="font-semibold">{stack}</div>
                        <div className="text-xs text-gray-500">{stackQuestionsCount} questions • {attemptedCount} attempted</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Score</div>
                        <div className="text-lg font-bold text-blue-600">{getPercentage(correctIds.length, stackQuestionsCount)}%</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-2 text-sm mb-8">
                <div className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    Correct {correctIds.length}
                </div>
                <div className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                    Incorrect {incorrectIds.length}
                </div>
                <div className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
                    Skipped {skippedIds.length}
                </div>
                <div className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
                    Unattempted {unattemptedCount}
                </div>
            </div>
            <div className="min-h-[240px]">
                {suggestedTopics(stackQuestions, stackMetrics)}
            </div>

            <div className="flex items-center justify-center gap-4">
                <button onClick={() => handlePrevReport(localProps)} disabled={stackIndex <= 0} className="px-2 py-1 text-sm  bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" >
                    <ChevronLeft />
                </button>
                <button onClick={() => handleNextReport(localProps)} disabled={stackIndex >= techStack.length - 1} className="px-2 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" >
                    <ChevronRight />
                </button>
            </div>
        </div>
    )
}

function suggestedTopics(stackQuestions, stackMetrics) {
    const { correctIds, incorrectIds, skippedIds } = stackMetrics;

    // Track questions per topic
    const topicStats = {}; // { topic: { total: n, correct: m, attempted: k } }

    stackQuestions.forEach((q) => {
        const { topic, id } = q;

        if (!topicStats[topic]) {
            topicStats[topic] = { total: 0, correct: 0, attempted: 0 };
        }

        topicStats[topic].total += 1;

        if (correctIds.includes(id) || incorrectIds.includes(id) || skippedIds.includes(id)) {
            topicStats[topic].attempted += 1;
        }

        if (correctIds.includes(id)) {
            topicStats[topic].correct += 1;
        }
    });

    // Calculate score % per topic (based on attempted questions)
    const topicScores = Object.entries(topicStats).map(([topic, stats]) => {
        const percent = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
        return {topic, percent, correct: stats.correct, attempted: stats.attempted,
        };
    });

    // Separate into best and worst
    const bestTopics = topicScores.filter((t) => t.percent > 50).sort((a, b) => b.percent - a.percent).slice(0, 3);

    const worstTopics = topicScores.filter((t) => t.percent <= 50).sort((a, b) => a.percent - b.percent).slice(0, 3);

    return (
        <div className="text-sm font-semibold mb-2">
            <div className="flex gap-6">
                {/* Strongest Topics - Left */}
                <div className="flex-1">
                    <div className="mb-2 font-semibold">Strongest Topics</div>
                    {bestTopics.map((t) => (
                        <div key={t.topic} className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium truncate">{t.topic}</div>
                                    <div className="text-sm text-gray-500">{t.percent}%</div>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="h-2 bg-green-400" style={{ width: `${t.percent}%` }} />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{t.correct}/{t.attempted} correct/attempted</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weakest Topics - Right */}
                <div className="flex-1">
                    <div className="mb-2 font-semibold">Weakest Topics</div>
                    {worstTopics.map((t) => (
                        <div key={t.topic} className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium truncate">{t.topic}</div>
                                    <div className="text-sm text-gray-500">{t.percent}%</div>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="h-2 bg-red-400" style={{ width: `${t.percent}%` }} />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{t.correct}/{t.attempted} correct/attempted</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getPercentage(count, totalQuestions) {
    return ((count / totalQuestions) * 100).toFixed(0);
}

function getSummaryRow(totalQuestions, {label, count, colorClass}) {
    const numericCount = Number(count);

    return (
        <div key={label} className="grid grid-cols-3 items-center py-1.5 border-b border-gray-100 last:border-b-0">
            {/* Metric Label */}
            <div className="text-left text-gray-700 text-sm font-medium">
                {label}
            </div>

            {/* Count */}
            <div className="text-center font-bold text-lg">
                <span className={colorClass}>{numericCount}</span>
            </div>

            {/* Percentage */}
            <div className={`text-right font-semibold text-sm ${colorClass}`}>
                {getPercentage(numericCount, totalQuestions)}%
            </div>
        </div>
    );
}

function handleNextReport(localProps) {
    console.log("next report called here");
    const {setStackIndex} = localProps;
    setStackIndex((p) => p + 1);
}

function handlePrevReport(localProps) {
    const {setStackIndex} = localProps;
    setStackIndex((p) => p - 1);
}