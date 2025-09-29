import yaml
import os

class SingleLineDumper(yaml.SafeDumper):
    def represent_scalar(self, tag, value, style=None):
        # Force plain style unless value has newlines
        if style is None:
            if "\n" in value:
                style = "|"  # keep multiline if explicitly inside
            else:
                style = None  # plain style (single line)
        return super().represent_scalar(tag, value, style)

class Temp:
    def __init__(self, stack):
        self.stack = stack
        self.data_root = "../public/data/"
        self.theory_file_path = f"../public/data/{stack}/theory.yaml"
        self.mcqs_file_path = f"../public/data/{stack}/mcqs.yaml"
        self.manifest_file_path = f"../public/data/stack_manifest.yaml"

    def read_yaml_file(self, file_path):
        with open(file_path, 'r') as file:
            return yaml.safe_load(file)

    def write_yaml_file(self, file_path, data):
        yaml_str = yaml.dump(
            data,
            sort_keys=False,
            allow_unicode=True,
            default_flow_style=False,
            Dumper=SingleLineDumper,
            width=10000
        )

        yaml_str = yaml_str.replace("\n- ", "\n\n- ")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(yaml_str)

    def topic_wise_count(self):
        counter = {}

        def iterate_and_count(data, type):
            for question in data:
                topic = question.get('topic')

                if topic in counter:
                    if type in counter[topic]:
                        counter[topic][type] += 1
                    else:
                        counter[topic][type] = 1
                else:
                    counter[topic] = {type: 1}

        iterate_and_count(self.read_yaml_file(self.theory_file_path), "theory")
        iterate_and_count(self.read_yaml_file(self.mcqs_file_path), "mcqs")

        self.write_yaml_file(f"{self.stack}/topic_wise_counts.yaml", counter)

    def topic_wise_questions(self):
        final_data = {}

        def iterate_for_question(data, type):
            for question in data:
                topic = question.get('topic')

                if topic in final_data:
                    if type in final_data[topic]:
                        final_data[topic][type].append(question.get("question"))
                    else:
                        final_data[topic][type] = [question.get("question")]
                else:
                    final_data[topic] = {type: [question.get("question")]}

        iterate_for_question(self.read_yaml_file(self.theory_file_path), "theory")
        iterate_for_question(self.read_yaml_file(self.mcqs_file_path), "mcqs")

        self.write_yaml_file(f"{self.stack}/topic_wise_questions.yaml", final_data)

    def rearrange_ids(self):
        def iterate_for_question(data):
            id = 1
            for question in data:
                question["id"] = id
                id += 1

            return data

        t_data = iterate_for_question(self.read_yaml_file(self.theory_file_path))
        m_data = iterate_for_question(self.read_yaml_file(self.mcqs_file_path))

        self.write_yaml_file(f"../public/data/{self.stack}/theory_new.yaml", t_data)
        self.write_yaml_file(f"../public/data/{self.stack}/mcqs_new.yaml", m_data)

    def normalize_topic(self):
        toppics_mapping = {
            "constraints": "Constraints",
            "window-functions": "Window Functions",
            "select": "Select",
            "update": "Update",
            "joins": "Joins",
            "indexing": "Indexing",
            "data-types": "Data Types",
            "normalization": "Normalization",
            "optimization": "Optimization",
            "aggregation": "Aggregation",
            "keys": "Keys",
            "basics": "Basics",
            "ddl": "DDL",
            "views": "Views",
            "delete": "Delete",
            "dml": "DML",
            "performance": "Performance",
            "functions": "Functions",
            "subqueries": "Subqueries",
            "transactions": "Transactions",
        }

        def iterate_for_question(data):
            for question in data:
                if question["topic"] in toppics_mapping:
                    question["topic"] = toppics_mapping[question["topic"]]

            return data

        t_data = iterate_for_question(self.read_yaml_file(self.theory_file_path))
        m_data = iterate_for_question(self.read_yaml_file(self.mcqs_file_path))

        self.write_yaml_file(f"../public/data/{self.stack}/theory_new.yaml", t_data)
        self.write_yaml_file(f"../public/data/{self.stack}/mcqs_new.yaml", m_data)

    def generate_manifest(self):
        def get_the_topics(directory, file, current_list):
            topics = []
            with open(f"{directory}/{file}", 'r') as file:
                yaml_data = yaml.safe_load(file)

                for question in yaml_data:
                    if question['topic'] not in current_list:
                        topics.append(question['topic'])
            topics = list(set(topics))
            return topics

        manifest = {}

        for root, dirs, files in os.walk(self.data_root):
            if root == self.data_root:
                continue

            parts = root.replace("\\", "/").split("/")
            stack_name = parts[-1]

            if stack_name not in manifest:
                manifest[stack_name] = {"types": [], "topics": []}

            topics_list = []
            if "theory.yaml" in files:
                manifest[stack_name]["types"].append("theory")
                topics_list += get_the_topics(root, "theory.yaml", topics_list)
            if "mcqs.yaml" in files:
                manifest[stack_name]["types"].append("mcqs")
                topics_list += get_the_topics(root, "mcqs.yaml", topics_list)

            manifest[stack_name]["topics"] += topics_list

        with open(self.manifest_file_path, "w") as f:
            yaml.safe_dump(manifest, f, default_flow_style=False, sort_keys=False)

        print(f"stack_manifest.yaml generated at {self.manifest_file_path}")

if __name__ == "__main__":
    stack = "Spark"
    temp = Temp(stack)
    temp.rearrange_ids()
    # temp.generate_manifest()