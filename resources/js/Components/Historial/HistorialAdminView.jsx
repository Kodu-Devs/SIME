import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import TablaHistorial from "@/Components/Historial/TablaHistorial";
import RegistrarUsoPanel from "@/Components/Historial/RegistrarUsoPanel";
import ExportarModal from "@/Components/Historial/ExportarModal";

// Valores que valida el backend en el parámetro `tipo`
const FILTROS = [
    { valor: "todos", etiqueta: "Todos los eventos" },
    { valor: "usos", etiqueta: "Usos" },
    { valor: "mantenimientos", etiqueta: "Mantenimientos" },
];

function Paginacion({ paginador }) {
    const { current_page, last_page, prev_page_url, next_page_url, links } =
        paginador;

    if (!last_page || last_page <= 1) return null;

    const base =
        "flex h-7 w-7 items-center justify-center rounded-lg border border-neutro-100 text-xs";

    const flecha = (url, Icono, etiqueta) =>
        url ? (
            <Link
                href={url}
                preserveScroll
                preserveState
                aria-label={etiqueta}
                className={`${base} text-neutro-600 hover:bg-neutro-50`}
            >
                <Icono className="h-4 w-4" />
            </Link>
        ) : (
            <span className={`${base} cursor-not-allowed text-neutro-600 opacity-40`}>
                <Icono className="h-4 w-4" />
            </span>
        );

    return (
        <div className="mt-1 flex items-center justify-between rounded-b-2xl border-t border-neutro-100 bg-white px-4 py-3">
            <p className="text-xs text-neutro-600">
                Página{" "}
                <span className="font-semibold text-neutro-900">{current_page}</span>{" "}
                de{" "}
                <span className="font-semibold text-neutro-900">{last_page}</span>
            </p>

            <div className="inline-flex items-center gap-1">
                {flecha(prev_page_url, ChevronLeft, "Página anterior")}

                {/* Se quitan "Previous" y "Next"; quedan solo los números */}
                {links?.slice(1, -1).map((link, i) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`${base} font-semibold ${
                                link.active
                                    ? "border-primario-700 bg-primario-700 text-white"
                                    : "text-neutro-900 hover:bg-neutro-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span key={i} className={`${base} opacity-40`}>
                            {link.label}
                        </span>
                    ),
                )}

                {flecha(next_page_url, ChevronRight, "Página siguiente")}
            </div>
        </div>
    );
}

export default function HistorialAdminView({
    eventos = [],
    filters = {},
    edificios = [],
    extintores = [],
    capacitaciones = [],
}) {
    const [seleccionado, setSeleccionado] = useState(null);
    const [exportarAbierto, setExportarAbierto] = useState(false);

    // Con sesión `eventos` es un paginador; sin sesión llega []
    const lista = Array.isArray(eventos) ? eventos : (eventos.data ?? []);
    const paginador = Array.isArray(eventos) ? null : eventos;

    // Los filtros activos salen del servidor, no de un useState
    const tipo = filters?.tipo ?? "todos";
    const instalacionId = filters?.instalacion_id ?? "";

    // Pide al servidor la lista filtrada. No manda `page`, así vuelve a la 1.
    const aplicarFiltros = (cambios) => {
        const todos = {
            tipo,
            instalacion_id: instalacionId,
            search: filters?.search,
            fecha_inicio: filters?.fecha_inicio,
            fecha_fin: filters?.fecha_fin,
            ...cambios,
        };

        const params = {};
        Object.entries(todos).forEach(([clave, valor]) => {
            if (valor === null || valor === undefined || valor === "") return;
            if (clave === "tipo" && valor === "todos") return;
            params[clave] = valor;
        });

        router.get(route("historial.index"), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Si la fila seleccionada ya no está en la página actual, el panel se limpia
    const seleccionadoVisible = lista.some((e) => e.id === seleccionado?.id)
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
                        onClick={() => aplicarFiltros({ tipo: f.valor })}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            tipo === f.valor
                                ? "border-neutro-900 bg-neutro-900 text-white"
                                : "border-primario-700 bg-white text-neutro-900 hover:bg-primario-100"
                        }`}
                    >
                        {f.etiqueta}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    <select
                        value={instalacionId}
                        onChange={(e) =>
                            aplicarFiltros({ instalacion_id: e.target.value })
                        }
                        className="rounded-full border-neutro-100 py-1 text-xs"
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
                        className="inline-flex items-center gap-2 rounded-full bg-primario-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primario-900"
                    >
                        <FileDown className="h-4 w-4" />
                        <span>Exportar informe</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex-1">
                    <TablaHistorial
                        eventos={lista}
                        seleccionado={seleccionadoVisible}
                        onSeleccionar={setSeleccionado}
                    />
                    {paginador && <Paginacion paginador={paginador} />}
                </div>

                <RegistrarUsoPanel
                    evento={seleccionadoVisible}
                    extintores={extintores}
                    capacitaciones={capacitaciones}
                    rutaGuardar={route("historial.usos.store")}
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