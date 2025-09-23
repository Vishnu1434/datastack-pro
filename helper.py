import os
import yaml

def get_the_topics(directory, file):
    topics = []
    with open(f"{directory}/{file}", 'r') as file:
        yaml_data = yaml.safe_load(file)

        for question in yaml_data:
            topics.append(question['topic'])
    topics = list(set(topics))
    return topics

def generate_stack_manifest(data_root="public/data/", output_file="public/data/stack_manifest.yaml"):
    """
    Scans all folders under data_root and creates a stack_manifest.yaml file
    listing modes and topics for each top-level stack (e.g., spark, python, sql).
    """
    manifest = {}

    for root, dirs, files in os.walk(data_root):
        # Skip the root itself, only check subfolders
        if root == data_root:
            continue

        # Extract the stack name (top-level folder)
        parts = root.replace("\\", "/").split("/")  # handle Windows path separators
        stack_name = parts[2] if len(parts) >= 3 else parts[1]

        # Initialize the stack entry if not present
        if stack_name not in manifest:
            manifest[stack_name] = {"types": [], "topics": []}

        # If the final folder contains theory.yaml or mcqs.yaml, add modes
        if "theory.yaml" in files:
            manifest[stack_name]["types"].append("theory")
            manifest[stack_name]["topics"] += get_the_topics(root, "theory.yaml")
        if "mcqs.yaml" in files:
            manifest[stack_name]["types"].append("mcqs")
            manifest[stack_name]["topics"] += get_the_topics(root, "mcqs.yaml")

    with open(output_file, "w") as f:
        yaml.safe_dump(manifest, f, default_flow_style=False, sort_keys=False)

    print(f"stack_manifest.yaml generated at {output_file}")

generate_stack_manifest()
