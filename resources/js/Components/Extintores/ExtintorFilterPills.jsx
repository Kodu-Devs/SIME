import React from "react";

export default function ExtintorFilterPills({
    activeFilter,
    onFilterChange,
    conteos = {},
}) {
    const allFilters = [
        { name: "Todos" },
        {
            name: "Disponibles",
            estatusKey: "Disponible",
            dotColor: "bg-acento-500",
        },
        {
            name: "Medio uso",
            estatusKey: "Medio uso",
            dotColor: "bg-sime-warning",
        },
        { name: "Vacíos", estatusKey: "Vacío", dotColor: "bg-primario-700" },
        {
            name: "Fuera de servicio",
            estatusKey: "Fuera de servicio",
            dotColor: "bg-neutro-600",
        },
    ];

    const totalGlobal = Object.values(conteos).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0,
    );

    const visibleFilters = allFilters.filter((filter) => {
        if (!filter.estatusKey) return true;
        return (conteos?.[filter.estatusKey] ?? 0) > 0;
    });

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-start gap-2">
                {visibleFilters.map((filter) => {
                    const isActive = activeFilter === filter.name;
                    const count = filter.estatusKey
                        ? (conteos?.[filter.estatusKey] ?? 0)
                        : totalGlobal;

                    return (
                        <button
                            key={filter.name}
                            type="button"
                            onClick={() => onFilterChange(filter.name)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                isActive
                                    ? "bg-neutro-900 text-white border-neutro-900"
                                    : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                            }`}
                        >
                            {filter.dotColor && (
                                <span
                                    className={`w-2 h-2 rounded-full ${filter.dotColor}`}
                                />
                            )}
                            <span>
                                {filter.name} ({count})
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
