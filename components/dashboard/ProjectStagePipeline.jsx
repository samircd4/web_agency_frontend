import React from 'react';

export default function ProjectStagePipeline({ project, stages = null }) {
    // Default to client stages
    const defaultStages = ['Requirements', 'Architecture', 'Dev', 'QA', 'Deploying', 'Complete'];
    const pipelineStages = stages || defaultStages;

    // Create stage index map dynamically
    const stageIndexMap = Object.fromEntries(
        pipelineStages.map((s, i) => [s, i])
    );
    const stageIndex = stageIndexMap[project.stage] ?? 0;

    return (
        <div className="p-3 lg:p-4 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center mb-2">
                {pipelineStages.map((s, si) => (
                    <React.Fragment key={s}>
                        <div
                            className={`shrink-0 w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full border-2 transition-all ${si < stageIndex ? 'bg-brand-teal border-brand-teal'
                                : si === stageIndex ? 'bg-brand-teal/40 border-brand-teal animate-pulse'
                                    : 'bg-white/5 border-white/10'
                                }`}
                        />
                        {si < pipelineStages.length - 1 && (
                            <div
                                className={`flex-1 h-px ${si < stageIndex ? 'bg-brand-teal' : 'bg-white/10'
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="flex justify-between gap-1">
                {pipelineStages.map((s, si) => (
                    <span
                        key={s}
                        className={`text-[10px] font-black uppercase tracking-widest flex-1 text-center truncate ${si === stageIndex ? 'text-brand-teal animate-pulse'
                            : si < stageIndex ? 'text-secondary'
                                : 'text-muted'
                            }`}
                    >
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
}
