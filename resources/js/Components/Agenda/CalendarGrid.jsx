import React, { useState } from "react";

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SAB", "DOM"];

export default function CalendarGrid({
    eventos = [],
    mesActual,
    eventoSeleccionado,
    onSelectEvento,
    modoPublico = false,
}) {
    const [anio, mes] = (mesActual || "2026-10").split("-").map(Number);

    const [posicionTooltip, setPosicionTooltip] = useState({ x: 0, y: 0 });

    const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
    const totalDiasMes = new Date(anio, mes, 0).getDate();

    const fechaHoy = new Date();
    const diaActualHoy = fechaHoy.getDate();
    const mesActualHoy = fechaHoy.getMonth() + 1;
    const anioActualHoy = fechaHoy.getFullYear();

    const TOTAL_CELDAS = 42;
    const celdas = Array.from({ length: TOTAL_CELDAS }, (_, idx) => {
        const numeroDia = idx - primerDiaSemana + 1;
        if (numeroDia < 1) return { tipo: "previo", dia: null };
        if (numeroDia > totalDiasMes) return { tipo: "posterior", dia: null };
        return { tipo: "actual", dia: numeroDia };
    });

    const obtenerEventosDelDia = (dia) => {
        if (!dia) return [];
        const fechaBuscada = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        return eventos.filter((ev) =>
            String(ev.fecha).startsWith(fechaBuscada),
        );
    };

    return (
        // Contenedor principal relativo.
        <div id="calendar-container" className="w-full relative">
            {/* Contenedor con overflow-x-auto para permitir deslizar el calendario en móviles */}
            <div className="bg-white border border-neutro-300 rounded-xl overflow-x-auto shadow-md w-full">
                {/* Forzamos un ancho mínimo (min-w-[700px]) para que no se apriete en celulares */}
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-7 border-b border-neutro-300 bg-neutro-50">
                        {DIAS_SEMANA.map((dia) => (
                            <div
                                key={dia}
                                className="py-2 px-2 md:px-3 text-[10px] md:text-xs font-semibold text-neutro-600 uppercase tracking-wider border-r last:border-r-0 border-neutro-200 text-center md:text-left"
                            >
                                {dia}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {celdas.map((celda, index) => {
                            const eventosDia = obtenerEventosDelDia(celda.dia);
                            const esPosterior = celda.tipo === "posterior";

                            const tieneEventoSeleccionado =
                                eventoSeleccionado &&
                                eventosDia.some(
                                    (ev) =>
                                        ev.id === eventoSeleccionado.id &&
                                        ev.clase === eventoSeleccionado.clase,
                                );

                            const esHoy =
                                celda.dia === diaActualHoy &&
                                mes === mesActualHoy &&
                                anio === anioActualHoy;

                            return (
                                <div
                                    key={index}
                                    className={`h-28 md:h-32 p-1 md:p-1.5 border-b border-r border-neutro-200 flex flex-col transition-colors duration-200 ${
                                        esPosterior
                                            ? "bg-neutro-200/70"
                                            : tieneEventoSeleccionado
                                              ? "bg-[#D7D4D4]"
                                              : "bg-white hover:bg-[#F1F0F0]"
                                    }`}
                                >
                                    {celda.dia ? (
                                        <>
                                            <div className="mb-1 ml-0.5 flex items-center justify-start">
                                                <span
                                                    className={`flex items-center justify-center text-[10px] md:text-xs font-bold leading-none ${
                                                        esHoy
                                                            ? "bg-primario-900 text-white w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm"
                                                            : "text-neutro-900 w-5 h-5 md:w-6 md:h-6"
                                                    }`}
                                                >
                                                    {celda.dia}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-1 overflow-y-auto max-h-20 md:max-h-24 pr-0.5">
                                                {eventosDia.map((ev) => {
                                                    const esMantenimiento =
                                                        ev.clase ===
                                                        "mantenimiento";
                                                    const estaSeleccionado =
                                                        eventoSeleccionado?.id ===
                                                            ev.id &&
                                                        eventoSeleccionado?.clase ===
                                                            ev.clase;

                                                    return (
                                                        <button
                                                            key={`${ev.clase}-${ev.id}`}
                                                            type="button"
                                                            title={ev.titulo}
                                                            onClick={(e) => {
                                                                if (
                                                                    onSelectEvento
                                                                )
                                                                    onSelectEvento(
                                                                        ev,
                                                                    );

                                                                if (
                                                                    modoPublico
                                                                ) {
                                                                    const celdaDOM =
                                                                        e.currentTarget
                                                                            .closest(
                                                                                ".flex-col",
                                                                            )
                                                                            .getBoundingClientRect();
                                                                    const container =
                                                                        document
                                                                            .getElementById(
                                                                                "calendar-container",
                                                                            )
                                                                            .getBoundingClientRect();

                                                                    // Cálculos base
                                                                    let x =
                                                                        celdaDOM.left -
                                                                        container.left;
                                                                    let y =
                                                                        celdaDOM.bottom -
                                                                        container.top +
                                                                        10;

                                                                    // Prevenir desbordamiento horizontal en móviles
                                                                    const tooltipWidth =
                                                                        window.innerWidth <
                                                                        640
                                                                            ? 260
                                                                            : 280;
                                                                    if (
                                                                        x +
                                                                            tooltipWidth >
                                                                        container.width
                                                                    ) {
                                                                        x =
                                                                            container.width -
                                                                            tooltipWidth -
                                                                            10;
                                                                    }
                                                                    if (x < 0)
                                                                        x = 10;

                                                                    if (
                                                                        y +
                                                                            180 >
                                                                        container.height
                                                                    ) {
                                                                        y =
                                                                            celdaDOM.top -
                                                                            container.top -
                                                                            190;
                                                                    }

                                                                    setPosicionTooltip(
                                                                        {
                                                                            x,
                                                                            y,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            className={`text-left text-[9px] md:text-[11px] px-1 md:px-1.5 py-0.5 md:py-1 rounded transition-all cursor-pointer ${
                                                                estaSeleccionado
                                                                    ? "whitespace-normal break-words leading-tight w-[calc(100%-8px)] m-1"
                                                                    : "truncate w-full"
                                                            } ${
                                                                estaSeleccionado
                                                                    ? "bg-primario-700 text-white ring-2 ring-primario-700 ring-offset-1 md:ring-offset-2 ring-offset-white font-bold shadow-md"
                                                                    : esMantenimiento
                                                                      ? "bg-neutro-900 text-white border-l-2 border-primario-700"
                                                                      : "bg-[#1b9e85] text-white"
                                                            } ${
                                                                !estaSeleccionado &&
                                                                eventoSeleccionado
                                                                    ? "opacity-50 hover:opacity-85 font-medium"
                                                                    : !estaSeleccionado
                                                                      ? "font-medium hover:opacity-90"
                                                                      : ""
                                                            }`}
                                                        >
                                                            {estaSeleccionado
                                                                ? "● "
                                                                : ""}
                                                            {ev.titulo}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* TARJETA FLOTANTE (Solo para Modo Público) */}
            {modoPublico && eventoSeleccionado && (
                <div
                    className="absolute z-50 bg-white border border-neutro-300 shadow-xl rounded-xl p-3 md:p-4 w-[260px] md:w-[280px] flex flex-col gap-2 md:gap-3"
                    style={{ top: posicionTooltip.y, left: posicionTooltip.x }}
                >
                    <div className="flex justify-between items-start border-b border-neutro-200 pb-2">
                        <h3 className="text-xs md:text-sm font-bold text-neutro-900 leading-tight">
                            Detalles del Evento
                        </h3>
                        <button
                            onClick={() => onSelectEvento(eventoSeleccionado)}
                            className="text-neutro-400 hover:text-neutro-900 font-bold text-base md:text-lg leading-none cursor-pointer"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutro-500">
                                Evento
                            </span>
                            <p
                                className={`text-[11px] md:text-xs font-bold mt-0.5 ${eventoSeleccionado.clase === "mantenimiento" ? "text-neutro-900" : "text-[#1b9e85]"}`}
                            >
                                {eventoSeleccionado.titulo}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <div>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutro-500">
                                    Fecha
                                </span>
                                <p className="text-[11px] md:text-xs text-neutro-900 font-medium mt-0.5">
                                    {eventoSeleccionado.fecha?.split(/[ T]/)[0]}
                                </p>
                            </div>
                            <div>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutro-500">
                                    Hora
                                </span>
                                <p className="text-[11px] md:text-xs text-neutro-900 font-medium mt-0.5">
                                    {eventoSeleccionado.fecha
                                        ?.split(/[ T]/)[1]
                                        ?.slice(0, 5)}{" "}
                                    hrs
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutro-500">
                                Estado
                            </span>
                            <div className="mt-1">
                                <span
                                    className={`px-2 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wide ${eventoSeleccionado.realizado ? "bg-neutro-900 text-white" : "bg-neutro-100 text-neutro-500"}`}
                                >
                                    {eventoSeleccionado.realizado
                                        ? "Realizado"
                                        : "Pendiente"}
                                </span>
                            </div>
                        </div>

                        {eventoSeleccionado.descripcion && (
                            <div>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutro-500">
                                    Observaciones
                                </span>
                                <p className="text-[10px] md:text-xs text-neutro-700 bg-neutro-50 p-2 rounded-md border border-neutro-200 mt-1 leading-relaxed">
                                    {eventoSeleccionado.descripcion}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
