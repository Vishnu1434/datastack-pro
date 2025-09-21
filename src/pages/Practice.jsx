import React, { useState } from "react";
import FlashcardMode from "../services/practiceModes/FlashcardMode";
import MCQMode from "../services/practiceModes/MCQMode";
import ExamSimulationMode from "../services/practiceModes/ExamSimulationMode";
import DailyChallengeMode from "../services/practiceModes/DailyChallengeMode";
import SurvivalMode from "../services/practiceModes/SurvivalMode";

const modes = [
    { id: "flashcard", label: "Flashcards" },
    { id: "mcq", label: "MCQs" },
    { id: "adaptive", label: "Adaptive Mode" },
    { id: "revision", label: "Revision Mode" },
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
        <div className="flex flex-col flex-1 p-4 w-full h-[calc(100vh-4rem-4rem)]">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
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
            <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow overflow-auto">
                {renderMode()}
            </div>
        </div>
    );
}

export default PracticePage;
