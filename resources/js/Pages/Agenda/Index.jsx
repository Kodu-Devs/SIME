import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import FlashBanner from "@/Components/FlashBanner";
import CalendarGrid from "@/Components/Agenda/CalendarGrid";
import AgendaSidePanel from "@/Components/Agenda/AgendaSidePanel";

const MESES_CORTOS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
];

export default function Index({ eventos = [], mesActual, combos = {} }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const isAdmin = Boolean(auth?.user);

    const [anioActual, mesNumeroActual] = (mesActual || "2026-10")
        .split("-")
        .map(Number);

    const [filtro, setFiltro] = useState(isAdmin ? "todos" : "capacitaciones");
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [extintorInicial, setExtintorInicial] = useState(null);
    const [tabInicial, setTabInicial] = useState("mantenimiento");
    const [mostrarFormularioMovil, setMostrarFormularioMovil] = useState(false);

    const [selectorMesAbierto, setSelectorMesAbierto] = useState(false);
    const [anioSelector, setAnioSelector] = useState(anioActual);
    const selectorMesRef = useRef(null);
    const ultimaConsultaRef = useRef("");

    useEffect(() => {
        setAnioSelector(anioActual);
    }, [anioActual]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                selectorMesRef.current &&
                !selectorMesRef.current.contains(e.target)
            ) {
                setSelectorMesAbierto(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setSelectorMesAbierto(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Procesa atajos entrantes desde Dashboard (?evento=&clase=, ?extintor=, ?tab=)
    useEffect(() => {
        const queryString = url.includes("?") ? url.split("?")[1] : "";
        if (!queryString || ultimaConsultaRef.current === queryString) return;

        const params = new URLSearchParams(queryString);
        const tabParam = params.get("tab");
        const extintorParam = params.get("extintor");
        const eventoParam = params.get("evento");
        const claseParam = params.get("clase");

        if (!tabParam && !extintorParam && !eventoParam) return;

        ultimaConsultaRef.current = queryString;

        if (tabParam === "capacitacion" || tabParam === "mantenimiento") {
            setTabInicial(tabParam);
        }

        if (eventoParam && claseParam) {
            const encontrado = eventos.find(
                (ev) =>
                    String(ev.id) === String(eventoParam) &&
                    ev.clase === claseParam,
            );
            if (encontrado) {
                setEventoSeleccionado(encontrado);
                setExtintorInicial(null);
                if (isAdmin) setMostrarFormularioMovil(true);
                return;
            }
        }

        if (isAdmin && extintorParam) {
            setEventoSeleccionado(null);
            setTabInicial("mantenimiento");
            setExtintorInicial(extintorParam);
            setMostrarFormularioMovil(true);
            return;
        }

        if (isAdmin && tabParam) {
            setMostrarFormularioMovil(true);
        }
    }, [url, eventos, isAdmin]);

    const limpiarParametrosUrl = () => {
        const params = new URLSearchParams(window.location.search);
        if (
            params.has("tab") ||
            params.has("extintor") ||
            params.has("evento") ||
            params.has("clase")
        ) {
            const nuevaUrl = mesActual
                ? `${window.location.pathname}?mes=${mesActual}`
                : window.location.pathname;
            window.history.replaceState(window.history.state, "", nuevaUrl);
        }
    };

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
            setExtintorInicial(null);
            if (isAdmin) {
                setMostrarFormularioMovil(true);
            }
        }
    };

    const abrirFormularioVacio = () => {
        setEventoSeleccionado(null);
        setExtintorInicial(null);
        setMostrarFormularioMovil(true);
    };

    const limpiarSeleccion = () => {
        setEventoSeleccionado(null);
        setExtintorInicial(null);
        limpiarParametrosUrl();
    };

    const cerrarFormularioMovil = () => {
        setMostrarFormularioMovil(false);
        setEventoSeleccionado(null);
        setExtintorInicial(null);
        limpiarParametrosUrl();
    };

    const eventosFiltrados = eventos.filter((ev) => {
        if (filtro === "mantenimientos") return ev.clase === "mantenimiento";
        if (filtro === "capacitaciones") return ev.clase === "capacitacion";
        return true;
    });

    const irAMes = (nuevoMes) => {
        setSelectorMesAbierto(false);
        setEventoSeleccionado(null);
        setExtintorInicial(null);
        setMostrarFormularioMovil(false);
        router.get("/agenda", { mes: nuevoMes }, { preserveState: true });
    };

    const cambiarMes = (direccion) => {
        const fecha = new Date(anioActual, mesNumeroActual - 1 + direccion, 1);
        const nuevoMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
        irAMes(nuevoMes);
    };

    const irAHoy = () => {
        const hoy = new Date();
        const mesHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
        irAMes(mesHoy);
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

    const hoy = new Date();
    const anioHoy = hoy.getFullYear();
    const mesHoy = hoy.getMonth() + 1;

    const textoSubtituloPublico =
        eventosFiltrados.length === 1
            ? "1 capacitación programada este mes"
            : `${eventosFiltrados.length} capacitaciones programadas este mes`;

    const Contenido = (
        <div className="w-full max-w-7xl mx-auto space-y-4">
            <Head title="Agenda" />

            {/* Encabezado */}
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

                {isAdmin && !mostrarFormularioMovil && (
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

            {/* Contenedor Principal: columna izquierda (filtros + mes + calendario) y panel lateral derecho */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
                <div
                    className={`w-full lg:flex-1 min-w-0 space-y-4 ${
                        isAdmin && mostrarFormularioMovil
                            ? "hidden lg:block"
                            : "block"
                    }`}
                >
                    {/* Barra de filtros y selector de mes alineados al ancho exacto del calendario */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
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
                                    <span>Mantenimientos</span>
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
                                    <span>Capacitaciones</span>
                                </button>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-neutro-100 bg-white text-neutro-600">
                                <span className="w-2 h-2 rounded-full bg-acento-500 inline-block" />
                                Capacitaciones
                            </div>
                        )}

                        {/* Selector de mes con desplegable interactivo */}
                        <div
                            ref={selectorMesRef}
                            className="relative flex items-center justify-between sm:justify-end gap-1 w-full sm:w-auto"
                        >
                            <button
                                type="button"
                                onClick={() => cambiarMes(-1)}
                                aria-label="Mes anterior"
                                className="p-1.5 rounded-lg bg-white border border-neutro-100 text-neutro-600 hover:text-primario-700 hover:border-primario-300 hover:bg-primario-100/40 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectorMesAbierto(!selectorMesAbierto)
                                }
                                aria-expanded={selectorMesAbierto}
                                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border text-xs sm:text-sm font-bold min-w-[162px] transition-colors cursor-pointer ${
                                    selectorMesAbierto
                                        ? "border-primario-500 text-primario-700 ring-1 ring-primario-500/30"
                                        : "border-neutro-100 text-neutro-900 hover:border-primario-300 hover:text-primario-700"
                                }`}
                            >
                                <Calendar className="w-3.5 h-3.5 text-primario-500 shrink-0" />
                                <span>{formatearNombreMes(mesActual)}</span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-neutro-600 transition-transform ${
                                        selectorMesAbierto ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() => cambiarMes(1)}
                                aria-label="Mes siguiente"
                                className="p-1.5 rounded-lg bg-white border border-neutro-100 text-neutro-600 hover:text-primario-700 hover:border-primario-300 hover:bg-primario-100/40 transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {selectorMesAbierto && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-neutro-100 shadow-lg p-3 z-40">
                                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutro-100">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setAnioSelector((a) => a - 1)
                                            }
                                            aria-label="Año anterior"
                                            className="p-1 rounded-lg text-neutro-600 hover:bg-neutro-50 hover:text-neutro-900 cursor-pointer"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-bold text-neutro-900">
                                            {anioSelector}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setAnioSelector((a) => a + 1)
                                            }
                                            aria-label="Año siguiente"
                                            className="p-1 rounded-lg text-neutro-600 hover:bg-neutro-50 hover:text-neutro-900 cursor-pointer"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1.5">
                                        {MESES_CORTOS.map((nombreMes, idx) => {
                                            const numMes = idx + 1;
                                            const esSeleccionado =
                                                anioSelector === anioActual &&
                                                numMes === mesNumeroActual;
                                            const esMesHoy =
                                                anioSelector === anioHoy &&
                                                numMes === mesHoy;

                                            return (
                                                <button
                                                    key={nombreMes}
                                                    type="button"
                                                    onClick={() =>
                                                        irAMes(
                                                            `${anioSelector}-${String(numMes).padStart(2, "0")}`,
                                                        )
                                                    }
                                                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                                        esSeleccionado
                                                            ? "bg-primario-500 text-white font-bold shadow-xs"
                                                            : esMesHoy
                                                              ? "border border-primario-300 bg-primario-100/40 text-primario-700 hover:bg-primario-100"
                                                              : "text-neutro-900 hover:bg-neutro-50"
                                                    }`}
                                                >
                                                    {nombreMes}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-2.5 pt-2 border-t border-neutro-100 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={irAHoy}
                                            className="text-xs font-bold text-primario-500 hover:text-primario-700 px-2 py-1 rounded-lg hover:bg-primario-100/40 transition-colors cursor-pointer"
                                        >
                                            Ir a hoy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
                            extintorInicial={extintorInicial}
                            onCancelMovil={cerrarFormularioMovil}
                            onSuccess={cerrarFormularioMovil}
                            onClearSelection={limpiarSeleccion}
                            tabInicial={tabInicial}
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
