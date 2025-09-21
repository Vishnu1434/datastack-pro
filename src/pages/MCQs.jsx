import React from "react";

function MCQsPage() {
    return (
        <div className="p-8 md:p-12 space-y-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
                Multiple Choice Questions
            </h2>
            <p className="text-gray-600">
                Test your knowledge on key data engineering technologies.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Q1. Which of the following is an ETL tool?
                </h3>
                <ul className="space-y-2 text-gray-700">
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                        A) Tableau
                    </li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                        B) Apache Airflow
                    </li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                        C) Apache Kafka
                    </li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                        D) Informatica
                    </li>
                </ul>
                <details className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <summary className="font-semibold text-green-800 cursor-pointer">
                        Show Answer
                    </summary>
                    <p className="mt-2 text-green-700">D) Informatica</p>
                </details>
            </div>
        </div>
    );
}

export default MCQsPage;
