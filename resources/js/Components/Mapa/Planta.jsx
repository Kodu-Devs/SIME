import React from "react";
import PlantaBaja from "@/Components/Mapa/Planos/PlantaBaja";
import PlantaAlta from "@/Components/Mapa/Planos/PlantaAlta";
import NivelesEdificioE from "@/Components/Mapa/Planos/Niveles";

// Agregamos onSeleccionarEspacio aquí en los props
export default function Planta({
    edificio,
    piso,
    onVolver,
    onSeleccionarEspacio,
}) {
    const esNivelSuperiorE =
        ["Nivel 1", "Nivel 2", "Nivel 3"].includes(piso) &&
        edificio === "Edificio E";

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutral-100 p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                        {edificio}
                    </h2>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600">
                        {piso}
                    </span>
                </div>
                <button
                    onClick={onVolver}
                    className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3.5 py-2 rounded-lg transition-colors"
                >
                    ← Volver a niveles
                </button>
            </div>

            <div className="w-full flex justify-center items-center min-h-[440px] bg-[#FAF9F9] rounded-xl p-2 border border-neutral-100 relative overflow-hidden">
                {/* Le pasamos la función a PlantaBaja y PlantaAlta */}
                {piso === "Planta baja" && (
                    <PlantaBaja
                        edificio={edificio}
                        onSeleccionarEspacio={onSeleccionarEspacio}
                    />
                )}

                {piso === "Planta alta" && (
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

                {!["Planta baja", "Planta alta"].includes(piso) &&
                    !esNivelSuperiorE && (
                        <div className="text-neutral-400 text-sm">
                            Plano de {piso} en desarrollo
                        </div>
                    )}
            </div>
        </div>
    );
}
