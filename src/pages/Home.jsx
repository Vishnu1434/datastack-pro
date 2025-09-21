import React from "react";
import { Github, PlayCircle } from "lucide-react";

function HomePage({ isLocalMode }) {
    return (
        <div className="p-8 md:p-12 space-y-8 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome to your Data Engineering Prep App!
            </h1>
            <p className="text-lg text-gray-600">
                Your ultimate guide to mastering data engineering.
            </p>

            {isLocalMode ? (
                <p className="bg-blue-100 text-blue-800 rounded-lg p-4 font-medium">
                    <PlayCircle className="inline-block h-5 w-5 mr-2 -mt-1" />
                    You are in <b>Local Mode</b>. You can run code and interact with your
                    local Spark setup.
                </p>
            ) : (
                <a
                    href="https://github.com/your-username/your-repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-900 transition-colors"
                >
                    <Github className="h-5 w-5 mr-2 -mt-1" />
                    Get the Full App on GitHub
                </a>
            )}
        </div>
    );
}

export default HomePage;
