import React, { useState } from "react";

const COLUMNAS_CLASE = [
    { id: "A", corta: "A", titulo: "Clase A", subtitulo: "(Sólidos)" },
    { id: "B", corta: "B", titulo: "Clase B", subtitulo: "(Líquidos)" },
    { id: "C", corta: "C", titulo: "Clase C", subtitulo: "(Eléctricos)" },
    { id: "D", corta: "D", titulo: "Clase D", subtitulo: "(Metales)" },
    { id: "K", corta: "K/F", titulo: "Clase K/F", subtitulo: "(Cocinas)" },
];

const AGENTES = [
    {
        nombre: "Polvo ABC",
        clases: [
            { status: "excelente", texto: "Excelente" },
            { status: "excelente", texto: "Excelente" },
            { status: "excelente", texto: "Excelente" },
            { status: "no", texto: "No" },
            { status: "no", texto: "No" },
        ],
    },
    {
        nombre: "CO2 (Dióxido de carbono)",
        clases: [
            { status: "poco-eficaz", texto: "Poco eficaz" },
            { status: "bueno", texto: "Bueno" },
            { status: "poco-eficaz", texto: "Poco eficaz" },
            { status: "no", texto: "No" },
            { status: "no", texto: "No" },
        ],
    },
    {
        nombre: "Agua + Aditivos",
        clases: [
            { status: "excelente", texto: "Excelente" },
            { status: "solo-espuma", texto: "Solo espuma" },
            { status: "peligroso", texto: "Peligroso" },
            { status: "muy-peligroso", texto: "Muy peligroso" },
            { status: "muy-peligroso", texto: "Muy peligroso" },
        ],
    },
    {
        nombre: "Acetato de Potasio",
        clases: [
            { status: "bueno", texto: "Bueno" },
            { status: "limitado", texto: "Limitado" },
            { status: "no", texto: "No" },
            { status: "no", texto: "No" },
            { status: "especifico", texto: "Específico" },
        ],
    },
    {
        nombre: "Polvo especial (D)",
        clases: [
            { status: "no", texto: "No" },
            { status: "no", texto: "No" },
            { status: "no", texto: "No" },
            { status: "especifico", texto: "Específico" },
            { status: "no", texto: "No" },
        ],
    },
];

