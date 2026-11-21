import React from "react";

const CLASES_RAPIDAS = [
    { id: "A", nombre: "Sólidos" },
    { id: "B", nombre: "Líquidos" },
    { id: "C", nombre: "Eléctricos" },
    { id: "K", nombre: "Cocina" },
];

export default function ComoUsarExtintor({ onSelectClase }) {
    return (
        <div className="bg-white border border-neutro-100 p-5 rounded-xl shadow-sm">
            <div>
                <span className="text-primario-500 text-[10px] font-extrabold uppercase tracking-wider mb-0.5 block">
                    Antes de que lo necesite
                </span>
                <h2 className="text-titulo-2 font-bold text-neutro-900 mb-4">
                    Cómo usar un extintor
                </h2>
            </div>

            <div className="space-y-2.5 mb-5">
                <div className="flex bg-neutro-50 p-2.5 rounded-lg items-center">
                    <span className="text-primario-500 text-xl font-bold mr-3.5 w-4 text-center">
                        1
                    </span>
                    <div>
                        <h3 className="font-bold text-xs text-neutro-900 leading-tight">
                            Jale el seguro
                        </h3>
                        <p className="text-[11px] text-neutro-600 mt-0.5">
                            Retire el pasador con el extintor vertical.
                        </p>
                    </div>
                </div>
                <div className="flex bg-neutro-50 p-2.5 rounded-lg items-center">
                    <span className="text-primario-500 text-xl font-bold mr-3.5 w-4 text-center">
                        2
                    </span>
                    <div>
                        <h3 className="font-bold text-xs text-neutro-900 leading-tight">
                            Apunte a la base
                        </h3>
                        <p className="text-[11px] text-neutro-600 mt-0.5">
                            A la base del fuego, no a las llamas.
                        </p>
                    </div>
                </div>
                <div className="flex bg-neutro-50 p-2.5 rounded-lg items-center">
                    <span className="text-primario-500 text-xl font-bold mr-3.5 w-4 text-center">
                        3
                    </span>
                    <div>
                        <h3 className="font-bold text-xs text-neutro-900 leading-tight">
                            Apriete la palanca
                        </h3>
                        <p className="text-[11px] text-neutro-600 mt-0.5">
                            Presión continua a 2 o 3 metros.
                        </p>
                    </div>
                </div>
                <div className="flex bg-neutro-50 p-2.5 rounded-lg items-center">
                    <span className="text-primario-500 text-xl font-bold mr-3.5 w-4 text-center">
                        4
                    </span>
                    <div>
                        <h3 className="font-bold text-xs text-neutro-900 leading-tight">
                            Barra de lado a lado
                        </h3>
                        <p className="text-[11px] text-neutro-600 mt-0.5">
                            En abanico hasta apagarlo.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-[11px] font-bold text-neutro-600 uppercase tracking-wider mb-2">
                    Clases de fuego
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {CLASES_RAPIDAS.map((clase) => (
                        <button
                            key={clase.id}
                            type="button"
                            onClick={() => onSelectClase?.(clase.id)}
                            className="flex items-center text-xs font-bold text-neutro-900 bg-neutro-50 hover:bg-primario-100/60 hover:text-primario-700 border border-transparent hover:border-primario-300 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="bg-neutro-900 text-white w-6 h-6 flex items-center justify-center rounded-md mr-2 text-[11px] font-bold shrink-0">
                                {clase.id}
                            </span>
                            {clase.nombre}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
