// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App


import React, { useState, useEffect } from 'react';
import { Book, CheckCircle, Code, Home, PlayCircle, Github } from 'lucide-react';

const navItems = [
    { name: 'Home', icon: Home, page: 'home' },
    { name: 'Theory', icon: Book, page: 'theory' },
    { name: 'MCQs', icon: CheckCircle, page: 'mcqs' },
    { name: 'Coding Questions', icon: Code, page: 'coding' },
];

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isLocalMode, setIsLocalMode] = useState(false);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('Output will appear here.');
    const [isLoading, setIsLoading] = useState(false);

    // Detect if the app is running locally (e.g., file:// or localhost)
    useEffect(() => {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        if (protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1') {
            setIsLocalMode(true);
        }
    }, []);

    const handleRunCode = async () => {
        // This is a placeholder. In the full local version, this will be an API call.
        if (!isLocalMode) return;

        setIsLoading(true);
        setOutput('Running code...');

        try {
            const response = await fetch('http://localhost:8000/run-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code }),
            });

            const data = await response.json();
            if (response.ok) {
                setOutput(data.output);
            } else {
                setOutput(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('API call failed:', error);
            setOutput('Error: Could not connect to the local server.');
        } finally {
            setIsLoading(false);
        }
    };

    const Page = ({ children }) => (
        <div className="p-8 md:p-12 space-y-8 max-w-4xl mx-auto">
            {children}
        </div>
    );

    const HomeSection = () => (
        <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome to your Data Engineering Prep App!
            </h1>
            <p className="text-lg text-gray-600">
                Your ultimate guide to mastering data engineering.
            </p>
            {isLocalMode && (
                <p className="bg-blue-100 text-blue-800 rounded-lg p-4 font-medium">
                    <PlayCircle className="inline-block h-5 w-5 mr-2 -mt-1" />
                    You are in **Local Mode**. You can run code and interact with your local Spark setup.
                </p>
            )}
            {!isLocalMode && (
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

    const TheorySection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Theory Questions</h2>
            <p className="text-gray-600">
                Dive deep into the core concepts of data engineering.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Q1. What is the CAP Theorem?</h3>
                <details className="mt-4 p-4 bg-white rounded-lg border">
                    <summary className="font-semibold text-gray-700 cursor-pointer">Show Answer</summary>
                    <p className="mt-2 text-gray-600">
                        The CAP theorem states that a distributed data store can only provide two of the three guarantees: Consistency, Availability, and Partition Tolerance.
                    </p>
                </details>
            </div>
        </div>
    );

    const MCQsSection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Multiple Choice Questions</h2>
            <p className="text-gray-600">
                Test your knowledge on key data engineering technologies.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Q1. Which of the following is an ETL tool?</h3>
                <ul className="space-y-2 text-gray-700">
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">A) Tableau</li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">B) Apache Airflow</li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">C) Apache Kafka</li>
                    <li className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">D) Informatica</li>
                </ul>
                <details className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <summary className="font-semibold text-green-800 cursor-pointer">Show Answer</summary>
                    <p className="mt-2 text-green-700">D) Informatica</p>
                </details>
            </div>
        </div>
    );

    const CodingSection = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Coding Questions</h2>
            <p className="text-gray-600">
                Practice your skills with hands-on coding challenges.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Q1. Find the average salary per department.</h3>
                <p className="text-gray-600">
                    Write a PySpark or Scala Spark program to calculate the average salary for each department from a given dataset.
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
                        {isLoading ? 'Running...' : 'Run Code'}
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
                    <p>This is the **static** version. The code runner is not available.</p>
                    <p className="mt-2">Clone the repository to run code locally.</p>
                </div>
            )}
        </div>
    );

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomeSection />;
            case 'theory':
                return <TheorySection />;
            case 'mcqs':
                return <MCQsSection />;
            case 'coding':
                return <CodingSection />;
            default:
                return <HomeSection />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <button
                                key={item.page}
                                onClick={() => setCurrentPage(item.page)}
                                className={`flex items-center p-2 rounded-xl transition-colors duration-200 ${
                                    currentPage === item.page
                                        ? 'bg-gray-200 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                <span className="font-medium hidden sm:inline-block">{item.name}</span>
                            </button>
                        ))}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        <span className="text-blue-600">Data</span>Stack Pro
                    </h1>
                </nav>
            </header>

            <main className="flex-grow">
                {renderPage()}
            </main>

            <footer className="bg-white p-4 text-center text-sm text-gray-500 shadow-inner mt-8">
                Designed & Built by Gunji Vishnu Teja.
            </footer>
        </div>
    );
}

export default App;
