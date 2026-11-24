import React from "react";

export default function ExtintoresTable({
    extintores = [],
    selectedExtintor,
    onSelectExtintor,
    footer = null,
}) {
    const renderBadge = (status = "") => {
        const s = (status || "").toLowerCase().trim();
        let config = {
            bg: "bg-neutro-50",
            text: "text-neutro-600",
            dot: "bg-neutro-300",
            label: status || "Disponible",
        };

        if (s.includes("dispon") || s.includes("operativ")) {
            config = {
                bg: "bg-acento-500/15",
                text: "text-[#10706B]",
                dot: "bg-acento-500",
                label: "Disponible",
            };
        } else if (s.includes("medio")) {
            config = {
                bg: "bg-amber-100",
                text: "text-amber-800",
                dot: "bg-sime-warning",
                label: "Medio uso",
            };
        } else if (s.includes("vac")) {
            config = {
                bg: "bg-primario-100",
                text: "text-primario-700",
                dot: "bg-primario-700",
                label: "Vacío",
            };
        } else if (s.includes("baja") || s.includes("fuera")) {
            config = {
                bg: "bg-neutro-100",
                text: "text-neutro-900",
                dot: "bg-neutro-900",
                label: "Fuera de servicio",
            };
        }

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text}`}
            >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
                {config.label}
            </span>
        );
    };

    return (
        <div>
            {/* ESCRITORIO */}
            <div className="hidden md:block bg-white rounded-xl border border-neutro-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs text-left">
                        <thead className="bg-neutro-50 text-neutro-600 font-bold text-[11px] uppercase tracking-wider border-b border-neutro-100">
                            <tr>
                                <th scope="col" className="px-4 py-3">
                                    Código
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Tipo
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Ubicación
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Próxima revisión
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-center"
                                >
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutro-100 bg-white">
                            {extintores.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-8 text-center text-xs text-neutro-600"
                                    >
                                        No hay extintores registrados para
                                        mostrar.
                                    </td>
                                </tr>
                            ) : (
                                extintores.map((extintor) => {
                                    const isSelected =
                                        selectedExtintor?.id === extintor.id;
                                    const fechaDisplay =
                                        extintor.proxima_revision &&
                                            extintor.proxima_revision !==
                                            "Sin programar"
                                            ? extintor.proxima_revision
                                            : extintor.proximo_mantenimiento ||
                                            "Sin programar";

                                    return (
                                        <tr
                                            key={extintor.id}
                                            onClick={() =>
                                                onSelectExtintor(
                                                    isSelected
                                                        ? null
                                                        : extintor,
                                                )
                                            }
                                            className={`cursor-pointer transition-colors ${isSelected
                                                    ? "bg-primario-100"
                                                    : "hover:bg-neutro-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 font-mono text-neutro-600 text-[11px]">
                                                {extintor.codigo}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-neutro-900">
                                                {extintor.tipo}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-neutro-900">
                                                    {extintor.area_nombre}
                                                </div>
                                                {(extintor.edificio ||
                                                    extintor.piso) && (
                                                        <div className="text-[11px] text-neutro-600 mt-0.5">
                                                            {extintor.edificio}{" "}
                                                            {extintor.piso
                                                                ? `- ${extintor.piso}`
                                                                : ""}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-neutro-900">
                                                {fechaDisplay}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {renderBadge(extintor.estatus)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {footer}
            </div>

            {/* MÓVIL: TARJETAS */}
            <div className="block md:hidden space-y-3">
                {extintores.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutro-600 bg-white rounded-xl border border-neutro-100 shadow-sm">
                        No hay extintores registrados para mostrar.
                    </div>
                ) : (
                    extintores.map((extintor) => {
                        const isSelected = selectedExtintor?.id === extintor.id;
                        const fechaDisplay =
                            extintor.proxima_revision &&
                                extintor.proxima_revision !== "Sin programar"
                                ? extintor.proxima_revision
                                : extintor.proximo_mantenimiento ||
                                "Sin programar";

                        return (
                            <div
                                key={extintor.id}
                                onClick={() =>
                                    onSelectExtintor(
                                        isSelected ? null : extintor,
                                    )
                                }
                                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${isSelected
                                        ? "bg-primario-100 border-primario-300"
                                        : "bg-white border-neutro-100 hover:bg-neutro-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-mono text-neutro-600">
                                        {extintor.codigo}
                                    </span>
                                    {renderBadge(extintor.estatus)}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-xs">
                                    <div>
                                        <span className="font-bold text-neutro-900">
                                            Tipo:{" "}
                                        </span>
                                        <span className="text-neutro-600 font-semibold">
                                            {extintor.tipo}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-neutro-900">
                                            Próxima revisión:{" "}
                                        </span>
                                        <span className="text-neutro-600 font-semibold">
                                            {fechaDisplay}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="font-bold text-xs text-neutro-900">
                                        {extintor.area_nombre}
                                    </div>
                                    {(extintor.edificio || extintor.piso) && (
                                        <div className="text-[11px] text-neutro-600 mt-0.5">
                                            {extintor.edificio}{" "}
                                            {extintor.piso
                                                ? `- ${extintor.piso}`
                                                : ""}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {footer && (
                    <div className="bg-white rounded-xl border border-neutro-100 shadow-xs overflow-hidden">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}