import React, { useState } from "react";

export default function AgendaSidePanel() {
    //memoria para saber en qué pestaña estamos (por defecto arranca en capacitacion)
    const [activeTab, setActiveTab] = useState("capacitacion");

    //contenedor principal de todo el panel derecho
    return (
        <aside className="w-80 bg-white border border-neutro-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm font-sans">
            {/* El título cambia solito dependiendo de la pestaña seleccionada */}
            <h2 className="text-titulo-2 text-neutro-900">
                {activeTab === "capacitacion"
                    ? "Nueva Capacitacion"
                    : "Programar Mantenimiento"}
            </h2>

            {/* botones grises para cambiar de vista */}
            <div className="flex bg-neutro-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setActiveTab("mantenimiento")}
                    className={`flex-1 py-1.5 text-etiqueta rounded-md transition ${
                        activeTab === "mantenimiento"
                            ? "bg-white text-neutro-900 shadow-sm"
                            : "text-neutro-600 hover:text-neutro-900"
                    }`}
                >
                    Mantenimiento
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("capacitacion")}
                    className={`flex-1 py-1.5 text-etiqueta rounded-md transition ${
                        activeTab === "capacitacion"
                            ? "bg-white text-neutro-900 shadow-sm"
                            : "text-neutro-600 hover:text-neutro-900"
                    }`}
                >
                    Capacitación
                </button>
            </div>

            {/* vista de nueva capacitacion */}
            {activeTab === "capacitacion" ? (
                <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Uso y manejo de extintores"
                            className="border border-neutro-100 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                        />
                    </div>

                    {/* Dividir en 2 columnas para que quepan fecha y hora juntas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Fecha
                            </label>
                            <input
                                type="text"
                                placeholder="[dd/mm/aaaa]"
                                className="border border-neutro-100 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Hora
                            </label>
                            <input
                                type="text"
                                placeholder="[hh:mm]"
                                className="border border-neutro-100 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Lugar
                        </label>
                        <input
                            type="text"
                            placeholder="[Lugar]"
                            className="border border-neutro-100 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                        />
                    </div>

                    {/*checkboxes de los extintores */}
                    <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-xs font-bold text-neutro-300 uppercase">
                            Extintores para la práctica
                        </span>

                        <label className="flex items-center gap-2 text-xs text-neutro-600 cursor-pointer">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="rounded border-neutro-300 text-primario-700 focus:ring-0"
                            />
                            C-P-02-Medio uso
                        </label>
                        <label className="flex items-center gap-2 text-xs text-neutro-600 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-neutro-300 text-primario-700 focus:ring-0"
                            />
                            E-N1-03-Medio uso
                        </label>
                        <label className="flex items-center gap-2 text-xs text-neutro-600 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-neutro-300 text-primario-700 focus:ring-0"
                            />
                            B-PA-01-recién mantenido
                        </label>
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            className="bg-primario-700 hover:bg-primario-900 text-white text-etiqueta px-5 py-2 rounded-lg transition"
                        >
                            Agendar
                        </button>
                    </div>
                </form>
            ) : (
                /*vista para programar mantenimiento*/
                <form className="flex flex-col gap-3">
                    {/* Etiquetas del extintor seleccionado */}
                    <div className="flex items-center gap-2">
                        <span className="bg-neutro-100 border border-neutro-300 text-neutro-900 text-xs font-semibold px-2.5 py-1 rounded-md">
                            ITJMM-62007-5100-00308
                        </span>
                        <span className="bg-acento-500 text-neutro-900 text-xs font-semibold px-3 py-1 rounded-md">
                            Pendiente
                        </span>
                    </div>

                    {/*info del edificio y tipo */}
                    <div className="flex flex-col gap-1">
                        <span className="text-etiqueta text-neutro-900">
                            Datos del extintor
                        </span>
                        <div className="border border-neutro-100 rounded-lg p-2.5 text-xs text-neutro-600 flex flex-col gap-0.5">
                            <span>Edificio A - Planta Baja</span>
                            <span>Tipo: Polvo químico seco</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-etiqueta text-neutro-900">
                            Formulario
                        </span>

                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Tipo de Servicio
                            </label>
                            <input
                                type="text"
                                defaultValue="Mantenimiento preventivo"
                                className="border border-neutro-100 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-etiqueta text-neutro-900">
                                    Fecha
                                </label>
                                <input
                                    type="text"
                                    placeholder="[dd/mm/aaaa]"
                                    className="border border-neutro-100 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-etiqueta text-neutro-900">
                                    Hora
                                </label>
                                <input
                                    type="text"
                                    placeholder="[hh:mm]"
                                    className="border border-neutro-100 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Caja de texto alineada con el mismo padding de los inputs */}
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Notas / Observaciones
                            </label>
                            <textarea
                                rows="2"
                                placeholder="Revisión de sello de seguridad"
                                className="border border-neutro-100 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 resize-none focus:border-primario-700 focus:ring-0"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            className="bg-primario-700 hover:bg-primario-900 text-white text-etiqueta px-5 py-2 rounded-lg transition"
                        >
                            Guardar Mantenimiento
                        </button>
                    </div>
                </form>
            )}
        </aside>
    );
}
