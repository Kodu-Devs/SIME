import React, { useState } from "react";

export default function AgendaSidePanel({ combos = {} }) {
    // Memoria para la pestaña activa
    const [activeTab, setActiveTab] = useState("mantenimiento");

    // Listas con datos de respaldo por si el controlador aún no manda nada
    const extintoresCapacitacion =
        combos?.extintores_capacitacion?.length > 0
            ? combos.extintores_capacitacion
            : [
                  { id: 1, etiqueta_inventario: "C-P-02-Medio uso" },
                  { id: 2, etiqueta_inventario: "E-N1-03-Medio uso" },
              ];

    const extintoresMantenimiento =
        combos?.extintores_mantenimiento?.length > 0
            ? combos.extintores_mantenimiento
            : [
                  {
                      id: 1,
                      etiqueta_inventario: "ITJMM-62007-5100-00294",
                      estatus: "Disponible",
                  },
                  {
                      id: 2,
                      etiqueta_inventario: "ITJMM-62007-5100-00308",
                      estatus: "Pendiente",
                  },
              ];

    // ESTADO NUEVO: Guarda el ID del extintor que el usuario elige en el <select>
    const [extintorSeleccionadoId, setExtintorSeleccionadoId] = useState(
        extintoresMantenimiento[0]?.id || "",
    );

    // Buscar todos los datos del extintor seleccionado para actualizar la parte de arriba
    const extintorSeleccionado =
        extintoresMantenimiento.find(
            (ext) => ext.id.toString() === extintorSeleccionadoId.toString(),
        ) || extintoresMantenimiento[0];

    return (
        <aside className="w-80 bg-white border border-neutro-300 rounded-xl p-5 flex flex-col gap-4 shadow-sm font-sans shrink-0">
            <h2 className="text-titulo-2 text-neutro-900">
                {activeTab === "capacitacion"
                    ? "Nueva Capacitación"
                    : "Programar Mantenimiento"}
            </h2>

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

            {activeTab === "capacitacion" ? (
                /* ---------- FORMULARIO: CAPACITACIÓN ---------- */
                <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Uso y manejo de extintores"
                            className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Hora
                            </label>
                            <input
                                type="time"
                                name="hora"
                                className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Lugar
                        </label>
                        <input
                            type="text"
                            name="ubicacion_id"
                            placeholder="[Lugar]"
                            className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 focus:border-primario-700 focus:ring-0"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-xs font-bold text-neutro-300 uppercase">
                            Extintores para la práctica
                        </span>

                        {extintoresCapacitacion.map((extintor, idx) => (
                            <label
                                key={extintor.id}
                                className="flex items-center gap-2 text-xs text-neutro-900 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked={idx === 0}
                                    className="rounded border-neutro-300 text-primario-700 focus:ring-0"
                                />
                                {extintor.etiqueta_inventario}
                            </label>
                        ))}
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
                /* ---------- FORMULARIO: MANTENIMIENTO ---------- */
                <form className="flex flex-col gap-3">
                    {/* PASTILLAS DINÁMICAS: Cambian según el extintor seleccionado */}
                    <div className="flex items-center gap-2">
                        <span className="bg-neutro-100 border border-neutro-300 text-neutro-900 text-xs font-semibold px-2.5 py-1 rounded-md">
                            {extintorSeleccionado?.etiqueta_inventario}
                        </span>
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded-md ${
                                extintorSeleccionado?.estatus === "Disponible"
                                    ? "bg-primario-700 text-white"
                                    : "bg-acento-500 text-neutro-900"
                            }`}
                        >
                            {extintorSeleccionado?.estatus}
                        </span>
                    </div>

                    {/* SELECTOR DESPLEGABLE: Actualiza el estado al cambiar */}
                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Extintor a mantener
                        </label>
                        <select
                            name="extintor_id"
                            value={extintorSeleccionadoId}
                            onChange={(e) =>
                                setExtintorSeleccionadoId(e.target.value)
                            }
                            className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                        >
                            {extintoresMantenimiento.map((ext) => (
                                <option key={ext.id} value={ext.id}>
                                    {ext.etiqueta_inventario}
                                </option>
                            ))}
                        </select>
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
                                name="tipo"
                                defaultValue="Mantenimiento preventivo"
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-etiqueta text-neutro-900">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    name="fecha_programada"
                                    className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-etiqueta text-neutro-900">
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    name="hora_programada"
                                    className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Notas / Observaciones
                            </label>
                            <textarea
                                rows="2"
                                name="descripcion"
                                placeholder="Revisión de sello de seguridad"
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 placeholder-neutro-300 resize-none focus:border-primario-700 focus:ring-0"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-2">
                        <button
                            type="button"
                            className="w-full bg-primario-700 hover:bg-primario-900 text-white text-etiqueta py-2 rounded-lg transition"
                        >
                            Guardar Mantenimiento
                        </button>
                    </div>
                </form>
            )}
        </aside>
    );
}
