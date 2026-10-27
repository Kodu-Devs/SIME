import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import CalendarGrid from "@/Components/Agenda/CalendarGrid";
import AgendaSidePanel from "@/Components/Agenda/AgendaSidePanel";

export default function Index(props) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    // Props que vienen desde AgendaController
    const eventos = props.eventos || [];
    const mesActual = props.mesActual || "2026-10";
    const combos = props.combos || {};

    // Filtro superior: 'todos' | 'mantenimiento' | 'capacitacion'
    const [filtro, setFiltro] = useState("todos");

    // Filtrar los eventos que se le pasan al CalendarGrid
    const eventosFiltrados = eventos.filter((evento) => {
        if (filtro === "todos") return true;
        return evento.clase === filtro;
    });

    // Formatear el título del mes (ej. "2026-10" -> "Octubre 2026")
    const nombresMeses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    const [anioStr, mesStr] = mesActual.split("-");
    const nombreMes = nombresMeses[parseInt(mesStr, 10) - 1] || "Octubre";

    // Cambiar de mes pidiendo los datos a AgendaController
    const cambiarMes = (direccion) => {
        let anio = parseInt(anioStr, 10);
        let mes = parseInt(mesStr, 10) + direccion;

        if (mes < 1) {
            mes = 12;
            anio -= 1;
        } else if (mes > 12) {
            mes = 1;
            anio += 1;
        }

        const nuevoMes = `${anio}-${String(mes).padStart(2, "0")}`;
        router.get(
            window.location.pathname,
            { mes: nuevoMes },
            { preserveState: true },
        );
    };

    return (
        <Layout>
            <Head title="Agenda - SIME" />

            <div className="flex flex-col gap-6 font-sans">
                {/* CABECERA Y CONTROLES SUPERIORES (Corregido según Figma) */}
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-titulo-1 text-neutro-900">
                            Agenda
                        </h1>
                        <p className="text-sm text-neutro-600">
                            Mantenimientos y capacitaciones
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-1">
                        {/* Botones de filtro (Alineados a la izquierda, estilo píldora) */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFiltro("todos")}
                                className={`px-4 py-1 text-xs font-semibold rounded-full border transition ${
                                    filtro === "todos"
                                        ? "bg-neutro-900 text-white border-neutro-900"
                                        : "bg-transparent text-neutro-600 border-neutro-300 hover:border-neutro-400"
                                }`}
                            >
                                Todos
                            </button>
                            <button
                                type="button"
                                onClick={() => setFiltro("mantenimiento")}
                                className={`flex items-center gap-2 px-4 py-1 text-xs font-semibold rounded-full border transition ${
                                    filtro === "mantenimiento"
                                        ? "bg-neutro-100 text-neutro-900 border-neutro-400"
                                        : "bg-transparent text-neutro-600 border-neutro-300 hover:border-neutro-400"
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-neutro-900"></span>
                                Mantenimientos
                            </button>
                            <button
                                type="button"
                                onClick={() => setFiltro("capacitacion")}
                                className={`flex items-center gap-2 px-4 py-1 text-xs font-semibold rounded-full border transition ${
                                    filtro === "capacitacion"
                                        ? "bg-neutro-100 text-neutro-900 border-acento-500"
                                        : "bg-transparent text-neutro-600 border-neutro-300 hover:border-neutro-400"
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-acento-500"></span>
                                Capacitaciones
                            </button>
                        </div>

                        {/* Navegador de mes (Alineado a la derecha, sin caja de fondo) */}
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <button
                                type="button"
                                onClick={() => cambiarMes(-1)}
                                className="text-primario-700 hover:text-primario-900 px-1 transition"
                            >
                                &lt;
                            </button>
                            <span className="min-w-[100px] text-center text-neutro-900">
                                {nombreMes} {anioStr}
                            </span>
                            <button
                                type="button"
                                onClick={() => cambiarMes(1)}
                                className="text-primario-700 hover:text-primario-900 px-1 transition"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                {isAdmin ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <CalendarGrid
                                eventos={eventosFiltrados}
                                mesActual={mesActual}
                            />
                        </div>
                        <AgendaSidePanel combos={combos} />
                    </div>
                ) : (
                    <div className="w-full">
                        <CalendarGrid
                            eventos={eventosFiltrados}
                            mesActual={mesActual}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}
