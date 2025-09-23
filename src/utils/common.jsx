import SparkIcon from "../icons/spark.svg";
import PythonIcon from "../icons/python.svg";
import JavaIcon from "../icons/java.svg";
import SqlIcon from "../icons/sql.svg";
import AirflowIcon from "../icons/airflow.svg";
import DefaultIcon from "../icons/default.svg";

export const iconForStack = (stack) => {
    if (!stack) return <img src={DefaultIcon} alt="Default" className="w-6 h-6" />;
    const s = stack.toLowerCase();
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