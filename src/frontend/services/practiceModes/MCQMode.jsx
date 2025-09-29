import React, { useState, useEffect } from "react";
import {shuffleQuestions, useEffectLoadQuestions} from "../practicePage.jsx";
import { CheckCircle, XCircle, Shuffle } from "lucide-react";
import {iconForStack, difficultyBadge, filterQuestions} from "../../utils/common.jsx";
import {BuildingModeBanner, LoadingBanner, NoQuestionsFoundBanner} from "../../utils/infoBanners.jsx";

export default function MCQMode(props) {
    const {difficulty, techStack, topic, practiceType} = props;

    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(true);

    // score counters
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [skippedCount, setSkippedCount] = useState(0);

    const localProps = {
        setQuestionIndex,
        setSelected,
        setAnswered,
        setCorrectCount,
        setIncorrectCount,
        setSkippedCount,
        answered,
        questions,
        questionIndex,
        allQuestions,
        setQuestions,
        selected
    }

    const scoreProps = {correctCount, incorrectCount, skippedCount}

    useEffectLoadQuestions("mcqs", {setAllQuestions, setLoading})

    useEffect(() => {
        const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: techStack, topics: topic });
        setQuestions(filtered);

        resetStats(localProps);
    }, [difficulty, techStack, topic, allQuestions]);

    if (loading) {
        return LoadingBanner("MCQs")
    }

    if (!questions.length) return NoQuestionsFoundBanner();

    const question = questions[questionIndex] || null;

    switch (practiceType) {
        case "Self-Paced":
            return mcqsMainContainer(question, localProps, props, scoreProps);
        default:
            return <BuildingModeBanner/>;
    }
}

function mcqsMainContainer(question, localProps, props, scoreProps) {
    const {selected} = localProps;

    return (
        <div className="flex flex-col flex-1 h-screen gap-6 p-6 bg-gray-50 rounded-xl shadow-md">
            {/* Top bar: stats on the left, actions on the right */}
            <div className="flex flex-col gap-3">
                {mcqsHeaderBar(localProps, props, scoreProps)}

                {mcqsQuestionBar(localProps)}
            </div>

            {/* Options */}
            <ul className="space-y-2">
                {Object.entries(question.options).map(([key, value], i) => {
                    const isSelected = selected === key;
                    const isCorrect = question.answer === key;

                    return (
                        <li key={key} onClick={() => handleSelect(key, localProps)} className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition ${getOptionClasses({ answered, isCorrect, isSelected })}`} >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    {renderOptionIcon({ answered, isCorrect, isSelected, index: i })}
                                </div>
                                <div className="text-sm font-medium">{value}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Footer with only the Next button */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <button onClick={() => handleNext(localProps)} disabled={questionIndex >= questions.length - 1} className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50" >
                    Next
                </button>
            </div>
        </div>
    )
}

function mcqsHeaderBar(localProps, props, scoreProps) {
    const {correctCount, incorrectCount, skippedCount} = scoreProps;

    return (
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
                    onClick={() => handleReset(localProps, props)}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                    Reset
                </button>
                <button
                    onClick={() => handleShuffle(localProps)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Shuffle size={16} /> Shuffle
                </button>
            </div>
        </div>
    )
}

function mcqsQuestionBar(localProps) {
    const {questions, question, questionIndex} = localProps;
    console.log("question id: ", question);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-blue-600">
                    {iconForStack(question.stack || question.source || "")}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
            </div>
    
            <div className="flex items-center gap-3">
                {difficultyBadge(question.difficulty)}
                <div className="text-sm text-gray-500">{questionIndex + 1}/{questions.length}</div>
            </div>
        </div>
    )
}

function getOptionClasses({ answered, isCorrect, isSelected }) {
    if (answered) {
        if (isCorrect) return "bg-green-100 border-green-400 text-green-800";
        if (isSelected) return "bg-red-100 border-red-400 text-red-800";
        return "bg-white border-gray-200";
    }
    return "bg-white hover:bg-gray-50 border-gray-200";
}

function renderOptionIcon({ answered, isCorrect, isSelected, index }) {
    if (answered) {
        if(isCorrect) return <CheckCircle className="text-green-600" size={18} />;
        if(isSelected) return <XCircle className="text-red-600" size={18} />;
    }
    return <span className="text-gray-500">{String.fromCharCode(65 + index)}</span>;
}

function resetStats(props) {
    const { setQuestionIndex, setSelected, setAnswered, setCorrectCount, setIncorrectCount, setSkippedCount } = props;

    setQuestionIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSkippedCount(0);
}

function handleReset(localProps, props) {
    const {allQuestions, setQuestions, difficulty, techStack, topic} = props;

    const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: techStack, topics: topic });
    setQuestions(shuffleQuestions([...filtered]));

    resetStats(localProps);
}

function handleShuffle(localProps) {
    const {setQuestions} = localProps;

    setQuestions((prev) => shuffleQuestions([...prev]));

    resetStats(localProps);
}

function handleSelect(selectedKey, localProps) {
    const {
        answered,
        questions,
        questionIndex,
        setSelected,
        setAnswered,
        setCorrectCount,
        setIncorrectCount
    } = localProps;

    if (answered) return;

    const question = questions[questionIndex];
    if (!question) return;

    setSelected(selectedKey);
    setAnswered(true);

    if (selectedKey === question.answer) {
        setCorrectCount((p) => p + 1);
    } else {
        setIncorrectCount((p) => p + 1);
    }
}

function handleNext(localProps) {
    const {
        answered,
        setAnswered,
        setQuestionIndex,
        setSkippedCount,
        setSelected,
        questions
    } = localProps

    if (!answered) {
        setSkippedCount((p) => p + 1);
    }

    setSelected(null);
    setAnswered(false);
    setQuestionIndex((prev) => Math.min(prev + 1, Math.max(questions.length - 1, 0)));
}