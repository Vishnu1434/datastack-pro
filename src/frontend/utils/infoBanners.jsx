import React from "react";
import { startTest } from "../services/practiceModes/MCQMode.jsx";

const overallTime = "A total time will be allotted to solve all questions. Apply filters now and click Start to begin the timed session. Live scoring will be hidden during the run and revealed at the end."
const perQuestionTime = "Each question will have a fixed time limit. Apply filters now and click Start to begin. Live scoring will be hidden during the run and revealed at the end."

export function examModeBanner(practiceType, props) {
    return (
        <div className="flex items-center justify-center min-h-full p-6">
            <div className="w-4/5 max-w-3xl text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">{practiceType} Mode</h3>
                <p className="text-sm text-gray-600 mb-4">
                    {practiceType === "Overall Time" ? overallTime : perQuestionTime}
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => {startTest(props)}} className="px-7 py-2 bg-blue-600 text-white rounded-lg shadow-lg">
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
}

export function BuildingModeBanner() {
    return (
        <div className="flex items-center justify-center min-h-full p-6">
            <div className="w-4/5 max-w-3xl text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="text-5xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Coming Soon</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                    We're working hard to build this mode.
                    In the meantime, try other modes like <span className="font-medium text-blue-600">Flashcards</span> or <span className="font-medium text-blue-600">MCQs</span> to continue practicing.
                </p>
            </div>
        </div>
    );
}

export function LoadingBanner(type) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-0 py-16">
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="mb-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin" />
                </div>
                <div className="text-sm text-gray-700 font-medium">Loading {type}...</div>
            </div>
        </div>
    );
}

export function NoQuestionsFoundBanner() {
    return (
        <div className="flex items-center justify-center min-h-full p-6">
            <div className="w-4/5 max-w-3xl text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
                <p className="font-sans text-gray-800 text-lg font-medium leading-relaxed tracking-normal">
                    No questions match current filters.
                </p>
            </div>
        </div>
    )
}
