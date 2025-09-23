import yaml from "js-yaml";

import SparkIcon from "../icons/spark.svg";
import PythonIcon from "../icons/python.svg";
import JavaIcon from "../icons/java.svg";
import SqlIcon from "../icons/sql.svg";
import AirflowIcon from "../icons/airflow.svg";
import DefaultIcon from "../icons/default.svg";

export const iconForStack = (stack) => {
    if (!stack) return <img src={DefaultIcon} alt="Default" className="w-6 h-6" />;
    const s = String(stack).toLowerCase();
    if (s.includes("pyspark")) return <img src={SparkIcon} alt="PySpark" className="w-6 h-6" />;
    if (s.includes("spark")) return <img src={SparkIcon} alt="Spark" className="w-6 h-6" />;
    if (s.includes("python")) return <img src={PythonIcon} alt="Python" className="w-6 h-6" />;
    if (s.includes("java")) return <img src={JavaIcon} alt="Java" className="w-6 h-6" />;
    if (s.includes("sql")) return <img src={SqlIcon} alt="SQL" className="w-6 h-6" />;
    if (s.includes("airflow")) return <img src={AirflowIcon} alt="Airflow" className="w-6 h-6" />;
    return <img src={DefaultIcon} alt="Default" className="w-6 h-6" />;
};

export const difficultyBadge = (level) => {
    const lvl = (level || "").toLowerCase();
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (lvl === "easy") return <span className={`${base} bg-green-100 text-green-700`}>Easy</span>;
    if (lvl === "medium") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Medium</span>;
    if (lvl === "hard") return <span className={`${base} bg-red-100 text-red-700`}>Hard</span>;
    return <span className={`${base} bg-gray-100 text-gray-700`}>{level || "N/A"}</span>;
};

// Filter questions by selected difficulty, tech stack, and topic.
// Each filter array is optional; when empty, that dimension is not filtered.
export const filterQuestions = (
    questions,
    { difficulties = [], techStacks = [], topics = [] } = {}
) => {
    if (!Array.isArray(questions) || !questions.length) return [];

    const norm = (v) => String(v || "").trim().toLowerCase();

    const canonicalStack = (s) => {
        const v = norm(s);
        if (!v) return "";
        if (v.includes("pyspark")) return "pyspark";
        if (v.includes("spark")) return "spark";
        if (v.includes("airflow")) return "airflow";
        if (v.includes("python")) return "python";
        if (v.includes("java")) return "java";
        if (v.includes("sql")) return "sql";
        return v;
    };

    const diffSet = new Set(difficulties.map(norm));
    const techSet = new Set(techStacks.map(canonicalStack));
    const topicSet = new Set(topics.map(norm));

    const hasAny = (set) => set && set.size > 0;

    const extractStacks = (q) => {
        const acc = [];
        if (q && q.stack) acc.push(q.stack);
        if (q && q.source) acc.push(q.source);
        if (q && Array.isArray(q.stacks)) acc.push(...q.stacks);
        return acc.map(canonicalStack).filter(Boolean);
    };

    const extractTopics = (q) => {
        const acc = [];
        if (q && q.topic) acc.push(q.topic);
        if (q && Array.isArray(q.topics)) acc.push(...q.topics);
        if (q && Array.isArray(q.tags)) acc.push(...q.tags);
        if (q && Array.isArray(q.categories)) acc.push(...q.categories);
        return acc.map(norm).filter(Boolean);
    };

    return questions.filter((q) => {
        const qDiff = norm(q.difficulty);
        const qStacks = extractStacks(q);
        const qTopics = extractTopics(q);

        const passDiff = !hasAny(diffSet) || diffSet.has(qDiff);
        const passTech = !hasAny(techSet) || qStacks.some((s) => techSet.has(s));
        const passTopic = !hasAny(topicSet) || qTopics.some((t) => topicSet.has(t));
        return passDiff && passTech && passTopic;
    });
};

export const load_manifest = async () => {
    try {
        const response = await fetch("data/stack_manifest.yaml");

        const text = await response.text();
        const manifest = yaml.load(text); // parse YAML into JS object

        const techStacks = []
        const topicsByStack = {};

        for (const [stack, stackData] of Object.entries(manifest)) {
            console.log(stack);
            techStacks.push(stack);
            topicsByStack[stack.charAt(0).toUpperCase() + stack.slice(1)] = stackData.topics || [];
        }
        console.log(techStacks);
        return { techStacks, topicsByStack };
    } catch (error) {
        console.error("Error loading stack_manifest.yaml:", error);
        return { techStacks: [], topicsByStack: {} };
    }
};
