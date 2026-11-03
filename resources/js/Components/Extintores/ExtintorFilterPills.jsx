export default function ExtintorFilterPills({ activeFilter, onFilterChange }) {
    const filters = [
        { name: 'Todos' },
        { name: 'Disponibles', dotColor: 'bg-[#1C9691]' },
        { name: 'Medio uso', dotColor: 'bg-[#F2994A]' },
        { name: 'Vacíos', dotColor: 'bg-[#C0262D]' },
        { name: 'Fuera de servicio', dotColor: 'bg-neutral-800' },
    ];

    return (
        <div className="w-full mb-5">

            <div className="flex flex-wrap items-center justify-start gap-2">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.name;

                    return (
                        <button
                            key={filter.name}
                            type="button"
                            onClick={() => onFilterChange(filter.name)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${isActive
                                ? 'bg-neutral-900 text-white border border-neutral-900'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
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