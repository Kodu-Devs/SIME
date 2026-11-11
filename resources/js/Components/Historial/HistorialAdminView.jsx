import { useMemo, useState } from "react";
import TablaHistorial from "@/Components/Historial/TablaHistorial";
import RegistrarUsoPanel from "@/Components/Historial/RegistrarUsoPanel";
import ExportarModal from "@/Components/Historial/ExportarModal";

const FILTROS = [
    { valor: "todos", etiqueta: "Todos los eventos" },
    { valor: "Uso", etiqueta: "Usos" },
    { valor: "Mantenimiento", etiqueta: "Mantenimientos" },
];

export default function HistorialAdminView({
    eventos = [],
    edificios = [],
    extintores = [], // TODO: confirmar nombre de prop con Emiliano
    capacitaciones = [], // TODO: confirmar nombre de prop con Emiliano
}) {
    const [filtro, setFiltro] = useState("todos");
    const [edificioId, setEdificioId] = useState("");
    const [seleccionado, setSeleccionado] = useState(null);
    const [exportarAbierto, setExportarAbierto] = useState(false);

    // Solo filtra lo que ya se muestra; no calcula reglas de negocio
    const eventosVisibles = useMemo(
        () =>
            eventos.filter(
                (e) =>
                    (filtro === "todos" || e.tipo_evento === filtro) &&
                    (edificioId === "" ||
                        String(e.extintor?.ubicacion?.piso?.instalacion_id) ===
                            String(edificioId)),
            ),
        [eventos, filtro, edificioId],
    );

    // Si la fila seleccionada ya no aparece por un filtro, el panel se limpia
    const seleccionadoVisible = eventosVisibles.some(
        (e) => e.id === seleccionado?.id,
    )
        ? seleccionado
        : null;

    return (
        <div>
            <h1 className="text-2xl font-bold">Historial</h1>
            <p className="text-sm text-gray-700">
                Eventos de todos los extintores
            </p>

            {/* Filtros y botón Exportar */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                {FILTROS.map((f) => (
                    <button
                        key={f.valor}
                        type="button"
                        onClick={() => setFiltro(f.valor)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            filtro === f.valor
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-red-700 bg-white text-gray-900 hover:bg-red-50"
                        }`}
                    >
                        {f.etiqueta}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    <select
                        value={edificioId}
                        onChange={(e) => setEdificioId(e.target.value)}
                        className="rounded-full border-gray-400 py-1 text-xs"
                        aria-label="Filtrar por área"
                    >
                        <option value="">Área: Toda la Institución</option>
                        {edificios.map((ed) => (
                            <option key={ed.id} value={ed.id}>
                                {ed.nombre}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setExportarAbierto(true)}
                        className="rounded-full border border-gray-400 bg-white px-3 py-1 text-xs hover:bg-gray-100"
                    >
                        Exportar informe de usos ↓
                    </button>
                </div>
            </div>

            {/* Tabla + panel */}
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
                <TablaHistorial
                    eventos={eventosVisibles}
                    seleccionado={seleccionadoVisible}
                    onSeleccionar={setSeleccionado}
                />
                <RegistrarUsoPanel
                    evento={seleccionadoVisible}
                    extintores={extintores}
                    capacitaciones={capacitaciones}
                    // rutaGuardar: TODO: ruta
                />
            </div>

            <ExportarModal
                abierto={exportarAbierto}
                onCerrar={() => setExportarAbierto(false)}
                edificios={edificios}
            />
        </div>
    );
}