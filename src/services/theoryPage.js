import yaml from "js-yaml";

export async function loadTheoryQuestions() {
    try {
        const response = await fetch("data/theory/questions.yaml");
        const text = await response.text();
        const data = yaml.load(text);

        console.log("Loaded questions:", data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error loading questions.yaml:", error);
        return [];
    }
}
