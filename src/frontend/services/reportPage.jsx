import {resetStats} from "./practiceModes/MCQMode.jsx";

export function getReport(localProps) {
    const {correctCount, incorrectCount, skippedCount} = localProps;

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl w-full">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 text-center">
                    <h3 className="text-lg font-semibold mb-2">Exam Finished</h3>
                    <p className="text-sm text-gray-600 mb-4">Your scores for this session:</p>
                    <div className="flex items-center justify-around mb-4">
                        <div>
                            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                            <div className="text-sm text-gray-500">Correct</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                            <div className="text-sm text-gray-500">Incorrect</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-700">{skippedCount}</div>
                            <div className="text-sm text-gray-500">Skipped</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => resetStats(localProps)} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}