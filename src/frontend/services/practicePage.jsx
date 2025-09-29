import yaml from "js-yaml";
import React, {useEffect} from "react";

import FlashcardMode from "./practiceModes/FlashcardMode.jsx";
import MCQMode from "./practiceModes/MCQMode.jsx";
import SurvivalMode from "./practiceModes/SurvivalMode.jsx";
import {BuildingModeBanner} from "../utils/infoBanners.jsx";

export async function loadQuestions(type) {
    try {
        const allQuestions = [];

        // Load stack_manifest.yaml
        const manifestResponse = await fetch("data/stack_manifest.yaml");
        const manifestText = await manifestResponse.text();
        const manifest = yaml.load(manifestText); // YAML -> JS object

        for (const [techStack, stackObject] of Object.entries(manifest)) {
            // Check if this stack contains the requested type
            if (!stackObject.types || !stackObject.types.includes(type)) continue;

            try {
                const response = await fetch(`data/${techStack}/${type}.yaml`);
                if (!response.ok) {
                    console.warn(`No ${type}.yaml in ${techStack}`);
                    continue;
                }

                const text = await response.text();
                const data = yaml.load(text);

                if (Array.isArray(data)) {
                    allQuestions.push(...data);
                }
            } catch (error) {
                console.error(`Error loading ${type}.yaml from ${techStack}:`, error);
            }
        }

        return allQuestions;
    } catch (error) {
        console.error("Error loading questions:", error);
        return [];
    }
}

// Filtering topics based on selected tech stacks
export function filterTopics(selectedTechStacks, topicsByStack, setAvailableTopics, setSelectedTopics) {
    useEffect(() => {
        const unique = Array.from(
            new Set(selectedTechStacks.flatMap((stack) => topicsByStack[stack] || []))
        );

        setAvailableTopics(unique);
        setSelectedTopics((prev) => prev.filter((t) => unique.includes(t)));
    }, [selectedTechStacks]);
}

export const renderModeComponent = (activeMode, props) => {
    switch (activeMode) {
        case "Flashcards":``
            return <FlashcardMode {...props} />;
        case "MCQs":
            return <MCQMode {...props} />;
        case "Survival Mode":
            return <SurvivalMode {...props} />;
        default:
            return <BuildingModeBanner/>;
    }
};