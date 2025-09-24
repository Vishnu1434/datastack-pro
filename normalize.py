import os
import yaml
from pathlib import Path

# -------- Topic Mapping (Old → New) --------
TOPIC_MAPPING = {
    "rdd_operations": "RDD",
    "rdd": "RDD",
    "actions": "Actions",
    "transformations": "Transformations",
    "dataframe": "DataFrames",
    "dataframes": "DataFrames",
    "datasets": "Datasets",
    "dataframes_vs_datasets": "DataFrames",
    "spark-core": "Basics",
    "spark basics": "Basics",
    "spark sql": "Spark SQL",
    "sql": "SQL",
    "window_functions": "Window Functions",
    "udf": "UDF",
    "optimization": "Optimization",
    "query_optimization": "Optimization",
    "shuffle optimization": "Optimization",
    "skew mitigation": "Data Skew",
    "data_skew": "Data Skew",
    "resource tuning": "Resource Tuning",
    "caching strategies": "Caching",
    "persistence": "Caching",
    "partitioning": "Partitioning",
    "serialization": "Serialization",
    "garbage collection": "Memory Management",
    "memory management": "Memory Management",
    "dag scheduler": "DAG Scheduler",
    "task scheduling": "Task Scheduling",
    "dynamic resource allocation": "Resource Tuning",
    "cluster managers": "Cluster Managers",
    "tungsten project": "Tungsten Engine",
    "fault tolerance": "Fault Tolerance",
    "fault_tolerance": "Fault Tolerance",
    "checkpointing": "Checkpointing",
    "logging": "Logging",
    "spark monitoring": "Monitoring",
    "spark debugging": "Debugging",
    "structured streaming": "Structured Streaming",
    "spark-streaming": "Spark Streaming",
    "incremental etl": "Incremental ETL",
    "change data capture": "Data Capture",
    "deployment": "Deployment",
    "cloud deployments": "Deployment",
    "spark on kubernetes": "Kubernetes",
    "multi-tenancy": "Multi-Tenancy",
    "spark security": "Spark Security",
    "lakehouse architecture": "Lake House",
    "lakehouse integration": "Lake House",
    "lakehouse comparison": "Lake House",
    "delta lake": "Delta Lake",
    "apache hudi": "Apache Hudi",
    "apache iceberg": "Apache Iceberg",
    "hive": "Hive",
    "data source": "Data Sources",
    "aqe": "AQE",
    "AQE": "AQE"
}


def normalize_topic(topic: str) -> str:
    """Return normalized topic name if found, else original."""
    if not topic:
        return topic
    return TOPIC_MAPPING.get(topic.strip(), topic.strip())


# ---- Custom Dumper to keep long strings in single line ----
class SingleLineDumper(yaml.SafeDumper):
    def represent_scalar(self, tag, value, style=None):
        # Force plain style unless value has newlines
        if style is None:
            if "\n" in value:
                style = "|"  # keep multiline if explicitly inside
            else:
                style = None  # plain style (single line)
        return super().represent_scalar(tag, value, style)


def process_yaml_file(file_path: Path, start_id: int) -> tuple[list, int]:
    """Load YAML, normalize topics, reassign ids sequentially."""
    if not file_path.exists():
        return [], start_id

    with open(file_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or []

    for q in data:
        q.pop("id", None)  # remove old id
        if "topic" in q:
            q["topic"] = normalize_topic(q["topic"])
        q["id"] = start_id
        start_id += 1

    # Dump YAML with spacing between items
    yaml_str = yaml.dump(
        data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
        Dumper=SingleLineDumper,
        width=10000  # large width prevents line breaks
    )

    # Add a blank line between questions
    yaml_str = yaml_str.replace("\n- ", "\n\n- ")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(yaml_str)

    return data, start_id


def process_folder(folder_path: str):
    folder = Path(folder_path)

    # start ids from 1
    current_id = 1

    for file_name in ["mcqs.yaml", "theory.yaml"]:
        file_path = folder / file_name
        _, current_id = process_yaml_file(file_path, current_id)

# ---------- Run ----------
if __name__ == "__main__":
    folder = "public/data/spark"  # 👈 change to your folder path
    process_folder(folder)
    print("✅ Processing complete! Topics normalized and IDs reassigned.")
