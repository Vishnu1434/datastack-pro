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

const BUTTON_CLASSES = "px-3 py-2 bg-white text-gray-800 border rounded-md text-sm font-medium shadow-sm inline-block whitespace-nowrap";
const ALL_TOPICS = Array.from(new Set(Object.values(topicsByStack).flat()));

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

    const [buttonWidths, setButtonWidths] = useState({});

    const dropdownRefs = useRef({});
    const dropdownMenuRefs = useRef({});

    useEffect(() => {
        const handler = (e) => {
            const btns = Object.values(dropdownRefs.current || {});
            const menus = Object.values(dropdownMenuRefs.current || {});
            const clickedInside = btns.some((el) => el && el.contains(e.target)) || menus.some((el) => el && el.contains(e.target));
            if (!clickedInside) {
                setDropdownOpen({ mode: false, difficulty: false, tech: false, topic: false, practice: false });
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    useEffect(() => {
        let topics = [];
        selectedTechStacks.forEach((stack) => {
            if (topicsByStack[stack]) topics = [...topics, ...topicsByStack[stack]];
        });
        // Deduplicate topics so keys remain unique
        const unique = Array.from(new Set(topics));
        setAvailableTopics(unique);
        setSelectedTopics((prev) => prev.filter((t) => unique.includes(t)));
    }, [selectedTechStacks]);

    // Measure and set fixed widths based on longest option per dropdown
    // For right-side filters, include checkbox + spacing and scrollbar width to prevent dropdowns from exceeding button width
    const measureAndSetWidth = (key, options, config = {}) => {
        if (!Array.isArray(options) || options.length === 0) return;
        const { includeCheckbox = false, buttonLabel = "" } = config;

        let maxWidth = 0;
        const DROPDOWN_MAX_HEIGHT_PX = 240; // corresponds to Tailwind max-h-60 (15rem)

        const container = document.createElement("div");
        container.style.visibility = "hidden";
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "-9999px";
        document.body.appendChild(container);

        // Create a menu element that mimics the dropdown so we can detect scrollbar
        const menu = document.createElement("div");
        menu.style.maxHeight = `${DROPDOWN_MAX_HEIGHT_PX}px`;
        menu.style.overflow = "auto";
        menu.className = "absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto left-0";
        container.appendChild(menu);

        if (includeCheckbox) {
            options.forEach((text) => {
                const labelEl = document.createElement("label");
                labelEl.className = "flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "mr-2";
                labelEl.appendChild(checkbox);

                const textEl = document.createElement("span");
                textEl.textContent = text;
                labelEl.appendChild(textEl);

                menu.appendChild(labelEl);

                const w = labelEl.offsetWidth;
                if (w > maxWidth) maxWidth = w;
            });

            if (buttonLabel) {
                const buttonEl = document.createElement("button");
                buttonEl.className = BUTTON_CLASSES;
                buttonEl.textContent = buttonLabel;
                container.appendChild(buttonEl);
                const bw = buttonEl.offsetWidth;
                if (bw > maxWidth) maxWidth = bw;
            }
        } else {
            // single-select style items
            options.forEach((text) => {
                const itemEl = document.createElement("div");
                itemEl.className = "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm";
                itemEl.textContent = text;
                menu.appendChild(itemEl);
                const w = itemEl.offsetWidth;
                if (w > maxWidth) maxWidth = w;
            });

            if (buttonLabel) {
                const buttonEl = document.createElement("button");
                buttonEl.className = BUTTON_CLASSES;
                buttonEl.textContent = buttonLabel;
                container.appendChild(buttonEl);
                const bw = buttonEl.offsetWidth;
                if (bw > maxWidth) maxWidth = bw;
            }
        }

        // If overflow (scrollbar) exists, include scrollbar width in measurement
        const hasVerticalOverflow = menu.scrollHeight > menu.clientHeight;
        if (hasVerticalOverflow) {
            const scrollbarWidth = menu.offsetWidth - menu.clientWidth;
            if (scrollbarWidth > 0) maxWidth += scrollbarWidth;
        }

        // Add a small buffer to ensure no accidental truncation due to rounding/borders
        const MEASUREMENT_BUFFER = 12;
        maxWidth += MEASUREMENT_BUFFER;

        document.body.removeChild(container);

        setButtonWidths((prev) => ({ ...prev, [key]: maxWidth }));
    };

    useEffect(() => {
        // Ensure left-side buttons account for their own label width as well as their options
        measureAndSetWidth("mode", modes, { buttonLabel: "Flashcards" });
        measureAndSetWidth("practice", practiceTypes, { buttonLabel: "Self-Paced" });
        measureAndSetWidth("difficulty", difficulties, { includeCheckbox: true, buttonLabel: "Difficulty" });
        measureAndSetWidth("tech", techStacks, { includeCheckbox: true, buttonLabel: "Tech Stack" });
        measureAndSetWidth("topic", ALL_TOPICS, { includeCheckbox: true, buttonLabel: "Topic" });
    }, []);

    useEffect(() => {
        // Re-measure topic width when availableTopics change (e.g., selecting tech stacks)
        measureAndSetWidth("topic", availableTopics.length ? availableTopics : ALL_TOPICS, { includeCheckbox: true, buttonLabel: "Topic" });
    }, [availableTopics]);

    const toggleSelection = (value, arraySetter, array) => {
        if (array.includes(value)) arraySetter(array.filter((v) => v !== value));
        else arraySetter([...array, value]);
    };

    // ✅ Multi-select dropdown with checkboxes (always shows label)
    const renderCheckboxDropdown = (label, options, selectedArray, setSelectedArray, key) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => setDropdownOpen((prev) => {
                    const wasOpen = !!prev[key];
                    const newState = { mode: false, difficulty: false, tech: false, topic: false, practice: false };
                    newState[key] = !wasOpen;
                    return newState;
                })}
                className={BUTTON_CLASSES}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
            >
                {label}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto left-0"
                    style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : (dropdownRefs.current[key] ? `${dropdownRefs.current[key].offsetWidth}px` : undefined), boxSizing: 'border-box' }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}>
                    {options.map((opt, idx) => (
                        <label
                            key={`${opt}-${idx}`}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                        >
                            <input
                                type="checkbox"
                                className="mr-2 flex-shrink-0"
                                checked={selectedArray.includes(opt)}
                                onChange={() => toggleSelection(opt, setSelectedArray, selectedArray)}
                            />
                            <span className="whitespace-nowrap block">{opt}</span>
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
                onClick={() => setDropdownOpen((prev) => {
                    const wasOpen = !!prev[key];
                    const newState = { mode: false, difficulty: false, tech: false, topic: false, practice: false };
                    newState[key] = !wasOpen;
                    return newState;
                })}
                className={BUTTON_CLASSES}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
            >
                {selected}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto left-0"
                    style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : (dropdownRefs.current[key] ? `${dropdownRefs.current[key].offsetWidth}px` : undefined), boxSizing: 'border-box' }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}>
                    {options.map((opt, idx) => (
                        <div
                            key={`${opt}-${idx}`}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                            onClick={() => {
                                setSelected(opt);
                                setDropdownOpen((prev) => ({ ...prev, [key]: false }));
                            }}
                        >
                            <span className="whitespace-nowrap block">{opt}</span>
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
                        {renderCheckboxDropdown("Topic", availableTopics.length ? availableTopics : ALL_TOPICS, selectedTopics, setSelectedTopics, "topic")}
                    </div>
                </div>

                {/* Practice Content */}
                <div className="flex-1 bg-white p-4 md:p-6 overflow-auto">{renderModeComponent()}</div>
            </div>
        </div>
    );
}

export default PracticePage;
