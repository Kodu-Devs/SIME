import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    FileDown,
    Plus,
} from "lucide-react";
import FlashBanner from "@/Components/FlashBanner";
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
        "flex h-7 w-7 items-center justify-center rounded-lg border border-neutro-100 text-xs transition-colors";

    const flecha = (url, Icono, etiqueta) =>
        url ? (
            <Link
                href={url}
                preserveScroll
                preserveState
                aria-label={etiqueta}
                className={`${base} text-neutro-600 hover:bg-neutro-50 cursor-pointer`}
            >
                <Icono className="h-4 w-4" />
            </Link>
        ) : (
            <span
                className={`${base} cursor-not-allowed text-neutro-600 opacity-40`}
            >
                <Icono className="h-4 w-4" />
            </span>
        );

    return (
        <div className="flex items-center justify-between border-t border-neutro-100 bg-white px-4 py-3">
            <p className="text-xs text-neutro-600">
                Página{" "}
                <span className="font-semibold text-neutro-900">
                    {current_page}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-neutro-900">
                    {last_page}
                </span>
            </p>

            <div className="inline-flex items-center gap-1">
                {flecha(prev_page_url, ChevronLeft, "Página anterior")}

                {links?.slice(1, -1).map((link, i) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`${base} font-semibold cursor-pointer ${
                                link.active
                                    ? "border-primario-500 bg-primario-500 text-white shadow-xs"
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
    const [mostrarFormularioMovil, setMostrarFormularioMovil] = useState(false);

    const lista = Array.isArray(eventos) ? eventos : (eventos.data ?? []);
    const paginador = Array.isArray(eventos) ? null : eventos;

    const tipo = filters?.tipo ?? "todos";
    const instalacionId = filters?.instalacion_id ?? "";

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

    const seleccionadoVisible = lista.some((e) => e.id === seleccionado?.id)
        ? seleccionado
        : null;

    const manejarSeleccion = (evento) => {
        setSeleccionado(evento);
        if (evento) {
            setMostrarFormularioMovil(true);
        }
    };

    const abrirFormularioVacio = () => {
        setSeleccionado(null);
        setMostrarFormularioMovil(true);
    };

    const cerrarFormularioMovil = () => {
        setSeleccionado(null);
        setMostrarFormularioMovil(false);
    };

    return (
        <div className="space-y-4">
            {/* Encabezado principal + botón "+ Añadir" en móvil/tablet */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        Historial
                    </h1>
                    <p className="text-xs text-neutro-600 mt-0.5">
                        Bitácora de usos, mantenimientos realizados y
                        exportación de informes
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirFormularioVacio}
                    className="lg:hidden inline-flex items-center gap-1.5 bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                </button>
            </div>

            <FlashBanner />

            {/* Barra de filtros y acciones */}
            <div className="flex flex-wrap items-center gap-2">
                {FILTROS.map((f) => (
                    <button
                        key={f.valor}
                        type="button"
                        onClick={() => aplicarFiltros({ tipo: f.valor })}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                            tipo === f.valor
                                ? "bg-neutro-900 text-white border-neutro-900"
                                : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                        }`}
                    >
                        {f.etiqueta}
                    </button>
                ))}

                <div className="ml-auto flex flex-wrap items-center gap-2">
                    <select
                        value={instalacionId}
                        onChange={(e) =>
                            aplicarFiltros({ instalacion_id: e.target.value })
                        }
                        className="rounded-full border border-neutro-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutro-900 focus:border-primario-500 focus:ring-1 focus:ring-primario-500 cursor-pointer"
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
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primario-500 hover:bg-primario-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                    >
                        <FileDown className="h-4 w-4" />
                        <span>Exportar informe</span>
                    </button>
                </div>
            </div>

            {/* Contenido principal: tabla + panel lateral (colapsable en móvil/tablet) */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div
                    className={`w-full lg:flex-1 min-w-0 ${
                        mostrarFormularioMovil ? "hidden lg:block" : "block"
                    }`}
                >
                    <TablaHistorial
                        eventos={lista}
                        seleccionado={seleccionadoVisible}
                        onSeleccionar={manejarSeleccion}
                        footer={
                            paginador ? (
                                <Paginacion paginador={paginador} />
                            ) : null
                        }
                    />
                </div>

                <div
                    className={`w-full lg:w-80 shrink-0 lg:sticky lg:top-6 ${
                        mostrarFormularioMovil ? "block" : "hidden lg:block"
                    }`}
                >
                    <button
                        type="button"
                        onClick={cerrarFormularioMovil}
                        className="lg:hidden mb-3 group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutro-100 hover:border-primario-300 hover:bg-primario-100/40 text-xs font-semibold text-neutro-900 hover:text-primario-700 shadow-xs transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 text-neutro-600 group-hover:text-primario-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>Volver al historial</span>
                    </button>

                    <RegistrarUsoPanel
                        evento={seleccionadoVisible}
                        extintores={extintores}
                        capacitaciones={capacitaciones}
                        rutaGuardar={route("historial.usos.store")}
                        onGuardado={cerrarFormularioMovil}
                    />
                </div>
            </div>

            <ExportarModal
                abierto={exportarAbierto}
                onCerrar={() => setExportarAbierto(false)}
                edificios={edificios}
            />
        </div>
    );
}
