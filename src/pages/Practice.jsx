import React, { useState } from "react";
import FlashcardMode from "../services/practiceModes/FlashcardMode";
import MCQMode from "../services/practiceModes/MCQMode";
import ExamSimulationMode from "../services/practiceModes/ExamSimulationMode";
import DailyChallengeMode from "../services/practiceModes/DailyChallengeMode";
import SurvivalMode from "../services/practiceModes/SurvivalMode";

const modes = [
    { id: "flashcard", label: "Flashcards" },
    { id: "mcq", label: "MCQs" },
    { id: "exam", label: "Exam Simulation" },
    { id: "daily", label: "Daily Challenge" },
    { id: "survival", label: "Survival Mode" },
];

function PracticePage() {
    const [activeMode, setActiveMode] = useState("flashcard");

    const renderMode = () => {
        switch (activeMode) {
            case "flashcard":
                return <FlashcardMode />;
            case "mcq":
                return <MCQMode />;
            case "exam":
                return <ExamSimulationMode />;
            case "daily":
                return <DailyChallengeMode />;
            case "survival":
                return <SurvivalMode />;
            default:
                return <FlashcardMode />;
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex space-x-3 border-b border-gray-200 pb-2">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setActiveMode(mode.id)}
                        className={`px-4 py-2 rounded-t-lg font-medium ${
                            activeMode === mode.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>

            {/* Mode Content */}
            <div className="bg-white p-6 rounded-lg shadow">{renderMode()}</div>
        </div>
    );
}

export default PracticePage;
