import React from 'react';

export default function ProjectHeader({ project }) {
    return (
        <div className="p-2 lg:p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="">
                <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">
                    {project.id} • {project.priority || 'Standard'} Priority
                </div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">
                    {project.title}
                </h1>
            </div>
        </div>
    );
}
