import React, { useState, useEffect } from "react";
import FlashcardMode from "../services/practiceModes/FlashcardMode";
import MCQMode from "../services/practiceModes/MCQMode";
// import AdaptiveMode from "../services/practiceModes/AdaptiveMode";
// import RevisionMode from "../services/practiceModes/RevisionMode";
import SurvivalMode from "../services/practiceModes/SurvivalMode";

const modes = ["Flashcards", "MCQs", "Adaptive Mode", "Revision Mode", "Survival Mode"];
const difficulties = ["Easy", "Medium", "Hard"];
const techStacks = ["Spark", "SQL", "Python", "Java", "PySpark", "Airflow"];
const topicsByStack = {
    Spark: ["RDD", "DataFrame", "Spark SQL"],
    SQL: ["Joins", "Clauses", "Indexing"],
    Python: ["Lists", "Dicts", "Functions"],
    Java: ["OOP", "Collections", "Streams"],
    PySpark: ["RDD", "DataFrame", "Transformations"],
    Airflow: ["DAGs", "Operators", "Scheduling"],
};
const practiceTypes = ["Self-Paced", "Overall Time", "Per Question Time"];

function PracticePage() {
    const [activeModes, setActiveModes] = useState(["Flashcards"]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedTechStacks, setSelectedTechStacks] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [availableTopics, setAvailableTopics] = useState([]);
    const [selectedPracticeTypes, setSelectedPracticeTypes] = useState(["Self-Paced"]);
    const [overallTime, setOverallTime] = useState(30);
    const [perQuestionTime, setPerQuestionTime] = useState(1);

    // Dropdown open state
    const [dropdownOpen, setDropdownOpen] = useState({
        mode: false,
        difficulty: false,
        tech: false,
        topic: false,
        practice: false,
    });

    useEffect(() => {
        let topics = [];
        selectedTechStacks.forEach((stack) => {
            if (topicsByStack[stack]) topics = [...topics, ...topicsByStack[stack]];
        });
        setAvailableTopics(topics);
        setSelectedTopics((prev) => prev.filter((t) => topics.includes(t)));
    }, [selectedTechStacks]);

    const toggleSelection = (value, arraySetter, array) => {
        if (array.includes(value)) arraySetter(array.filter((v) => v !== value));
        else arraySetter([...array, value]);
    };

    const renderCheckboxDropdown = (label, options, selectedArray, setSelectedArray, key) => (
        <div className="relative">
            <button
                onClick={() =>
                    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className="px-3 py-2 border rounded-md bg-white flex items-center justify-between text-sm font-medium shadow-sm hover:bg-gray-100"
            >
                {label}
                <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                        dropdownOpen[key] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {dropdownOpen[key] && (
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((opt) => (
                        <label
                            key={opt}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedArray.includes(opt)}
                                onChange={() => toggleSelection(opt, setSelectedArray, selectedArray)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    const renderModeComponent = () => {
        const mode = activeModes[0] || "Flashcards"; // pick first selected
        const props = {
            difficulty: selectedDifficulties,
            techStack: selectedTechStacks,
            topic: selectedTopics,
            practiceType: selectedPracticeTypes,
            overallTime,
            perQuestionTime,
        };

        switch (mode) {
            case "Flashcards":
                return <FlashcardMode {...props} />;
            case "MCQs":
                return <MCQMode {...props} />;
            case "Adaptive Mode":
                return <AdaptiveMode {...props} />;
            case "Revision Mode":
                return <RevisionMode {...props} />;
            case "Survival Mode":
                return <SurvivalMode {...props} />;
            default:
                return <FlashcardMode {...props} />;
        }
    };

    return (
        <div className="flex flex-col flex-1 p-4 w-full h-[calc(100vh-4rem-4rem)]">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 p-3 bg-gray-50 border-b border-gray-200 items-center">
                {renderCheckboxDropdown("Mode", modes, activeModes, setActiveModes, "mode")}
                {renderCheckboxDropdown("Difficulty", difficulties, selectedDifficulties, setSelectedDifficulties, "difficulty")}
                {renderCheckboxDropdown("Tech Stack", techStacks, selectedTechStacks, setSelectedTechStacks, "tech")}
                {renderCheckboxDropdown("Topic", availableTopics, selectedTopics, setSelectedTopics, "topic")}
                {renderCheckboxDropdown("Practice Type", practiceTypes, selectedPracticeTypes, setSelectedPracticeTypes, "practice")}

                {/* Time inputs */}
                {selectedPracticeTypes.includes("Overall Time") && (
                    <input
                        type="number"
                        min={1}
                        value={overallTime}
                        onChange={(e) => setOverallTime(parseInt(e.target.value))}
                        placeholder="Overall Time (min)"
                        className="px-3 py-2 border rounded-md w-36 text-sm"
                    />
                )}
                {selectedPracticeTypes.includes("Per Question Time") && (
                    <input
                        type="number"
                        min={1}
                        value={perQuestionTime}
                        onChange={(e) => setPerQuestionTime(parseInt(e.target.value))}
                        placeholder="Per Q Time (min)"
                        className="px-3 py-2 border rounded-md w-36 text-sm"
                    />
                )}
            </div>

            {/* Practice Content */}
            {/*<div className="flex-1 bg-white p-4 md:p-6 overflow-auto">{renderModeComponent()}</div>*/}
            <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow overflow-auto">
                {renderModeComponent()}
            </div>
        </div>
    );
}

export default PracticePage;
