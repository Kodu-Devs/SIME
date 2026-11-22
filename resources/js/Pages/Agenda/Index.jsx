import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, router, usePage } from "@inertiajs/react";
import CalendarGrid from "@/Components/Agenda/CalendarGrid";
import AgendaSidePanel from "@/Components/Agenda/AgendaSidePanel";
import { ArrowLeft, Plus } from "lucide-react";
import FlashBanner from "@/Components/FlashBanner";

export default function Index({ eventos = [], mesActual, combos = {} }) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);

    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get("tab");

    const [filtro, setFiltro] = useState(isAdmin ? "todos" : "capacitaciones");
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [mostrarFormularioMovil, setMostrarFormularioMovil] = useState(false);

    useEffect(() => {
        if (isAdmin && tabParam) {
            setMostrarFormularioMovil(true);
        }
    }, [isAdmin, tabParam]);

    const manejarSeleccionEvento = (ev) => {
        if (
            eventoSeleccionado &&
            eventoSeleccionado.id === ev.id &&
            eventoSeleccionado.clase === ev.clase
        ) {
            setEventoSeleccionado(null);
            setMostrarFormularioMovil(false);
        } else {
            setEventoSeleccionado(ev);
            if (isAdmin) {
                setMostrarFormularioMovil(true);
            }
        }
    };

    const abrirFormularioVacio = () => {
        setEventoSeleccionado(null);
        setMostrarFormularioMovil(true);
    };

    const cerrarFormularioMovil = () => {
        setMostrarFormularioMovil(false);
        setEventoSeleccionado(null);

        if (tabParam) {
            router.get(
                route("agenda.index"),
                { mes: mesActual },
                { preserveState: true, replace: true },
            );
        }
    };

    const eventosFiltrados = eventos.filter((ev) => {
        if (filtro === "mantenimientos") return ev.clase === "mantenimiento";
        if (filtro === "capacitaciones") return ev.clase === "capacitacion";
        return true;
    });

    const cambiarMes = (direccion) => {
        const [anio, mes] = (mesActual || "2026-10").split("-").map(Number);
        const fecha = new Date(anio, mes - 1 + direccion, 1);
        const nuevoMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
        setEventoSeleccionado(null);
        setMostrarFormularioMovil(false);
        router.get("/agenda", { mes: nuevoMes }, { preserveState: true });
    };

    const formatearNombreMes = (mesStr) => {
        if (!mesStr) return "";
        const [anio, mes] = mesStr.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, 1);
        const nombre = fecha.toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
        });
        const limpio = nombre.replace(" de ", " ");
        return limpio.charAt(0).toUpperCase() + limpio.slice(1);
    };

    const textoSubtituloPublico =
        eventosFiltrados.length === 1
            ? "1 capacitación programada este mes"
            : `${eventosFiltrados.length} capacitaciones programadas este mes`;

    const Contenido = (
        <div className="w-full max-w-7xl mx-auto space-y-4">
            <Head title="Agenda" />

            {/* Encabezado con botón "+ Añadir" unificado (solo móvil/tablet para Admin) */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        Agenda
                    </h1>
                    <p className="text-xs text-neutro-600 mt-0.5">
                        {isAdmin
                            ? "Mantenimientos y capacitaciones"
                            : textoSubtituloPublico}
                    </p>
                </div>

                {isAdmin && (
                    <button
                        type="button"
                        onClick={abrirFormularioVacio}
                        className="lg:hidden inline-flex items-center gap-1.5 bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                    </button>
                )}
            </div>

            {isAdmin && <FlashBanner />}

            {/* Barra de filtros y selector de mes */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {isAdmin ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFiltro("todos")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                filtro === "todos"
                                    ? "bg-neutro-900 text-white border-neutro-900"
                                    : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro("mantenimientos")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                filtro === "mantenimientos"
                                    ? "bg-neutro-900 text-white border-neutro-900"
                                    : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                            }`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full inline-block ${
                                    filtro === "mantenimientos"
                                        ? "bg-white"
                                        : "bg-neutro-900"
                                }`}
                            />
                            <span className="hidden sm:inline">
                                Mantenimientos
                            </span>
                            <span className="sm:hidden">Mant.</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro("capacitaciones")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                filtro === "capacitaciones"
                                    ? "bg-neutro-900 text-white border-neutro-900"
                                    : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-acento-500 inline-block" />
                            <span className="hidden sm:inline">
                                Capacitaciones
                            </span>
                            <span className="sm:hidden">Capacit.</span>
                        </button>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-neutro-100 bg-white text-neutro-600">
                        <span className="w-2 h-2 rounded-full bg-acento-500 inline-block" />
                        Capacitaciones
                    </div>
                )}

                {/* Selector de mes */}
                <div
                    className={`items-center gap-2 md:gap-3 text-sm font-semibold text-neutro-900 w-full sm:w-auto justify-between sm:justify-end ${
                        isAdmin && mostrarFormularioMovil
                            ? "hidden lg:flex"
                            : "flex"
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => cambiarMes(-1)}
                        className="text-primario-700 hover:text-primario-900 px-2 py-1 cursor-pointer"
                    >
                        &lt;
                    </button>
                    <span className="w-32 md:w-36 text-center">
                        {formatearNombreMes(mesActual)}
                    </span>
                    <button
                        type="button"
                        onClick={() => cambiarMes(1)}
                        className="text-primario-700 hover:text-primario-900 px-2 py-1 cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
                <div
                    className={`w-full lg:flex-1 min-w-0 ${
                        isAdmin && mostrarFormularioMovil
                            ? "hidden lg:block"
                            : "block"
                    }`}
                >
                    <CalendarGrid
                        eventos={eventosFiltrados}
                        mesActual={mesActual}
                        eventoSeleccionado={eventoSeleccionado}
                        onSelectEvento={manejarSeleccionEvento}
                        modoPublico={!isAdmin}
                    />
                </div>

                {isAdmin && (
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
                            <span>Volver al calendario</span>
                        </button>

                        <AgendaSidePanel
                            combos={combos}
                            eventoSeleccionado={eventoSeleccionado}
                            onCancelMovil={cerrarFormularioMovil}
                            onSuccess={cerrarFormularioMovil}
                            onClearSelection={() => setEventoSeleccionado(null)}
                            tabInicial={tabParam || "mantenimiento"}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return isAdmin ? (
        <AdminLayout>{Contenido}</AdminLayout>
    ) : (
        <PublicLayout>{Contenido}</PublicLayout>
    );
}
