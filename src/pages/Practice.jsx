import React, { useState, useEffect, useRef } from "react";
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
    const [activeMode, setActiveMode] = useState("Flashcards");
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedTechStacks, setSelectedTechStacks] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [availableTopics, setAvailableTopics] = useState([]);
    const [selectedPracticeType, setSelectedPracticeType] = useState("Self-Paced");

    const [dropdownOpen, setDropdownOpen] = useState({
        mode: false,
        difficulty: false,
        tech: false,
        topic: false,
        practice: false,
    });

    const dropdownRefs = useRef({});

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

    // ✅ Multi-select dropdown with checkboxes (always shows label)
    const renderCheckboxDropdown = (label, options, selectedArray, setSelectedArray, key) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="px-3 py-2 bg-white text-gray-800 border rounded-md text-sm font-medium shadow-sm inline-block whitespace-nowrap"
            >
                {label}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto left-0"
                    style={{ minWidth: dropdownRefs.current[key] ? `${dropdownRefs.current[key].offsetWidth}px` : undefined }}>
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

    // ✅ Single-select dropdown (shows only selected value)
    const renderSingleSelectDropdown = (options, selected, setSelected, key) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="px-3 py-2 bg-white text-gray-800 border rounded-md text-sm font-medium shadow-sm inline-block whitespace-nowrap"
            >
                {selected}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto left-0"
                    style={{ minWidth: dropdownRefs.current[key] ? `${dropdownRefs.current[key].offsetWidth}px` : undefined }}>
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                                setSelected(opt);
                                setDropdownOpen((prev) => ({ ...prev, [key]: false }));
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderModeComponent = () => {
        const props = {
            difficulty: selectedDifficulties,
            techStack: selectedTechStacks,
            topic: selectedTopics,
            practiceType: selectedPracticeType,
        };

        switch (activeMode) {
            case "Flashcards":
                return <FlashcardMode {...props} />;
            case "MCQs":
                return <MCQMode {...props} />;
            case "Survival Mode":
                return <SurvivalMode {...props} />;
            default:
                return <FlashcardMode {...props} />;
        }
    };

    return (
        <div className="flex flex-col flex-1 px-3 py-2 w-full h-[calc(100vh-5rem-5rem)]">
            <div className="flex flex-col flex-1 rounded-lg shadow overflow-hidden">
                {/* Filters bar */}
                <div className="p-3 bg-blue-600 flex justify-between items-center">
                    {/* Left side: Mode + Practice Type */}
                    <div className="flex gap-3">
                        {renderSingleSelectDropdown(modes, activeMode, setActiveMode, "mode")}
                        {renderSingleSelectDropdown(practiceTypes, selectedPracticeType, setSelectedPracticeType, "practice")}
                    </div>

                    {/* Right side: Difficulty + Tech Stack + Topic */}
                    <div className="flex gap-3">
                        {renderCheckboxDropdown("Difficulty", difficulties, selectedDifficulties, setSelectedDifficulties, "difficulty")}
                        {renderCheckboxDropdown("Tech Stack", techStacks, selectedTechStacks, setSelectedTechStacks, "tech")}
                        {renderCheckboxDropdown("Topic", availableTopics, selectedTopics, setSelectedTopics, "topic")}
                    </div>
                </div>

                {/* Practice Content */}
                <div className="flex-1 bg-white p-4 md:p-6 overflow-auto">{renderModeComponent()}</div>
            </div>
        </div>
    );
}

export default PracticePage;
