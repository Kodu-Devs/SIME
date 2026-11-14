import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, router, usePage } from "@inertiajs/react";
import CalendarGrid from "@/Components/Agenda/CalendarGrid";
import AgendaSidePanel from "@/Components/Agenda/AgendaSidePanel";

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

            {/* Encabezado con botón "+ Añadir" visible solo en móvil/tablet para Admin */}
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
                        className="lg:hidden bg-primario-700 hover:bg-primario-900 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer shrink-0"
                    >
                        + Añadir
                    </button>
                )}
            </div>

            {/* Barra de filtros y selector de mes */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                {isAdmin ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFiltro("todos")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                filtro === "todos"
                                    ? "bg-neutro-900 text-white border-transparent"
                                    : "bg-white border-neutro-300 text-neutro-600 hover:bg-neutro-100"
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro("mantenimientos")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                                filtro === "mantenimientos"
                                    ? "bg-neutro-900 text-white border-transparent"
                                    : "bg-white border-neutro-300 text-neutro-600 hover:bg-neutro-100"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-neutro-900 inline-block"></span>
                            <span className="hidden sm:inline">
                                Mantenimientos
                            </span>
                            <span className="sm:hidden">Mant.</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro("capacitaciones")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                                filtro === "capacitaciones"
                                    ? "bg-neutro-900 text-white border-transparent"
                                    : "bg-white border-neutro-300 text-neutro-600 hover:bg-neutro-100"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#1b9e85] inline-block"></span>
                            <span className="hidden sm:inline">
                                Capacitaciones
                            </span>
                            <span className="sm:hidden">Capacit.</span>
                        </button>
                    </div>
                ) : (
                    <div className="px-3.5 py-1 rounded-full text-xs font-semibold border border-neutro-300 bg-white text-neutro-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1b9e85] inline-block"></span>
                        Capacitaciones
                    </div>
                )}

                {/* El selector de mes se oculta en móvil si el formulario está abierto */}
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

            {/* Contenedor Principal:En escritorio muestra ambos; en móvil/tablet alterna entre calendario y formulario */}
            <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6">
                {/* Calendario:En móvil/tablet se oculta cuando el formulario está activo */}
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

                {/* Panel Lateral Admin:En escritorio siempre está fijo a la derecha; en móvil/tablet reemplaza al calendario */}
                {isAdmin && (
                    <div
                        className={`w-full lg:w-80 shrink-0 ${
                            mostrarFormularioMovil ? "block" : "hidden lg:block"
                        }`}
                    >
                        {/* Botón para regresar al calendario (solo en móvil/tablet) */}
                        <button
                            type="button"
                            onClick={cerrarFormularioMovil}
                            className="lg:hidden mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primario-700 hover:text-primario-900 cursor-pointer"
                        >
                            <span>&larr;</span> Volver al calendario
                        </button>

                        <AgendaSidePanel
                            combos={combos}
                            eventoSeleccionado={eventoSeleccionado}
                            onCancelMovil={cerrarFormularioMovil}
                            onSuccess={cerrarFormularioMovil}
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
