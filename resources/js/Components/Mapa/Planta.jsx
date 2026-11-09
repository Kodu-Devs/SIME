import React from "react";
import PlantaBaja from "@/Components/Mapa/Planos/PlantaBaja";
import PlantaAlta from "@/Components/Mapa/Planos/PlantaAlta";
import NivelesEdificioE from "@/Components/Mapa/Planos/Niveles";

export default function Planta({
    edificio,
    piso,
    ubicaciones = [],
    ubicacionActivaId = null,
    onSeleccionarUbicacion,
    onVolver,
    onSeleccionarEspacio,
}) {
    const esNivelSuperiorE =
        ["Nivel 1", "Nivel 2", "Nivel 3"].includes(piso) &&
        edificio === "Edificio E";

    const esPlantaBajaOUnica = piso === "Planta baja" || piso === "Nivel único";

    const esPlantaAltaABCD =
        (piso === "Nivel 1" || piso === "Planta alta") &&
        edificio !== "Edificio E";

    const obtenerColorPin = (extintores = []) => {
        if (extintores.some((e) => e.estado === "vencido")) {
            return "bg-primario-500 border-white text-white";
        }
        if (extintores.some((e) => e.estado === "por_vencer")) {
            return "bg-amber-500 border-white text-white";
        }
        return "bg-acento-500 border-white text-white";
    };

    const ubicacionesConCoordenadas = ubicaciones.filter(
        (u) =>
            u.posicion &&
            typeof u.posicion.x === "number" &&
            typeof u.posicion.y === "number",
    );

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutro-100 p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-neutro-100">
                <div>
                    <h2 className="text-titulo-2 font-bold text-neutro-900">
                        {edificio}
                    </h2>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primario-100 text-primario-700">
                        {piso}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onVolver}
                    className="text-xs font-medium bg-neutro-100 hover:bg-neutro-300/40 text-neutro-900 px-3.5 py-2 rounded-lg transition-colors"
                >
                    ← Volver
                </button>
            </div>

            <div className="w-full flex justify-center items-center min-h-[440px] bg-neutro-50 rounded-xl p-2 border border-neutro-100 relative overflow-hidden">
                {esPlantaBajaOUnica && (
                    <PlantaBaja
                        edificio={edificio}
                        onSeleccionarEspacio={onSeleccionarEspacio}
                    />
                )}

                {esPlantaAltaABCD && (
                    <PlantaAlta
                        edificio={edificio}
                        onSeleccionarEspacio={onSeleccionarEspacio}
                    />
                )}

                {esNivelSuperiorE && (
                    <NivelesEdificioE
                        piso={piso}
                        onSeleccionarEspacio={onSeleccionarEspacio}
                    />
                )}

                {!esPlantaBajaOUnica &&
                    !esPlantaAltaABCD &&
                    !esNivelSuperiorE && (
                        <div className="text-neutro-600 text-sm">
                            Plano de {piso} en preparación
                        </div>
                    )}

                {/* Capa de Pines de Ubicaciones con coordenadas en BD */}
                {ubicacionesConCoordenadas.map((ub) => {
                    const colorClase = obtenerColorPin(ub.extintores);
                    const activo = ubicacionActivaId === ub.id;

                    return (
                        <button
                            key={ub.id}
                            type="button"
                            onClick={() => onSeleccionarUbicacion?.(ub)}
                            style={{
                                left: `${ub.posicion.x}%`,
                                top: `${ub.posicion.y}%`,
                            }}
                            title={`${ub.nombre} (${ub.extintores?.length || 0} extintores)`}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 shadow-md flex items-center justify-center text-[11px] font-bold transition-transform ${colorClase} ${
                                activo
                                    ? "scale-125 ring-2 ring-neutro-900"
                                    : "hover:scale-110"
                            }`}
                        >
                            {ub.extintores?.length || 0}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
