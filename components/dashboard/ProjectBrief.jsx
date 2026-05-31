import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Terminal } from 'lucide-react';

export default function ProjectBrief({ project }) {
    return (
        <section>
            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                <Terminal size={12} className="text-brand-teal" />
                Project Brief
            </div>
            <div className="custom-markdown text-secondary">
                {project.description ? (
                    <ReactMarkdown
                        components={{
                            h1: ({ ...props }) => <h1 className="text-xl font-black text-white mb-4 mt-0" {...props} />,
                            h2: ({ ...props }) => <h2 className="text-lg font-bold text-white mb-3 mt-4" {...props} />,
                            h3: ({ ...props }) => <h3 className="text-base font-bold text-brand-teal mb-2 mt-3" {...props} />,
                            p: ({ ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                            ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                            ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                            li: ({ ...props }) => <li className="text-secondary" {...props} />,
                            a: ({ ...props }) => <a className="text-brand-teal hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            blockquote: ({ ...props }) => <blockquote className="border-l-4 border-brand-teal pl-4 italic text-secondary my-4" {...props} />,
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <pre className="bg-white/5 border border-white/10 p-3 rounded-lg overflow-x-auto text-sm mb-3">
                                        <code className={className} {...props}>{children}</code>
                                    </pre>
                                ) : (
                                    <code className="bg-white/10 px-1 py-0.5 rounded text-brand-teal text-sm font-mono" {...props}>{children}</code>
                                );
                            },
                            hr: ({ ...props }) => <hr className="border-white/10 my-4" {...props} />,
                            strong: ({ ...props }) => <strong className="text-white font-bold" {...props} />,
                            em: ({ ...props }) => <em className="italic text-white/90" {...props} />,
                        }}
                    >
                        {project.description}
                    </ReactMarkdown>
                ) : (
                    <p className="text-muted">No detailed brief provided.</p>
                )}
            </div>
        </section>
    );
}
