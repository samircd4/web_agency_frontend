'use client';

export default function ClientRow({ client, isActive, onClick }) {
    const initials = client.first_name && client.last_name
        ? `${client.first_name[0]}${client.last_name[0]}`.toUpperCase()
        : (client.username || 'CL').slice(0, 2).toUpperCase();

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${
                isActive ? 'bg-brand-teal/10' : ''
            }`}
        >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-xs border border-white/10 shrink-0">
                {initials}
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white truncate">
                        {client.first_name && client.last_name
                            ? `${client.first_name} ${client.last_name}`
                            : client.username}
                    </span>
                    <span className="text-[8px] font-bold text-slate-600 shrink-0 ml-2">
                        04:41 AM
                    </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {client.email || 'No email attached'}
                </p>
            </div>
        </button>
    );
}