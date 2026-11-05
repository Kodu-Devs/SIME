import React from 'react';

export default function ExtintorFilterPills({ activeFilter, onFilterChange }) {
    const filters = [
        { name: 'Todos' },
        { name: 'Disponibles', dotColor: 'bg-[#1C9691]' },
        { name: 'Medio uso', dotColor: 'bg-[#F2994A]' },
        { name: 'Vacíos', dotColor: 'bg-[#C0262D]' },
        { name: 'Fuera de servicio', dotColor: 'bg-[#6D6162]' },
    ];

    return (
        <div className="w-full mb-4 font-['Manrope']">
            <div className="flex flex-wrap items-center justify-start gap-2.5">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.name;

                    return (
                        <button
                            key={filter.name}
                            type="button"
                            onClick={() => onFilterChange(filter.name)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${isActive
                                ? 'bg-[#272222] text-white border border-[#272222]'
                                : 'bg-white text-[#272222] border border-[#D7D4D4] hover:bg-[#F1F0F0]'
                                }`}
                        >
                            {filter.dotColor && (
                                <span className={`w-2 h-2 rounded-full ${filter.dotColor}`} />
                            )}
                            {filter.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}