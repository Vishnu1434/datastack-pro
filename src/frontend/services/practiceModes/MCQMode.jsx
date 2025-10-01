import React, {useState, useEffect} from "react";
import {shuffleQuestions, useEffectLoadQuestions} from "../practicePage.jsx";
import { CheckCircle, XCircle, Shuffle, AlarmClock  } from "lucide-react";
import {iconForStack, difficultyBadge, filterQuestions, formatTime} from "../../utils/common.jsx";
import {examModeBanner, LoadingBanner, NoQuestionsFoundBanner} from "../../utils/infoBanners.jsx";
import {getReport} from "../reportPage.jsx";

export default function MCQMode(props) {
    const {difficulty, selectedTechStacks, topic, practiceType, allTechStacks} = props;

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
    const [testMetrics, setTestMetrics] = useState({});

    const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);

    const [testStarted, setTestStarted] = useState(false);
    const [displayReport, setDisplayReport] = useState(false);

    const [stackIndex, setStackIndex] = useState(0);

    const localProps = {
        setQuestionIndex, setSelected, setAnswered, setCorrectCount,
        setIncorrectCount, setSkippedCount, answered, questions,
        questionIndex, allQuestions, setQuestions, selected,
        totalTimeRemaining, setTotalTimeRemaining, testStarted,
        setTestStarted, setDisplayReport, correctCount, incorrectCount,
        skippedCount, testMetrics, setTestMetrics, selectedTechStacks, stackIndex,
        setStackIndex, allTechStacks, practiceType
    };

    const scoreProps = {correctCount, incorrectCount, skippedCount};

    useEffectLoadQuestions("mcqs", {setAllQuestions, setLoading});
    useEffectTimer(localProps, props);

    useEffect(() => {
        const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: selectedTechStacks, topics: topic });
        setQuestions(filtered);

        handleShuffle(localProps);

        resetStats(localProps);
    }, [difficulty, selectedTechStacks, topic, practiceType, allQuestions]);

    if (loading) {
        return LoadingBanner("MCQs");
    }

    if (!questions.length) return NoQuestionsFoundBanner();

    const question = questions[questionIndex] || null;

    const clubbedProps = {question, localProps, props, scoreProps};

    if (displayReport) {
        return getReport(localProps);
    }

    if (practiceType !== "Self-Paced" && !testStarted) {
        return examModeBanner(localProps);
    }

    return mcqsMainContainer(clubbedProps);
}

