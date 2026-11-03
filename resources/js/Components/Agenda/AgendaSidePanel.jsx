import React, { useState, useEffect } from "react";

export default function AgendaSidePanel({
    combos = {},
    eventoSeleccionado = null,
}) {
    const [activeTab, setActiveTab] = useState("mantenimiento");

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

    const [extintorSeleccionadoId, setExtintorSeleccionadoId] = useState(
        extintoresMantenimiento[0]?.id || "",
    );

    const [formMantenimiento, setFormMantenimiento] = useState({
        tipo: "",
        fecha_programada: "",
        hora_programada: "",
        descripcion: "",
    });

    const [formCapacitacion, setFormCapacitacion] = useState({
        nombre: "",
        fecha: "",
        hora: "",
        ubicacion_id: "",
    });

    // Rellenar campos automáticamente al seleccionar un evento
    useEffect(() => {
        if (!eventoSeleccionado) {
            setExtintorSeleccionadoId(extintoresMantenimiento[0]?.id || "");
            setFormMantenimiento({
                tipo: "",
                fecha_programada: "",
                hora_programada: "",
                descripcion: "",
            });
            setFormCapacitacion({
                nombre: "",
                fecha: "",
                hora: "",
                ubicacion_id: "",
            });
            return;
        }

        // ESTAS TRES LÍNEAS ERAN LAS QUE FALTABAN:
        const fechaStr = String(eventoSeleccionado.fecha || "");
        const [fechaParte = "", horaParteCompleta = ""] =
            fechaStr.split(/[ T]/);
        const horaParte = horaParteCompleta
            ? horaParteCompleta.slice(0, 5)
            : "";

        if (eventoSeleccionado.clase === "mantenimiento") {
            setActiveTab("mantenimiento");

            let extEncontrado = extintoresMantenimiento.find(
                (e) => Number(e.id) === Number(eventoSeleccionado.extintor_id),
            );
            if (!extEncontrado && eventoSeleccionado.titulo) {
                extEncontrado = extintoresMantenimiento.find((e) =>
                    eventoSeleccionado.titulo.includes(e.etiqueta_inventario),
                );
            }
            if (extEncontrado) {
                setExtintorSeleccionadoId(extEncontrado.id);
            }

            let tipoServicio = eventoSeleccionado.tipo || "";
            if (!tipoServicio && eventoSeleccionado.titulo) {
                const partes = eventoSeleccionado.titulo.split("-ITJMM");
                tipoServicio =
                    partes[0]?.split("-")[0] || eventoSeleccionado.titulo;
            }

            setFormMantenimiento({
                tipo: tipoServicio,
                fecha_programada: fechaParte.slice(0, 10),
                hora_programada: horaParte,
                descripcion: eventoSeleccionado.descripcion || "",
            });
        } else if (eventoSeleccionado.clase === "capacitacion") {
            setActiveTab("capacitacion");

            const nombreLimpio =
                eventoSeleccionado.nombre ||
                String(eventoSeleccionado.titulo || "").replace(
                    /^Capacitaci[oó]n:\s*/i,
                    "",
                );

            setFormCapacitacion({
                nombre: nombreLimpio,
                fecha: fechaParte.slice(0, 10),
                hora: horaParte,
                ubicacion_id: eventoSeleccionado.ubicacion_id || "",
            });
        }
    }, [eventoSeleccionado]);

    const extintorSeleccionado =
        extintoresMantenimiento.find(
            (ext) => ext.id.toString() === extintorSeleccionadoId.toString(),
        ) || extintoresMantenimiento[0];

    const textoUbicacion = extintorSeleccionado?.edificio
        ? `${extintorSeleccionado.edificio} - ${extintorSeleccionado.piso_nombre} (${extintorSeleccionado.ubicacion_nombre})`
        : "Ubicación no asignada";

    const textoTipo =
        extintorSeleccionado?.tipoextintor_nombre || "Polvo químico seco";

    return (
        <aside className="w-80 bg-white border border-neutro-300 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm font-sans shrink-0">
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
                <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formCapacitacion.nombre}
                            onChange={(e) =>
                                setFormCapacitacion({
                                    ...formCapacitacion,
                                    nombre: e.target.value,
                                })
                            }
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
                                value={formCapacitacion.fecha}
                                onChange={(e) =>
                                    setFormCapacitacion({
                                        ...formCapacitacion,
                                        fecha: e.target.value,
                                    })
                                }
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
                                value={formCapacitacion.hora}
                                onChange={(e) =>
                                    setFormCapacitacion({
                                        ...formCapacitacion,
                                        hora: e.target.value,
                                    })
                                }
                                className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-etiqueta text-neutro-900">
                            Lugar
                        </label>
                        {ubicacionesPlanas.length > 0 ? (
                            <select
                                name="ubicacion_id"
                                value={formCapacitacion.ubicacion_id}
                                onChange={(e) =>
                                    setFormCapacitacion({
                                        ...formCapacitacion,
                                        ubicacion_id: e.target.value,
                                    })
                                }
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
                                value={formCapacitacion.ubicacion_id}
                                onChange={(e) =>
                                    setFormCapacitacion({
                                        ...formCapacitacion,
                                        ubicacion_id: e.target.value,
                                    })
                                }
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-xs font-bold text-neutro-300 uppercase">
                            Extintores para la práctica
                        </span>

                        <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5 pr-1">
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

                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            className="bg-primario-700 hover:bg-primario-900 text-white text-etiqueta px-5 py-2 rounded-lg transition"
                        >
                            Agendar
                        </button>
                    </div>
                </form>
            ) : (
                <form className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-etiqueta text-neutro-900">
                                Seleccionar Extintor
                            </span>
                            <span className="bg-acento-500 text-neutro-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                                {extintorSeleccionado?.estatus || "Pendiente"}
                            </span>
                        </div>

                        <select
                            name="extintor_id"
                            value={extintorSeleccionadoId}
                            onChange={(e) =>
                                setExtintorSeleccionadoId(e.target.value)
                            }
                            className="w-full bg-neutro-100 border border-neutro-300 text-neutro-900 text-xs font-semibold px-3 py-1.5 rounded-md focus:border-primario-700 focus:ring-0 cursor-pointer"
                        >
                            {extintoresMantenimiento.map((ext) => (
                                <option key={ext.id} value={ext.id}>
                                    {ext.etiqueta_inventario}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-etiqueta text-neutro-900">
                            Datos del extintor
                        </span>
                        <div className="border border-neutro-300 rounded-lg p-2 text-xs text-neutro-600 flex flex-col gap-0.5">
                            <span className="font-medium text-neutro-900">
                                {textoUbicacion}
                            </span>
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
                                value={formMantenimiento.tipo}
                                onChange={(e) =>
                                    setFormMantenimiento({
                                        ...formMantenimiento,
                                        tipo: e.target.value,
                                    })
                                }
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
                                    value={formMantenimiento.fecha_programada}
                                    onChange={(e) =>
                                        setFormMantenimiento({
                                            ...formMantenimiento,
                                            fecha_programada: e.target.value,
                                        })
                                    }
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
                                    value={formMantenimiento.hora_programada}
                                    onChange={(e) =>
                                        setFormMantenimiento({
                                            ...formMantenimiento,
                                            hora_programada: e.target.value,
                                        })
                                    }
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
                                value={formMantenimiento.descripcion}
                                onChange={(e) =>
                                    setFormMantenimiento({
                                        ...formMantenimiento,
                                        descripcion: e.target.value,
                                    })
                                }
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 resize-none focus:border-primario-700 focus:ring-0"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-1">
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