export default function TablaTiposExtintor({ onSelectClase }) {
    const [columnaHover, setColumnaHover] = useState(null);
    const [claseMovilIdx, setClaseMovilIdx] = useState(0);

    const getStatusStyles = (status) => {
        switch (status) {
            case "excelente":
                return "bg-[#a3e2d4] text-[#2c6e49]";
            case "bueno":
            case "especifico":
                return "bg-[#bae5db] text-[#1c644c]";
            case "poco-eficaz":
            case "solo-espuma":
            case "limitado":
                return "bg-[#fbeed4] text-[#b36b00]";
            case "peligroso":
            case "muy-peligroso":
            case "no":
                return "bg-[#fcd2d1] text-[#9b2c2c]";
            default:
                return "bg-gray-50 text-gray-500";
        }
    };

    const getIcon = (status) => {
        if (
            status === "excelente" ||
            status === "bueno" ||
            status === "especifico"
        ) {
            return <span className="text-sm mr-1">✓</span>;
        }
        if (
            status === "poco-eficaz" ||
            status === "solo-espuma" ||
            status === "limitado"
        ) {
            return <span className="text-xs mr-1">⚠️</span>;
        }
        return <span className="text-sm mr-1">✕</span>;
    };

    const claseActivaMovil = COLUMNAS_CLASE[claseMovilIdx];

    return (
        <div className="bg-white border border-neutro-100 p-4 sm:p-5 rounded-xl shadow-sm h-full flex flex-col justify-between min-w-0">
            {/* =========================================================
                VISTA MÓVIL (< md): Selector de clase + tabla de 2 cols
               ========================================================= */}
            <div className="md:hidden space-y-3">
                <div>
                    <p className="text-xs text-neutro-600 mb-2">
                        Elija una{" "}
                        <strong className="text-neutro-900">
                            Clase de fuego
                        </strong>{" "}
                        o toca la columna para ver su guía:
                    </p>

                    <div className="grid grid-cols-5 gap-1.5">
                        {COLUMNAS_CLASE.map((col, idx) => {
                            const seleccionada = claseMovilIdx === idx;
                            return (
                                <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => setClaseMovilIdx(idx)}
                                    className={`py-2 px-1 rounded-lg text-center border transition-all cursor-pointer ${
                                        seleccionada
                                            ? "bg-primario-500 text-white border-primario-500 shadow-xs font-bold"
                                            : "bg-neutro-50 text-neutro-900 border-neutro-100 hover:border-primario-300 font-semibold"
                                    }`}
                                >
                                    <span className="block text-xs leading-tight">
                                        {col.corta}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Matriz de 2 columnas con el mismo estilo de la tabla de escritorio */}
                <div className="bg-neutro-50 p-2.5 rounded-xl">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Encabezado izquierdo */}
                        <div className="bg-white border border-neutro-100 p-2.5 rounded-lg flex flex-col justify-center items-center h-[70px] shadow-xs">
                            <span className="text-[11px] font-bold text-neutro-600 leading-tight">
                                Tipo
                            </span>
                            <span className="text-xs font-bold text-neutro-900 leading-tight">
                                Agente
                            </span>
                        </div>

                        {/* Encabezado derecho (clase activa, clickable hacia la guía) */}
                        <button
                            type="button"
                            onClick={() => onSelectClase?.(claseActivaMovil.id)}
                            className="bg-primario-100 border border-primario-500 ring-1 ring-primario-500 p-2 rounded-lg flex flex-col justify-center items-center h-[70px] text-center shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <span className="text-xs font-bold text-primario-700 leading-tight">
                                {claseActivaMovil.titulo}
                            </span>
                            <span className="text-[10px] text-neutro-600 mt-0.5 leading-tight">
                                {claseActivaMovil.subtitulo}
                            </span>
                            <span className="text-[10px] font-bold text-primario-700 mt-0.5">
                                Ver guía →
                            </span>
                        </button>

                        {/* Filas de agentes */}
                        {AGENTES.map((agente, rowIdx) => {
                            const celda = agente.clases[claseMovilIdx];

                            return (
                                <React.Fragment key={rowIdx}>
                                    <div className="bg-white border border-neutro-100 p-2.5 rounded-lg flex flex-col justify-center items-center text-center h-[64px] shadow-xs">
                                        <span className="text-xs font-bold text-neutro-900 leading-tight">
                                            {agente.nombre.split(" (")[0]}
                                        </span>
                                        {agente.nombre.includes("(") && (
                                            <span className="text-[10px] text-neutro-600 block leading-tight mt-0.5">
                                                ({agente.nombre.split("(")[1]}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectClase?.(claseActivaMovil.id)
                                        }
                                        className={`p-2 rounded-lg flex items-center justify-center h-[64px] text-center text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer border border-transparent ${getStatusStyles(celda.status)}`}
                                    >
                                        <div className="flex items-center justify-center leading-tight">
                                            {getIcon(celda.status)}
                                            <span>{celda.texto}</span>
                                        </div>
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =========================================================
                VISTA TABLET Y ESCRITORIO (>= md): Matriz completa 6 cols
               ========================================================= */}
            <div className="hidden md:flex md:flex-col md:flex-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs text-neutro-600">
                        Haga clic en cualquier columna de{" "}
                        <strong className="text-neutro-900">
                            Clase de fuego
                        </strong>{" "}
                        para ver su guía detallada.
                    </p>
                </div>

                <div className="bg-neutro-50 p-3 rounded-xl overflow-x-auto flex-1">
                    <div className="grid grid-cols-6 gap-2 min-w-[600px]">
                        {/* Esquina superior izquierda */}
                        <div className="bg-white border border-neutro-100 p-2.5 rounded-lg flex flex-col justify-center items-center h-[74px] shadow-xs">
                            <span className="text-[11px] font-bold text-neutro-600 leading-tight">
                                Tipo
                            </span>
                            <span className="text-xs font-bold text-neutro-900 leading-tight">
                                Agente
                            </span>
                        </div>

                        {/* Encabezados interactivos por Clase de Fuego */}
                        {COLUMNAS_CLASE.map((col, idx) => {
                            const activa = columnaHover === idx;

                            return (
                                <button
                                    key={col.id}
                                    type="button"
                                    onMouseEnter={() => setColumnaHover(idx)}
                                    onMouseLeave={() => setColumnaHover(null)}
                                    onClick={() => onSelectClase?.(col.id)}
                                    className={`p-2.5 rounded-lg flex flex-col justify-center items-center h-[74px] text-center shadow-xs transition-all cursor-pointer border ${
                                        activa
                                            ? "bg-primario-100 border-primario-500 ring-1 ring-primario-500 -translate-y-0.5"
                                            : "bg-white border-neutro-100 hover:border-primario-300"
                                    }`}
                                >
                                    <span
                                        className={`text-xs sm:text-sm font-bold leading-tight ${
                                            activa
                                                ? "text-primario-700"
                                                : "text-neutro-900"
                                        }`}
                                    >
                                        {col.titulo}
                                    </span>
                                    <span className="text-[11px] text-neutro-600 mt-0.5">
                                        {col.subtitulo}
                                    </span>
                                    <span
                                        className={`text-[10px] font-semibold mt-0.5 transition-opacity ${
                                            activa
                                                ? "text-primario-700 opacity-100"
                                                : "text-primario-500 opacity-0"
                                        }`}
                                    >
                                        Ver guía →
                                    </span>
                                </button>
                            );
                        })}

                        {/* Filas de agentes */}
                        {AGENTES.map((agente, rowIdx) => (
                            <React.Fragment key={rowIdx}>
                                <div className="bg-white border border-neutro-100 p-2.5 rounded-lg flex flex-col justify-center items-center text-center h-[74px] shadow-xs">
                                    <span className="text-xs font-bold text-neutro-900 leading-tight">
                                        {agente.nombre.split(" (")[0]}
                                    </span>
                                    {agente.nombre.includes("(") && (
                                        <span className="text-[10px] text-neutro-600 block leading-tight mt-0.5">
                                            ({agente.nombre.split("(")[1]}
                                        </span>
                                    )}
                                </div>

                                {agente.clases.map((c, colIdx) => {
                                    const activa = columnaHover === colIdx;
                                    const atenuada =
                                        columnaHover !== null && !activa;

                                    return (
                                        <button
                                            key={colIdx}
                                            type="button"
                                            onMouseEnter={() =>
                                                setColumnaHover(colIdx)
                                            }
                                            onMouseLeave={() =>
                                                setColumnaHover(null)
                                            }
                                            onClick={() =>
                                                onSelectClase?.(
                                                    COLUMNAS_CLASE[colIdx].id,
                                                )
                                            }
                                            className={`p-2 rounded-lg flex flex-col justify-center items-center h-[74px] text-center text-xs font-bold shadow-xs transition-all cursor-pointer border ${getStatusStyles(c.status)} ${
                                                activa
                                                    ? "border-primario-500 ring-1 ring-primario-500/70 brightness-95 scale-[1.02] z-10"
                                                    : atenuada
                                                      ? "border-transparent opacity-65"
                                                      : "border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-center justify-center leading-tight">
                                                {getIcon(c.status)}
                                                <span>{c.texto}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
