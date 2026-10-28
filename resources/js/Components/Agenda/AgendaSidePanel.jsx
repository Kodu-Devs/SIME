import React, { useState } from "react";

export default function AgendaSidePanel({ combos = {} }) {
    // Pestaña activa ('mantenimiento' | 'capacitacion')
    const [activeTab, setActiveTab] = useState("mantenimiento");

    // 1. Extintores para capacitación enviados por AgendaController
    const extintoresCapacitacion =
        combos?.extintores_capacitacion?.length > 0
            ? combos.extintores_capacitacion
            : [
                  { id: 1, etiqueta_inventario: "C-P-02-Medio uso" },
                  { id: 2, etiqueta_inventario: "E-N1-03-Medio uso" },
              ];

    // 2. Extintores para mantenimiento enviados por AgendaController
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

    // 3. Aplanar el árbol de ubicaciones para el <select> de Lugar en Capacitación
    const obtenerListaUbicaciones = () => {
        const arbol = combos?.ubicaciones || [];
        const lista = [];

        arbol.forEach((inst) => {
            if (inst.pisos && Array.isArray(inst.pisos)) {
                inst.pisos.forEach((piso) => {
                    if (piso.ubicaciones && Array.isArray(piso.ubicaciones)) {
                        piso.ubicaciones.forEach((ub) => {
                            lista.push({
                                id: ub.id,
                                texto: `${inst.nombre} - ${piso.nombre ?? piso.numero ?? ""} (${ub.nombre})`,
                            });
                        });
                    }
                });
            } else if (inst.id && inst.nombre) {
                lista.push({ id: inst.id, texto: inst.nombre });
            }
        });

        return lista;
    };

    const ubicacionesPlanas = obtenerListaUbicaciones();

    // Estado del extintor seleccionado en el menú desplegable
    const [extintorSeleccionadoId, setExtintorSeleccionadoId] = useState(
        extintoresMantenimiento[0]?.id || "",
    );

    // Buscar el objeto exacto del extintor seleccionado en el arreglo
    const extintorSeleccionado =
        extintoresMantenimiento.find(
            (ext) => ext.id.toString() === extintorSeleccionadoId.toString(),
        ) || extintoresMantenimiento[0];

    // EXTRACCIÓN DINÁMICA: Actualiza la ubicación y el tipo según el extintor elegido
    const textoUbicacion = extintorSeleccionado?.ubicacion_nombre
        ? `${extintorSeleccionado.ubicacion_nombre} - Piso ${extintorSeleccionado.piso_numero ?? "N/A"}`
        : extintorSeleccionado?.ubicacion?.nombre
          ? `${extintorSeleccionado.ubicacion.nombre}`
          : "Ubicación no asignada";

    const textoTipo =
        extintorSeleccionado?.tipo_nombre ||
        extintorSeleccionado?.tipo_extintor?.nombre ||
        extintorSeleccionado?.tipo ||
        "Polvo químico seco";

    return (
        <aside className="w-80 bg-white border border-neutro-300 rounded-xl p-5 flex flex-col gap-4 shadow-sm font-sans shrink-0">
            {/* Título dinámico */}
            <h2 className="text-titulo-2 text-neutro-900">
                {activeTab === "capacitacion"
                    ? "Nueva Capacitación"
                    : "Programar Mantenimiento"}
            </h2>

            {/* Pestañas */}
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
                                name="fecha"
                                className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-etiqueta text-neutro-900">
                                Hora
                            </label>
                            <input
                                type="time"
                                name="hora"
                                className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Campo Lugar */}
                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Lugar
                        </label>
                        {ubicacionesPlanas.length > 0 ? (
                            <select
                                name="ubicacion_id"
                                defaultValue=""
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            >
                                <option value="" disabled></option>
                                {ubicacionesPlanas.map((ub) => (
                                    <option key={ub.id} value={ub.id}>
                                        {ub.texto}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                name="ubicacion_id"
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-xs font-bold text-neutro-300 uppercase">
                            Extintores para la práctica
                        </span>

                        <div className="max-h-28 overflow-y-auto flex flex-col gap-1.5 pr-1">
                            {extintoresCapacitacion.map((extintor) => (
                                <label
                                    key={extintor.id}
                                    className="flex items-center gap-2 text-xs text-neutro-900 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-neutro-300 text-primario-700 focus:ring-0"
                                    />
                                    {extintor.etiqueta_inventario}
                                </label>
                            ))}
                        </div>
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
                    {/* Selector integrado en la pastilla de folio + Pastilla de estatus */}
                    <div className="flex items-center gap-2">
                        <select
                            name="extintor_id"
                            value={extintorSeleccionadoId}
                            onChange={(e) =>
                                setExtintorSeleccionadoId(e.target.value)
                            }
                            className="flex-1 bg-neutro-100 border border-neutro-300 text-neutro-900 text-xs font-semibold pl-2.5 pr-7 py-1.5 rounded-md focus:border-primario-700 focus:ring-0 truncate cursor-pointer"
                        >
                            {extintoresMantenimiento.map((ext) => (
                                <option key={ext.id} value={ext.id}>
                                    {ext.etiqueta_inventario}
                                </option>
                            ))}
                        </select>

                        <span className="bg-acento-500 text-neutro-900 text-xs font-semibold px-3 py-1.5 rounded-md shrink-0">
                            {extintorSeleccionado?.estatus || "Pendiente"}
                        </span>
                    </div>

                    {/* RECUADRO INFORMATIVO DINÁMICO: Se actualiza al cambiar el extintor */}
                    <div className="flex flex-col gap-1">
                        <span className="text-etiqueta text-neutro-900">
                            Datos del extintor
                        </span>
                        <div className="border border-neutro-300 rounded-lg p-2.5 text-xs text-neutro-600 flex flex-col gap-0.5">
                            <span>{textoUbicacion}</span>
                            <span>Tipo: {textoTipo}</span>
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
                                name="tipo"
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
                                    className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-etiqueta text-neutro-900">
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    name="hora_programada"
                                    className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
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
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 resize-none focus:border-primario-700 focus:ring-0"
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
