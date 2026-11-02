import React from "react";

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SAB", "DOM"];

export default function CalendarGrid({
    eventos = [],
    mesActual,
    eventoSeleccionado,
    onSelectEvento,
}) {
    const [anio, mes] = (mesActual || "2026-10").split("-").map(Number);

    const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
    const totalDiasMes = new Date(anio, mes, 0).getDate();

    const totalCeldas = Math.ceil((primerDiaSemana + totalDiasMes) / 7) * 7;
    const celdas = Array.from({ length: totalCeldas }, (_, idx) => {
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
        <div className="bg-white border border-neutro-300 rounded-xl overflow-hidden shadow-sm w-full">
            <div className="grid grid-cols-7 border-b border-neutro-300 bg-white">
                {DIAS_SEMANA.map((dia) => (
                    <div
                        key={dia}
                        className="py-2 px-3 text-xs font-semibold text-neutro-600 uppercase tracking-wider border-r last:border-r-0 border-neutro-200"
                    >
                        {dia}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {celdas.map((celda, index) => {
                    const eventosDia = obtenerEventosDelDia(celda.dia);
                    const esPosterior = celda.tipo === "posterior";

                    return (
                        <div
                            key={index}
                            // h-24 otorga mayor altura y longitud a todo el calendario
                            className={`h-24 p-1.5 border-b border-r border-neutro-200 flex flex-col transition ${
                                esPosterior ? "bg-neutro-200/70" : "bg-white"
                            }`}
                        >
                            {celda.dia ? (
                                <>
                                    <span className="text-xs font-semibold text-neutro-900 leading-none mb-1 ml-0.5">
                                        {celda.dia}
                                    </span>

                                    <div className="flex flex-col gap-1 overflow-y-auto max-h-16 pr-0.5">
                                        {eventosDia.map((ev) => {
                                            const esMantenimiento =
                                                ev.clase === "mantenimiento";
                                            const estaSeleccionado =
                                                eventoSeleccionado?.id ===
                                                    ev.id &&
                                                eventoSeleccionado?.clase ===
                                                    ev.clase;

                                            return (
                                                <button
                                                    key={`${ev.clase}-${ev.id}`}
                                                    type="button"
                                                    onClick={() =>
                                                        onSelectEvento &&
                                                        onSelectEvento(ev)
                                                    }
                                                    title={ev.titulo}
                                                    className={`w-full text-left text-[11px] font-medium px-1.5 py-1 rounded truncate transition cursor-pointer ${
                                                        esMantenimiento
                                                            ? "bg-neutro-900 text-white border-l-2 border-primario-700"
                                                            : "bg-[#1b9e85] text-white"
                                                    } ${
                                                        estaSeleccionado
                                                            ? "ring-1 ring-primario-700 ring-offset-1"
                                                            : "hover:opacity-90"
                                                    }`}
                                                >
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
    );
}
