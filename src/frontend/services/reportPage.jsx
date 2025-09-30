import {resetStats} from "./practiceModes/MCQMode.jsx";

export function getReport(localProps) {
    const { correctCount, incorrectCount, skippedCount, testMetrics, questions } = localProps;
    const totalQuestions = questions.length;
    const unattemptedCount = totalQuestions - correctCount - incorrectCount - skippedCount;

    const metrics = [
        { label: "Correct", count: correctCount, colorClass: "text-green-600" },
        { label: "Incorrect", count: incorrectCount, colorClass: "text-red-600" },
        { label: "Skipped", count: skippedCount, colorClass: "text-yellow-600" },
        { label: "Unattempted", count: unattemptedCount, colorClass: "text-gray-500" },
    ];

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg max-w-md w-full mx-auto my-8 border border-gray-100 transition duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="text-center mb-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Test Finished</h3>
                <p className="text-xs text-gray-600">Your performance summary:</p>
            </div>

            {/* Total Questions */}
            <div className="bg-blue-50 p-3 rounded-lg mb-5 flex justify-between items-center">
                <div className="text-sm font-semibold text-blue-700">Total Questions:</div>
                <div className="text-2xl font-extrabold text-blue-600">{totalQuestions}</div>
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5">
                <div className="grid grid-cols-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-1.5">
                    <div className="text-left">Metric</div>
                    <div className="text-center">Count</div>
                    <div className="text-right">Percentage</div>
                </div>
                {metrics.map((metric) => (getSummaryRow(totalQuestions, metric)))}
            </div>

            {/* Button */}
            <div className="flex items-center justify-center mt-6">
                <button onClick={() => resetStats(localProps)} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-300">
                    Close Results
                </button>
            </div>
        </div>
    );
}

function getPercentage(count, totalQuestions) {
    return ((count / totalQuestions) * 100).toFixed(0);
}

function getSummaryRow(totalQuestions, {label, count, colorClass}) {
    const numericCount = Number(count);

    return (
        <div className="grid grid-cols-3 items-center py-1.5 border-b border-gray-100 last:border-b-0">
            {/* Metric Label */}
            <div className="text-left text-gray-700 text-sm font-medium">
                {label}
            </div>

            {/* Count */}
            <div className="text-center font-bold text-lg">
                <span className={colorClass}>{numericCount}</span>
            </div>

            {/* Percentage */}
            <div className={`text-right font-semibold text-sm ${colorClass}`}>
                {getPercentage(numericCount, totalQuestions)}%
            </div>
        </div>
    );
}