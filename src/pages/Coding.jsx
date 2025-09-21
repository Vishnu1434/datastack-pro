import React, { useState } from "react";
import { PlayCircle } from "lucide-react";

function CodingPage({ isLocalMode }) {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("Output will appear here.");
    const [isLoading, setIsLoading] = useState(false);

    const handleRunCode = async () => {
        if (!isLocalMode) return;

        setIsLoading(true);
        setOutput("Running code...");

        try {
            const response = await fetch("http://localhost:8000/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code }),
            });

            const data = await response.json();
            if (response.ok) {
                setOutput(data.output);
            } else {
                setOutput(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("API call failed:", error);
            setOutput("Error: Could not connect to the local server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 md:p-12 space-y-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Coding Questions</h2>
            <p className="text-gray-600">
                Practice your skills with hands-on coding challenges.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Q1. Find the average salary per department.
                </h3>
                <p className="text-gray-600">
                    Write a PySpark or Scala Spark program to calculate the average salary
                    for each department from a given dataset.
                </p>
            </div>

            {isLocalMode ? (
                <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <PlayCircle className="mr-2" /> Code Runner
                    </h3>
                    <div className="mb-4">
            <textarea
                className="w-full p-4 bg-gray-900 text-gray-200 font-mono rounded-lg border border-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="10"
                placeholder="Enter your PySpark or Scala Spark code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
            ></textarea>
                    </div>
                    <button
                        onClick={handleRunCode}
                        disabled={isLoading}
                        className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Running..." : "Run Code"}
                    </button>
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Output</h4>
                        <pre className="w-full p-4 bg-gray-900 text-gray-200 font-mono rounded-lg border border-gray-700 whitespace-pre-wrap overflow-x-auto">
              {output}
            </pre>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-100 text-yellow-800 rounded-lg p-6 font-medium text-center border border-yellow-200">
                    <p>This is the <b>static</b> version. The code runner is not available.</p>
                    <p className="mt-2">Clone the repository to run code locally.</p>
                </div>
            )}
        </div>
    );
}

export default CodingPage;
