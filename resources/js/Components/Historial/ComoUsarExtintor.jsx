import React from 'react';

export default function ComoUsarExtintor() {
    return (
        /* Aquí igualamos el color exacto: bg-[#e9e9e9] */
        <div className="bg-[#e9e9e9] p-6 rounded-2xl shadow-sm">
            <div>
                <span className="text-red-500 text-[10px] font-extrabold uppercase tracking-wider mb-1 block">Antes de que lo necesites</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cómo usar un extintor</h2>
            </div>

            <div className="space-y-3 mb-6">
                {/* Los fondos de los pasos ahora son un poco más claros para que contrasten bien */}
                <div className="flex bg-[#f5f5f5] p-3 rounded-lg items-center shadow-sm">
                    <span className="text-red-500 text-2xl font-bold mr-4">1</span>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800 leading-tight">Jala el seguro</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Retira el pasador con el extintor vertical.</p>
                    </div>
                </div>
                <div className="flex bg-[#f5f5f5] p-3 rounded-lg items-center shadow-sm">
                    <span className="text-red-500 text-2xl font-bold mr-4">2</span>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800 leading-tight">Apunta a la base</h3>
                        <p className="text-xs text-gray-500 mt-0.5">A la base del fuego no a las llamas.</p>
                    </div>
                </div>
                <div className="flex bg-[#f5f5f5] p-3 rounded-lg items-center shadow-sm">
                    <span className="text-red-500 text-2xl font-bold mr-4">3</span>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800 leading-tight">Aprieta la palanca</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Presión continua a 2 o 3 metros.</p>
                    </div>
                </div>
                <div className="flex bg-[#f5f5f5] p-3 rounded-lg items-center shadow-sm">
                    <span className="text-red-500 text-2xl font-bold mr-4">4</span>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800 leading-tight">Barre de lado a lado</h3>
                        <p className="text-xs text-gray-500 mt-0.5">En abanico hasta apagarlo.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 text-left">Clases de fuego</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs font-bold text-gray-800 bg-[#f5f5f5] p-2.5 rounded-xl shadow-sm">
                        <span className="bg-[#2a2a2a] text-white w-6 h-6 flex items-center justify-center rounded-lg mr-2 text-[11px] font-bold">A</span> Sólidos
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-800 bg-[#f5f5f5] p-2.5 rounded-xl shadow-sm">
                        <span className="bg-[#2a2a2a] text-white w-6 h-6 flex items-center justify-center rounded-lg mr-2 text-[11px] font-bold">B</span> Líquidos
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-800 bg-[#f5f5f5] p-2.5 rounded-xl shadow-sm">
                        <span className="bg-[#2a2a2a] text-white w-6 h-6 flex items-center justify-center rounded-lg mr-2 text-[11px] font-bold">C</span> Eléctricos
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-800 bg-[#f5f5f5] p-2.5 rounded-xl shadow-sm">
                        <span className="bg-[#2a2a2a] text-white w-6 h-6 flex items-center justify-center rounded-lg mr-2 text-[11px] font-bold">K</span> Cocina
                    </div>
                </div>
            </div>
        </div>
    );
}