import { useMemo, useState } from "react";
import TablaHistorial from "@/Components/Historial/TablaHistorial";
import RegistrarUsoPanel from "@/Components/Historial/RegistrarUsoPanel";

const FILTROS = [
    { valor: "todos", etiqueta: "Todos los eventos" },
    { valor: "Uso", etiqueta: "Usos" },
    { valor: "Mantenimiento", etiqueta: "Mantenimientos" },
];

export default function HistorialAdminView({
    eventos = [],
    edificios = [],
    extintores = [], 
    capacitaciones = [],
}) {
    const [filtro, setFiltro] = useState("todos");
    const [edificioId, setEdificioId] = useState("");
    const [seleccionado, setSeleccionado] = useState(null);

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
            <p className="text-sm text-neutro-600">
                Eventos de todos los extintores
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {FILTROS.map((f) => (
                    <button
                        key={f.valor}
                        type="button"
                        onClick={() => setFiltro(f.valor)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            filtro === f.valor
                                ? "border-neutro-900 bg-neutro-900 text-white"
                                : "border-primario-700 bg-white text-neutro-900 hover:bg-primario-100"
                        }`}
                    >
                        {f.etiqueta}
                    </button>
                ))}

                <select
                    value={edificioId}
                    onChange={(e) => setEdificioId(e.target.value)}
                    className="ml-auto rounded-full border-neutro-100 py-1 text-xs"
                    aria-label="Filtrar por área"
                >
                    <option value="">Área: Toda la Institución</option>
                    {edificios.map((ed) => (
                        <option key={ed.id} value={ed.id}>
                            {ed.nombre}
                        </option>
                    ))}
                </select>
            </div>

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
                    rutaGuardar={route("historial.usos.store")}
                />
            </div>
        </div>
    );
}