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
    const [anio, mes, dia] = fecha.split("-");
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
                        const esUso = evento.tipo === "Uso";
                        const chip = esUso ? CHIP_DESCARGA[evento.tipo_descarga] : null;

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
                                className={`cursor-pointer border-b last:border-b-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 ${
                                    activo ? "bg-red-100" : "hover:bg-gray-200"
                                }`}
                            >
                                <td className="px-3 py-3 text-gray-500">
                                    {formatearFecha(evento.fecha)}
                                </td>

                                <td
                                    className={`px-3 py-3 ${
                                        COLOR_EXTINTOR[evento.estado_vencimiento] ??
                                        COLOR_EXTINTOR.default
                                    }`}
                                >
                                    {evento.extintor}
                                </td>

                                <td className="px-3 py-3 text-gray-500">
                                    {evento.ubicacion}
                                </td>

                                <td className="px-3 py-3">
                                    {/* Línea 1: tipo de evento · su tipo (+ chip solo en usos) */}
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <span>
                                            {evento.tipo}
                                            {evento.subtipo && ` · ${evento.subtipo}`}
                                        </span>
                                        {chip && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${chip.clase}`}
                                            >
                                                {chip.texto}
                                            </span>
                                        )}
                                    </div>

                                    {/* Línea 2: descripción y, si hay, nombre de la capacitación */}
                                    <div className="text-gray-500">
                                        {[evento.descripcion, evento.capacitacion]
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