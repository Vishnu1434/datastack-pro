import React, { useState, useEffect, useRef } from "react";
import FlashcardMode from "../services/practiceModes/FlashcardMode";
import MCQMode from "../services/practiceModes/MCQMode";
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

const BUTTON_CLASSES = "px-3 py-2 bg-white text-gray-800 border rounded-md text-sm font-medium shadow-sm whitespace-nowrap";
const ALL_TOPICS = Array.from(new Set(Object.values(topicsByStack).flat()));

function PracticePage() {
    const [activeMode, setActiveMode] = useState("Flashcards");
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedTechStacks, setSelectedTechStacks] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [availableTopics, setAvailableTopics] = useState([]);
    const [selectedPracticeType, setSelectedPracticeType] = useState("Self-Paced");

    const [dropdownOpen, setDropdownOpen] = useState({});
    const [buttonWidths, setButtonWidths] = useState({});
    const dropdownRefs = useRef({});
    const dropdownMenuRefs = useRef({});

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            const btns = Object.values(dropdownRefs.current || {});
            const menus = Object.values(dropdownMenuRefs.current || {});
            const clickedInside =
                btns.some((el) => el && el.contains(e.target)) ||
                menus.some((el) => el && el.contains(e.target));
            if (!clickedInside) setDropdownOpen({});
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // Update topics when tech stack changes
    useEffect(() => {
        const unique = Array.from(
            new Set(selectedTechStacks.flatMap((stack) => topicsByStack[stack] || []))
        );
        setAvailableTopics(unique);
        setSelectedTopics((prev) => prev.filter((t) => unique.includes(t)));
    }, [selectedTechStacks]);

    // Measure and set widths
    const measureAndSetWidth = (key, options, { includeCheckbox = false, buttonLabel = "" } = {}) => {
        if (!options?.length) return;
        let maxWidth = 0;

        const container = document.createElement("div");
        container.style.cssText = "visibility:hidden;position:absolute;left:-9999px;top:-9999px;";
        document.body.appendChild(container);

        const menu = document.createElement("div");
        menu.style.maxHeight = "240px";
        menu.style.overflow = "auto";
        container.appendChild(menu);

        const createEl = (text) => {
            const el = document.createElement(includeCheckbox ? "label" : "div");
            el.className = "px-3 py-2 text-sm flex items-center";
            if (includeCheckbox) {
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.className = "mr-2";
                el.appendChild(cb);
            }
            const span = document.createElement("span");
            span.textContent = text;
            el.appendChild(span);
            menu.appendChild(el);
            return el.offsetWidth;
        };

        options.forEach((opt) => {
            maxWidth = Math.max(maxWidth, createEl(opt));
        });

        if (buttonLabel) {
            const btn = document.createElement("button");
            btn.className = BUTTON_CLASSES;
            btn.textContent = buttonLabel;
            container.appendChild(btn);
            maxWidth = Math.max(maxWidth, btn.offsetWidth);
        }

        // account for scrollbar if present
        if (menu.scrollHeight > menu.clientHeight) {
            maxWidth += menu.offsetWidth - menu.clientWidth;
        }

        document.body.removeChild(container);
        setButtonWidths((prev) => ({ ...prev, [key]: maxWidth + 12 }));
    };

    useEffect(() => {
        measureAndSetWidth("mode", modes, { buttonLabel: "Flashcards" });
        measureAndSetWidth("practice", practiceTypes, { buttonLabel: "Self-Paced" });
        measureAndSetWidth("difficulty", difficulties, { includeCheckbox: true, buttonLabel: "Difficulty" });
        measureAndSetWidth("tech", techStacks, { includeCheckbox: true, buttonLabel: "Tech Stack" });
        measureAndSetWidth("topic", ALL_TOPICS, { includeCheckbox: true, buttonLabel: "Topic" });
    }, []);

    const computeDropdownPosition = (key) => {
        const btn = dropdownRefs.current[key];
        const w = buttonWidths[key];
        if (!btn || !w) return {};
        const rect = btn.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const spaceRight = viewportWidth - rect.left - 8;
        return w <= spaceRight ? { left: 0 } : { left: "auto", right: 0 };
    };

    const toggleSelection = (value, setter, array) =>
        setter(array.includes(value) ? array.filter((v) => v !== value) : [...array, value]);

    const renderCheckboxDropdown = (label, options, selected, setter, key) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => setDropdownOpen({ [key]: !dropdownOpen[key] })}
                className={BUTTON_CLASSES}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
            >
                {label}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    style={{
                        ...computeDropdownPosition(key),
                        width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined,
                    }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}
                >
                    {options.map((opt) => (
                        <label
                            key={opt}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selected.includes(opt)}
                                onChange={() => toggleSelection(opt, setter, selected)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    const renderSingleSelectDropdown = (options, selected, setter, key) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => setDropdownOpen({ [key]: !dropdownOpen[key] })}
                className={BUTTON_CLASSES}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
            >
                {selected}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    style={{
                        ...computeDropdownPosition(key),
                        width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined,
                    }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                                setter(opt);
                                setDropdownOpen({});
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
        <div className="flex flex-col flex-1 px-3 py-2 w-full h-[calc(100vh-5rem)]">
            <div className="flex flex-col flex-1 rounded-lg shadow overflow-hidden">
                {/* Filters bar */}
                <div className="p-3 bg-blue-600 flex justify-between items-center">
                    {/* Left side */}
                    <div className="flex gap-3">
                        {renderSingleSelectDropdown(modes, activeMode, setActiveMode, "mode")}
                        {renderSingleSelectDropdown(practiceTypes, selectedPracticeType, setSelectedPracticeType, "practice")}
                    </div>

                    {/* Right side */}
                    <div className="flex gap-3">
                        {renderCheckboxDropdown("Difficulty", difficulties, selectedDifficulties, setSelectedDifficulties, "difficulty")}
                        {renderCheckboxDropdown("Tech Stack", techStacks, selectedTechStacks, setSelectedTechStacks, "tech")}
                        {renderCheckboxDropdown("Topic", availableTopics.length ? availableTopics : ALL_TOPICS, selectedTopics, setSelectedTopics, "topic")}
                    </div>
                </div>

                {/* Practice Content */}
                <div className="flex-1 bg-red-800">
                    {renderModeComponent()}
                </div>
            </div>
        </div>
    );

}

export default PracticePage;