function mcqsMainContainer({question, localProps, props, scoreProps}) {
    const {selected, questionIndex, questions} = localProps;

    return (
        <div className="flex flex-col flex-1 h-screen gap-6 p-6 bg-gray-50 rounded-xl shadow-md">
            {/* Top bar: stats on the left, actions on the right */}
            <div className="flex flex-col gap-3">
                {mcqsHeaderBar(localProps, props, scoreProps)}

                {mcqsQuestionBar(question, localProps)}
            </div>

            {/* Options */}
            <ul className="space-y-2">
                {Object.entries(question.options).map(([key, value], i) => {
                    const isSelected = selected === key;
                    const isCorrect = question.answer === key;

                    return (
                        <li key={key} onClick={() => handleSelect(key, localProps)} className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition ${getOptionClasses({ localProps, isCorrect, isSelected })}`} >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    {renderOptionIcon({ localProps, isCorrect, isSelected, index: i })}
                                </div>
                                <div className="text-sm font-medium">{value}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Footer with only the Next button */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <button onClick={() => handleNext(localProps, props)} disabled={questionIndex >= questions.length - 1} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" >
                    Next
                </button>
            </div>
        </div>
    )
}

function mcqsHeaderBar(localProps, props, scoreProps) {
    const {correctCount, incorrectCount, skippedCount} = scoreProps;
    const {totalTimeRemaining, setDisplayReport} = localProps;
    const {practiceType} = props;

    const selfPaced = (
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

    // const timeType = practiceType === "Overall Time" ? "Total" : "Question";

    const otherTypes = (
        <div className="flex items-center justify-between w-full mb-1">
            <div className="flex-1 flex justify-center">
                <div className="flex items-center text-lg text-gray-700 gap-2">
                    <AlarmClock className="w-5 h-5 text-blue-500" />
                    <span>
                        {"  "}
                        <strong className="font-bold text-blue-500">
                            {formatTime(totalTimeRemaining)}
                        </strong>
                    </span>
                </div>
            </div>

            {/*onClick={endExam}*/}
            <div>
                <button onClick={() => endTest(localProps)} className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                    End
                </button>
            </div>
        </div>
    );

    if (practiceType === "Self-Paced") {
        return selfPaced;
    } else {
        return otherTypes;
    }
}

function mcqsQuestionBar(question, localProps) {
    const {questions, questionIndex} = localProps;

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

function getOptionClasses({ localProps, isCorrect, isSelected }) {
    const { answered, testStarted } = localProps;

    if (!testStarted) {
        if (answered) {
            if (isCorrect) return "bg-green-100 border-green-400 text-green-800";
            if (isSelected) return "bg-red-100 border-red-400 text-red-800";
        }
    }
    else if (isSelected) return "bg-blue-100 border-blue-200";

    return "bg-white hover:bg-gray-100 border-gray-200";
}

function renderOptionIcon({ localProps, isCorrect, isSelected, index }) {
    const { answered, testStarted } = localProps;

    if (!testStarted) {
        if (answered) {
            if(isCorrect) return <CheckCircle className="text-green-600" size={18} />;
            if(isSelected) return <XCircle className="text-red-600" size={18} />;
        }
    }
    return <span className="text-gray-500">{String.fromCharCode(65 + index)}</span>;
}

export function resetStats(props) {
    const { setQuestionIndex, setSelected, setAnswered, setCorrectCount,
        setIncorrectCount, setSkippedCount, setDisplayReport } = props;

    setQuestionIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSkippedCount(0);
    setDisplayReport(false);
}

function handleReset(localProps, props) {
    const {allQuestions, setQuestions, difficulty, selectedTechStacks, topic} = localProps;

    const filtered = filterQuestions(allQuestions, { difficulties: difficulty, techStacks: selectedTechStacks, topics: topic });
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
        setIncorrectCount,
        setTestMetrics
    } = localProps;

    if (answered) return;

    const question = questions[questionIndex];

    setSelected(selectedKey);
    setAnswered(true);

    if (selectedKey === question.answer) {
        setCorrectCount((p) => p + 1);
        updateTestMetrics(question.stack, "correctIds", question.id, setTestMetrics);
    } else {
        setIncorrectCount((p) => p + 1);
        updateTestMetrics(question.stack, "incorrectIds", question.id, setTestMetrics);
    }
}

function handleNext(localProps, props) {
    const {
        setAnswered,
        setQuestionIndex,
        setSelected,
        questions,
        setTotalTimeRemaining,
        questionIndex
    } = localProps

    const {practiceType} = props;

    console.log("from handle next here");
    handleSkip(localProps);

    setSelected(null);
    setAnswered(false);
    setQuestionIndex((prev) => prev + 1);

    const question = questions[questionIndex + 1];

    if (practiceType === "Per Question Time") {
        setTotalTimeRemaining(question.difficulty === "easy" ? 30 : question.difficulty === "medium" ? 45 : 60);
    }
}

function useEffectTimer(localProps, props) {
    const {totalTimeRemaining, setTotalTimeRemaining, questions, questionIndex, testStarted} = localProps;
    const {practiceType} = props;

    return (
        useEffect(() => {
            if (totalTimeRemaining <= 0 && testStarted) {
                if (practiceType !== "Overall Time" && questionIndex < questions.length - 1) {
                    return handleNext(localProps, props);
                }
                console.log("from end use effect here");
                return endTest(localProps);
            }

            const timer = setInterval(() => {
                setTotalTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }, [totalTimeRemaining])
    );
}

function calculateTestTime(questions) {
    let time = 0;

    for (const question of questions) {
        time += question.difficulty === "easy" ? 30 : question.difficulty === "Medium" ? 45 : 60;
    }

    return Math.ceil(time / 60) * 60;
}

export function startTest(localProps) {
    const {setTestStarted, setTotalTimeRemaining, practiceType, questions, questionIndex} = localProps;

    if (practiceType === "Per Question Time") {
        const question = questions[questionIndex];
        setTotalTimeRemaining(question.difficulty === "easy" ? 30 : question.difficulty === "medium" ? 45 : 60);
    }
    else {
        let time = calculateTestTime(questions);
        setTotalTimeRemaining(time);
    }
    setTestStarted(true);
}

function handleSkip(localProps) {
    const {answered, setSkippedCount, questions, questionIndex, setTestMetrics} = localProps;

    const question = questions[questionIndex];

    if (!answered) {
        setSkippedCount((p) => p + 1);
        updateTestMetrics(question.stack, "skippedIds", question.id, setTestMetrics);
    }
}

export function endTest(localProps) {
    const {setDisplayReport, setTestStarted, setTotalTimeRemaining} = localProps;
    handleSkip(localProps);

    setTestStarted(false);
    setTotalTimeRemaining(0);
    setDisplayReport(true);
}

function updateTestMetrics(stack, category, questionId, setTestMetrics) {
    setTestMetrics((prev) => {
        let stackData = prev[stack];

        if (!stackData) {
            stackData = {
                correctIds: [],
                incorrectIds: [],
                skippedIds: [],
            };
        }

        const correctIds = [...stackData.correctIds];
        const incorrectIds = [...stackData.incorrectIds];
        const skippedIds = [...stackData.skippedIds];

        if (category === "correctIds") {
            correctIds.push(questionId);
        } else if (category === "incorrectIds") {
            incorrectIds.push(questionId);
        } else if (category === "skippedIds") {
            skippedIds.push(questionId);
        }

        return {...prev, [stack]: {correctIds, incorrectIds, skippedIds}};
    });
}
