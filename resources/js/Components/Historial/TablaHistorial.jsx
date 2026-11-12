// Components/Historial/TablaHistorial.jsx

// Estado de vencimiento oficial: vigente · por_vencer · vencido (ya viene calculado)
const COLOR_EXTINTOR = {
    por_vencer: "text-orange-600",
    vencido: "text-red-600",
    default: "text-gray-900",
};

const CHIP_DESCARGA = {
    total: { texto: "Total", clase: "bg-red-100 text-red-700" },
    parcial: { texto: "Parcial", clase: "bg-amber-100 text-amber-700" },
};

// "2026-11-10" -> "10/11/26" (sin Date, para evitar problemas de zona horaria)
function formatearFecha(fecha) {
    if (!fecha) return "";
    const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio.slice(-2)}`;
}

export default function TablaHistorial({
    eventos = [],
    seleccionado = null,
    onSeleccionar = () => {},
}) {
    const alternarSeleccion = (evento) => {
        onSeleccionar(seleccionado?.id === evento.id ? null : evento);
    };

    return (
        <div className="flex-1 overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="border-b text-[11px] font-semibold uppercase tracking-wide text-gray-700">
                        <th className="px-3 py-2">Fecha</th>
                        <th className="px-3 py-2">Extintor</th>
                        <th className="px-3 py-2">Ubicación</th>
                        <th className="px-3 py-2">Evento/Motivo</th>
                    </tr>
                </thead>

                <tbody>
                    {eventos.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                                No hay eventos para mostrar.
                            </td>
                        </tr>
                    )}

                    {eventos.map((evento) => {
                        const activo = seleccionado?.id === evento.id;
                        const esUso = evento.tipo_evento === "Uso";
                        const chip = esUso ? CHIP_DESCARGA[evento.subtipo] : null;
                        const ub = evento.extintor?.ubicacion;
                        const ubicacion = [ub?.piso?.instalacion?.nombre, ub?.piso?.nombre]
                            .filter(Boolean)
                            .join(" - ");
                        // Línea 1: "Uso · Conato" o "Mantenimiento · Revisión"
                        const linea1 = esUso
                            ? [evento.tipo_evento, evento.tipo_motivo].filter(Boolean).join(" · ")
                            : [evento.tipo_evento, evento.subtipo].filter(Boolean).join(" · ");

                        return (
                            <tr 
                                key={evento.id}
                                onClick={() => alternarSeleccion(evento)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        alternarSeleccion(evento);
                                    }
                                }}
                                tabIndex={0}
                                aria-selected={activo}
                                className={`cursor-pointer border-b last:border-b-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primario-300 ${
                                    activo ? "bg-primario-100" : "hover:bg-neutro-50"
                                }`}
                            >
                                <td className="px-3 py-3 text-gray-500">{formatearFecha(evento.fecha)}</td>

                                <td className={`px-3 py-3 ${COLOR_EXTINTOR[evento.estado_vencimiento] ?? COLOR_EXTINTOR.default}`}>
                                {evento.extintor?.etiqueta_inventario}
                            </td>

                                <td className="px-3 py-3 text-gray-500">{ubicacion}</td>

                                <td className="px-3 py-3">
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <span>{linea1}</span>
                                        {chip && (
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${chip.clase}`}>
                                                {chip.texto}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-500">
                                        {[evento.detalle, evento.capacitacion?.nombre]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}