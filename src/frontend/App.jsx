import React, { useState, useEffect } from "react";
import { Home, CheckCircle } from "lucide-react";

import HomePage from "./pages/Home.jsx";
import PracticePage from "./pages/Practice.jsx";

const navItems = [
    { name: "Home", icon: Home, page: "home" },
    { name: "Practice", icon: CheckCircle, page: "practice" },
];

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [isLocalMode, setIsLocalMode] = useState(false);

    // Detect if running locally
    useEffect(() => {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        if (
            protocol === "file:" ||
            hostname === "localhost" ||
            hostname === "127.0.0.1"
        ) {
            setIsLocalMode(true);
        }
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <HomePage isLocalMode={isLocalMode} />;
            case "practice":
                return <PracticePage />;
            default:
                return <HomePage isLocalMode={isLocalMode} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <button
                                key={item.page}
                                onClick={() => setCurrentPage(item.page)}
                                className={`flex items-center p-2 rounded-xl transition-colors duration-200 ${
                                    currentPage === item.page
                                        ? "bg-gray-200 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                <span className="font-medium hidden sm:inline-block">
                  {item.name}
                </span>
                            </button>
                        ))}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        <span className="text-blue-600">Data</span>Stack Pro
                    </h1>
                </nav>
            </header>

            {/* Page Content */}
            <main className="flex-grow">{renderPage()}</main>

            {/* Footer */}
            <footer className="bg-white p-4 text-center text-sm text-gray-500 shadow-inner">
                Designed & Built by Gunji Vishnu Teja.
            </footer>
        </div>
    );
}

export default App;
