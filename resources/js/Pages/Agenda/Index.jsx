import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, router, usePage } from "@inertiajs/react";
import CalendarGrid from "@/Components/Agenda/CalendarGrid";
import AgendaSidePanel from "@/Components/Agenda/AgendaSidePanel";

export default function Index({ eventos = [], mesActual, combos = {} }) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);

    const [filtro, setFiltro] = useState("todos");
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    const manejarSeleccionEvento = (ev) => {
        if (
            eventoSeleccionado &&
            eventoSeleccionado.id === ev.id &&
            eventoSeleccionado.clase === ev.clase
        ) {
            setEventoSeleccionado(null);
        } else {
            setEventoSeleccionado(ev);
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

    const Contenido = (
        <div className="py-4 px-6 w-full">
            <Head title="Agenda" />

            <div className="mb-3">
                <h1 className="text-2xl font-bold text-neutro-900">Agenda</h1>
                <p className="text-xs text-neutro-600">
                    Mantenimientos y capacitaciones
                </p>
            </div>

            {/* Barra de filtros y selector de mes */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFiltro("todos")}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition ${
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
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition ${
                            filtro === "mantenimientos"
                                ? "bg-neutro-900 text-white border-transparent"
                                : "bg-white border-neutro-300 text-neutro-600 hover:bg-neutro-100"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-neutro-900 inline-block"></span>
                        Mantenimientos
                    </button>
                    <button
                        type="button"
                        onClick={() => setFiltro("capacitaciones")}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition ${
                            filtro === "capacitaciones"
                                ? "bg-neutro-900 text-white border-transparent"
                                : "bg-white border-neutro-300 text-neutro-600 hover:bg-neutro-100"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#1b9e85] inline-block"></span>
                        Capacitaciones
                    </button>
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-neutro-900">
                    <button
                        type="button"
                        onClick={() => cambiarMes(-1)}
                        className="text-primario-700 hover:text-primario-900 px-1.5 py-0.5"
                    >
                        &lt;
                    </button>
                    <span className="w-36 text-center">
                        {formatearNombreMes(mesActual)}
                    </span>
                    <button
                        type="button"
                        onClick={() => cambiarMes(1)}
                        className="text-primario-700 hover:text-primario-900 px-1.5 py-0.5"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Contenedor principal: El calendario toma todo el espacio flexible (flex-1) */}
            <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                    <CalendarGrid
                        eventos={eventosFiltrados}
                        mesActual={mesActual}
                        eventoSeleccionado={eventoSeleccionado}
                        onSelectEvento={manejarSeleccionEvento}
                    />
                </div>

                {isAdmin && (
                    <AgendaSidePanel
                        combos={combos}
                        eventoSeleccionado={eventoSeleccionado}
                        onClearSeleccion={() => setEventoSeleccionado(null)}
                    />
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
