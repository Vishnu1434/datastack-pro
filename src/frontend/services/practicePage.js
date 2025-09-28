import yaml from "js-yaml";

export async function loadQuestions(type = "theory") {
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
