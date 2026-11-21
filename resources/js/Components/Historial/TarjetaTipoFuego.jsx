import React from "react";

export default function TarjetaTipoFuego({
    letra,
    titulo,
    destacada = false,
    children,
}) {
    const coloresPorLetra = {
        A: "bg-[#b6f0aa] text-[#1c644c]",
        B: "bg-[#fcd2d1] text-[#9b2c2c]",
        C: "bg-[#d0dbfa] text-[#1a237e]",
        D: "bg-[#fce599] text-[#b36b00]",
        K: "bg-[#d9d9d9] text-[#4a4a4a]",
    };

    const colorActual = coloresPorLetra[letra] || "bg-gray-200 text-gray-800";

    return (
        <div
            className={`bg-white rounded-2xl p-6 sm:p-8 mb-6 transition-all duration-300 border ${
                destacada
                    ? "border-primario-500 ring-2 ring-primario-500/40 shadow-md"
                    : "border-neutro-100 shadow-sm"
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center">
                    <span
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg mr-4 shrink-0 ${colorActual}`}
                    >
                        {letra}
                    </span>
                    <h3 className="text-xl sm:text-[24px] font-bold text-neutro-900">
                        {titulo}
                    </h3>
                </div>

                {destacada && (
                    <span className="px-3 py-1 rounded-full bg-primario-100 text-primario-700 text-xs font-bold">
                        Clase seleccionada
                    </span>
                )}
            </div>

            <div className="space-y-6">{children}</div>
        </div>
    );
}
