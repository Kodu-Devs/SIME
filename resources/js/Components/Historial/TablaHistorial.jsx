const COLOR_EXTINTOR = {
    por_vencer: "text-orange-600",
    vencido: "text-red-600",
    default: "text-gray-900",
};

const CHIP_DESCARGA = {
    total: { texto: "Total", clase: "bg-red-100 text-red-700" },
    parcial: { texto: "Parcial", clase: "bg-amber-100 text-amber-700" },
};

function formatearFecha(fecha) {
    if (!fecha) return "";
    const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio.slice(-2)}`;
}

export default function TablaHistorial({ eventos = [], footer = null }) {
    const obtenerDatosFila = (evento) => {
        const esUso = evento.tipo_evento === "Uso";
        const chip = esUso ? CHIP_DESCARGA[evento.subtipo] : null;
        const ub = evento.extintor?.ubicacion;
        const ubicacion = [ub?.piso?.instalacion?.nombre, ub?.piso?.nombre]
            .filter(Boolean)
            .join(" - ");
        const linea1 = esUso
            ? [evento.tipo_evento, evento.tipo_motivo]
                  .filter(Boolean)
                  .join(" · ")
            : [evento.tipo_evento, evento.subtipo].filter(Boolean).join(" · ");
        const linea2 = [evento.detalle, evento.capacitacion?.nombre]
            .filter(Boolean)
            .join(" · ");

        return { chip, ubicacion, linea1, linea2 };
    };

    return (
        <div>
            <div className="hidden md:block bg-white rounded-xl border border-neutro-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs">
                        <thead className="bg-neutro-50 text-neutro-600 font-bold text-[11px] uppercase tracking-wider border-b border-neutro-100">
                            <tr>
                                <th scope="col" className="px-4 py-2">
                                    Fecha
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Extintor
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Ubicación
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Evento/Motivo
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutro-100 bg-white">
                            {eventos.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No hay eventos para mostrar.
                                    </td>
                                </tr>
                            )}

                            {eventos.map((evento) => {
                                const { chip, ubicacion, linea1, linea2 } =
                                    obtenerDatosFila(evento);

                                return (
                                    <tr
                                        key={evento.id}
                                        className="hover:bg-neutro-50/70 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {formatearFecha(evento.fecha)}
                                        </td>

                                        <td
                                            className={`px-4 py-3 font-mono text-[11px] whitespace-nowrap ${
                                                COLOR_EXTINTOR[
                                                    evento.estado_vencimiento
                                                ] ?? COLOR_EXTINTOR.default
                                            }`}
                                        >
                                            {
                                                evento.extintor
                                                    ?.etiqueta_inventario
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-gray-500">
                                            {ubicacion}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-900">
                                                <span>{linea1}</span>
                                                {chip && (
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${chip.clase}`}
                                                    >
                                                        {chip.texto}
                                                    </span>
                                                )}
                                            </div>
                                            {linea2 && (
                                                <div className="text-gray-500 mt-0.5">
                                                    {linea2}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {footer}
            </div>

            <div className="block md:hidden space-y-3">
                {eventos.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 bg-white rounded-xl border border-neutro-100 shadow-sm">
                        No hay eventos para mostrar.
                    </div>
                ) : (
                    eventos.map((evento) => {
                        const { chip, ubicacion, linea1, linea2 } =
                            obtenerDatosFila(evento);

                        return (
                            <div
                                key={evento.id}
                                className="p-4 rounded-xl border border-neutro-100 bg-white shadow-xs space-y-1.5"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`font-mono text-[11px] font-semibold ${
                                            COLOR_EXTINTOR[
                                                evento.estado_vencimiento
                                            ] ?? COLOR_EXTINTOR.default
                                        }`}
                                    >
                                        {evento.extintor?.etiqueta_inventario}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                        {formatearFecha(evento.fecha)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-900">
                                    <span className="font-semibold">
                                        {linea1}
                                    </span>
                                    {chip && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${chip.clase}`}
                                        >
                                            {chip.texto}
                                        </span>
                                    )}
                                </div>

                                {ubicacion && (
                                    <p className="text-[11px] text-gray-500">
                                        {ubicacion}
                                    </p>
                                )}

                                {linea2 && (
                                    <p className="text-[11px] text-gray-500">
                                        {linea2}
                                    </p>
                                )}
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
