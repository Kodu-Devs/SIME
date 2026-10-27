import React from 'react';

export default function ExtintorFilterPills({ activeFilter = 'Todos', onFilterChange }) {
    const filterOptions = [
        { name: 'Todos', dot: null },
        { name: 'Disponibles', dot: 'bg-[#1C9691]' },
        { name: 'Medio uso', dot: 'bg-[#F2994A]' },
        { name: 'Vacíos', dot: 'bg-[#C0262D]' },
        { name: 'Fuera de servicio', dot: 'bg-neutral-800' }
    ];

    return (
        <div className="flex items-center justify-between gap-1 sm:gap-2 w-full mb-5 font-['Manrope']">
            {filterOptions.map((filter) => {
                const isActive = activeFilter === filter.name;
                return (
                    <button
                        key={filter.name}
                        type="button"
                        onClick={() => onFilterChange(filter.name)}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-all text-center ${isActive
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                            }`}
                    >
                        {filter.dot && (
                            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${filter.dot}`} />
                        )}
                        <span className="truncate">{filter.name}</span>
                    </button>
                );
            })}
        </div>
    );
}