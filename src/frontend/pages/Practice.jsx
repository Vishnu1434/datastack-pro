import React, { useState, useEffect, useRef } from "react";

import {filterTopics, renderModeComponent} from "../services/practicePage.jsx";
import * as commonUtils from "../utils/common.jsx";
import * as constants from "../resources/constants.jsx";
import * as styles from "../utils/styles.jsx";

const { techStacks, topicsByStack}  = await commonUtils.load_manifest();
const allTopics = Array.from(new Set(Object.values(topicsByStack).flat()));

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

    // track exam state from MCQ child: idle | running | ended
    const [examState, setExamState] = useState("idle");

    // Close dropdowns on the outside click
    commonUtils.useOutsideClick(dropdownRefs, dropdownMenuRefs, setDropdownOpen);

    // Update topics when tech stack changes
    filterTopics(selectedTechStacks, topicsByStack, setAvailableTopics, setSelectedTopics);

    // Measure and set widths
    useEffect(() => {
        styles.measureAndSetWidth("mode", constants.MODES, setButtonWidths, { buttonLabel: "Flashcards" });
        styles.measureAndSetWidth("practice", constants.PRACTICE_TYPES, setButtonWidths, { buttonLabel: "Self-Paced" });
        styles.measureAndSetWidth("difficulty", constants.DIFFICULTIES, setButtonWidths, { includeCheckbox: true, buttonLabel: "Difficulty" });
        styles.measureAndSetWidth("tech", techStacks, setButtonWidths, { includeCheckbox: true, buttonLabel: "Tech Stack" });
        styles.measureAndSetWidth("topic", allTopics, setButtonWidths, { includeCheckbox: true, buttonLabel: "Topic" });
    }, [constants.MODES, constants.PRACTICE_TYPES, constants.DIFFICULTIES, techStacks, allTopics]);

    const toggleSelection = (value, setter, array) =>
        setter(array.includes(value) ? array.filter((v) => v !== value) : [...array, value]);

    const renderCheckboxDropdown = (label, options, selected, setter, key, disabled = false) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => { if (!disabled) setDropdownOpen({ [key]: !dropdownOpen[key] }); }}
                className={`${constants.BUTTON_CLASSES} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
                disabled={disabled}
            >
                {label}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    style={{
                        ...styles.computeDropdownPosition(key, dropdownRefs, buttonWidths),
                        width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined,
                    }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}
                >
                    {options.map((opt) => (
                        <label
                            key={opt}
                            className={`flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${disabled ? 'opacity-50' : ''}`}
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selected.includes(opt)}
                                onChange={() => toggleSelection(opt, setter, selected)}
                                disabled={disabled}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    const renderSingleSelectDropdown = (options, selected, setter, key, disabled = false) => (
        <div className="relative inline-block">
            <button
                ref={(el) => (dropdownRefs.current[key] = el)}
                onClick={() => { if (!disabled) setDropdownOpen({ [key]: !dropdownOpen[key] }); }}
                className={`${constants.BUTTON_CLASSES} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined }}
                disabled={disabled}
            >
                {selected}
            </button>

            {dropdownOpen[key] && (
                <div
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    style={{
                        ...styles.computeDropdownPosition(key, dropdownRefs, buttonWidths),
                        width: buttonWidths[key] ? `${buttonWidths[key]}px` : undefined,
                    }}
                    ref={(el) => (dropdownMenuRefs.current[key] = el)}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${disabled ? 'opacity-50' : ''}`}
                            onClick={() => { if (!disabled) { setter(opt); setDropdownOpen({}); } }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // disable filters while the MCQ timed exam is running
    const filtersDisabled = activeMode === 'MCQs' && selectedPracticeType !== 'Self-Paced' && examState === 'running';

    const props = {
        difficulty: selectedDifficulties,
        techStack: selectedTechStacks,
        topic: selectedTopics,
        practiceType: selectedPracticeType,
        onExamStateChange: setExamState,
    };

    return (
        <div className="flex flex-col flex-1 px-3 py-2 w-full h-[calc(100vh-5rem)] min-h-0">
            <div className="flex flex-col flex-1 rounded-lg shadow overflow-hidden min-h-0">
                {/* Filters bar */}
                <div className="p-3 bg-blue-600 flex justify-between items-center">
                    {/* Left side */}
                    <div className="flex gap-3">
                        {renderSingleSelectDropdown(constants.MODES, activeMode, setActiveMode, "mode", examState === 'running')}
                        {renderSingleSelectDropdown(constants.PRACTICE_TYPES, selectedPracticeType, setSelectedPracticeType, "practice", examState === 'running')}
                    </div>

                    {/* Right side */}
                    <div className="flex gap-3">
                        {renderCheckboxDropdown("Difficulty", constants.DIFFICULTIES, selectedDifficulties, setSelectedDifficulties, "difficulty", filtersDisabled)}
                        {renderCheckboxDropdown("Tech Stack", techStacks, selectedTechStacks, setSelectedTechStacks, "tech", filtersDisabled)}
                        {renderCheckboxDropdown("Topic", availableTopics.length ? availableTopics : allTopics, selectedTopics, setSelectedTopics, "topic", filtersDisabled)}
                    </div>
                </div>

                {/* Practice Content */}
                <div className="flex-1">
                    {renderModeComponent(activeMode, props)}
                </div>
            </div>
        </div>
    );

}

export default PracticePage;
