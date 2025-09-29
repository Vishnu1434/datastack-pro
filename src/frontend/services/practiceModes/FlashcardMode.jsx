import React, { useState, useEffect } from "react";
import { shuffleQuestions, useEffectLoadQuestions } from "../practicePage.jsx";
import { BookOpen, Shuffle } from "lucide-react";
import { iconForStack, difficultyBadge, filterQuestions } from "../../utils/common.jsx";
import { BuildingModeBanner, LoadingBanner, NoQuestionsFoundBanner } from "../../utils/infoBanners.jsx";


// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function FlashcardMode(props) {
  const {difficulty, techStack, topic, practiceType} = props;

  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffectLoadQuestions("theory", {setAllQuestions, setLoading})

  useEffect(() => {
    setQuestions(() => filterQuestions(allQuestions, {
      difficulties: difficulty,
      techStacks: techStack,
      topics: topic
    }));
    setOpenIndex(null);
  }, [difficulty, techStack, topic, allQuestions]);

  const toggleAnswer = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));
  const shuffleData = () => setQuestions((prev) => shuffleQuestions(prev));

  if (loading) {
    return LoadingBanner("flashcards")
  }

  if (!questions.length) return NoQuestionsFoundBanner();

  switch (practiceType) {
    case "Self-Paced":
      return selfPaceMode(shuffleData, toggleAnswer, {questions, openIndex});
    default:
      return <BuildingModeBanner/>;
  }
}

function selfPaceMode(shuffleQuestions, toggleAnswer, {questions, openIndex}) {
  return (
      <div className="flex flex-col flex-1 h-screen bg-gray-50 rounded-md overflow-hidden min-h-0">
      {/* Header - stays fixed, no scroll */}
      <div className="flex items-center justify-between p-3 bg-white shadow-sm flex-shrink-0 w-full">
        <h3 className="text-lg font-bold text-gray-900">
          <span className="text-blue-600">Theory</span> Questions ({questions.length})
        </h3>
        <button
            onClick={shuffleQuestions}
            aria-label="Shuffle questions"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          <Shuffle size={16}/>
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      {/* Only this container scrolls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {questions.map((q, idx) => (
            <article
                key={`${q.question}-${idx}`}
                className="bg-white rounded-md shadow p-4 hover:shadow-md transition-shadow w-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg">
                  {iconForStack(q.stack || q.source || "")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900">{q.question}</h4>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {difficultyBadge(q.difficulty)}
                      <button
                          onClick={() => toggleAnswer(idx)}
                          className={`p-2 rounded-md transition ${
                              openIndex === idx
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        <BookOpen size={18}/>
                      </button>
                    </div>
                  </div>

                  {openIndex === idx && (
                      <div className="mt-3 text-gray-700 text-sm border-t pt-3">{q.answer}</div>
                  )}
                </div>
              </div>
            </article>
        ))}
      </div>
    </div>
  )
}
