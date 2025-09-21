import React from "react";

function TheoryPage() {
    return (
        <div className="p-8 md:p-12 space-y-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Theory Questions</h2>
            <p className="text-gray-600">
                Dive deep into the core concepts of data engineering.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Q1. What is the CAP Theorem?
                </h3>
                <details className="mt-4 p-4 bg-white rounded-lg border">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                        Show Answer
                    </summary>
                    <p className="mt-2 text-gray-600">
                        The CAP theorem states that a distributed data store can only
                        provide two of the three guarantees: Consistency, Availability, and
                        Partition Tolerance.
                    </p>
                </details>
            </div>
        </div>
    );
}

export default TheoryPage;
