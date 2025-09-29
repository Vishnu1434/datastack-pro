import React from "react";

const overallTime = "A total time will be allotted to solve all questions. Apply filters now and click Start to begin the timed session. Live scoring will be hidden during the run and revealed at the end."
const perQuestionTime = "Each question will have a fixed time limit. Apply filters now and click Start to begin. Live scoring will be hidden during the run and revealed at the end."

export function examModeBanner(practiceType, examState, startExam) {
    if ((practiceType === "Overall Time" || practiceType === "Per Question Time") && examState === "idle") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">{practiceType} Mode</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {practiceType === "Overall Time" ? overallTime : perQuestionTime}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={startExam} className="px-5 py-2 bg-blue-600 text-white rounded-lg">
                            Start
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

export function BuildingModeBanner() {
    return (
        <div className="flex items-center justify-center min-h-full p-6">
            <div className="w-4/5 max-w-3xl text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="text-5xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Revision Mode — Coming Soon</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                    We're working hard to build this mode.
                    In the meantime, try other modes like <span className="font-medium text-blue-600">Flashcards</span> or <span className="font-medium text-blue-600">MCQs</span> to continue practicing.
                </p>
            </div>
        </div>
    );
}
