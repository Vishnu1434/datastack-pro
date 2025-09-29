// compute detailed report data (score and topic strengths based on ATTEMPTED questions only)
// const computeReport = () => {
//     const stacks = Array.from(new Set(questions.map((q) => q.stack || q.source || "Unknown")));
//     const perStack = stacks.map((stack) => {
//         const indices = questions
//             .map((qq, idx) => ({ qq, idx }))
//             .filter(({ qq }) => (qq.stack || qq.source || "Unknown") === stack)
//             .map(({ idx }) => idx);
//         const total = indices.length;
//         const correct = indices.filter((i) => responses[i] && responses[i].status === "correct").length;
//         const incorrect = indices.filter((i) => responses[i] && responses[i].status === "incorrect").length;
//         const skipped = indices.filter((i) => responses[i] && responses[i].status === "skipped").length;
//         // 'attempted' should mean questions that the user saw (not 'unseen')
//         const attempted = indices.filter((i) => responses[i] && responses[i].status && responses[i].status !== "unseen").length;
//         const score = attempted ? Math.round((correct / attempted) * 100) : 0;
//
//         // topic analysis for this stack (based on questions the user saw)
//         const topicMap = {};
//         indices.forEach((i) => {
//             const topicKey = questions[i].topic || questions[i].topics || "General";
//             // topic might be string or array; normalize to string
//             const t = Array.isArray(topicKey) ? topicKey[0] : topicKey;
//             if (!topicMap[t]) topicMap[t] = { attempted: 0, correct: 0 };
//             const resp = responses[i];
//             if (resp && resp.status && resp.status !== "unseen") {
//                 topicMap[t].attempted += 1;
//                 if (resp.status === "correct") topicMap[t].correct += 1;
//             }
//         });
//
//         const topics = Object.entries(topicMap).map(([t, v]) => ({ topic: t, attempted: v.attempted, correct: v.correct, percent: v.attempted ? Math.round((v.correct / v.attempted) * 100) : 0 }));
//         const strongest = topics.slice().sort((a, b) => b.percent - a.percent).slice(0, 3);
//         const weakest = topics.slice().sort((a, b) => a.percent - b.percent).slice(0, 3);
//
//         return { stack, total, attempted, correct, incorrect, skipped, score, strongest, weakest };
//     });
//
//     return perStack;
// };

export function computeReport() {
    return (
        <div>
            <p>This is Report</p>
        </div>
    )
}