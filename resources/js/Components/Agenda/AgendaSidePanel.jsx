import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

export default function AgendaSidePanel({
    combos = {},
    eventoSeleccionado = null,
    onCancelMovil,
    onSuccess,
    tabInicial = "mantenimiento",
}) {
    const { errors, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState(tabInicial);
    const [procesando, setProcesando] = useState(false);

    const extintoresCapacitacion =
        combos?.extintores_capacitacion?.length > 0
            ? combos.extintores_capacitacion
            : [];

    const extintoresMantenimiento =
        combos?.extintores_mantenimiento?.length > 0
            ? combos.extintores_mantenimiento
            : [];

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
        extintores_id: [],
    });

    const limpiarFormularios = () => {
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
            extintores_id: [],
        });
    };

    useEffect(() => {
        if (!eventoSeleccionado) {
            setActiveTab(tabInicial); // Se cambia dinámicamente según la URL
            limpiarFormularios();
            return;
        }

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
                    partes[0]?.split("-")[0]?.trim() ||
                    eventoSeleccionado.titulo;
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
                extintores_id: eventoSeleccionado.extintores_id || [],
            });
        }
    }, [eventoSeleccionado, tabInicial]);

    const extintorSeleccionado =
        extintoresMantenimiento.find(
            (ext) => ext.id.toString() === extintorSeleccionadoId.toString(),
        ) || extintoresMantenimiento[0];

    const textoUbicacion = extintorSeleccionado?.edificio
        ? `${extintorSeleccionado.edificio} - ${extintorSeleccionado.piso_nombre} (${extintorSeleccionado.ubicacion_nombre})`
        : "Ubicación no asignada";

    const textoTipo =
        extintorSeleccionado?.tipoextintor_nombre || "Polvo químico seco";

    const handleSubmitMantenimiento = (e) => {
        e.preventDefault();
        const fechaCompleta =
            formMantenimiento.fecha_programada &&
            formMantenimiento.hora_programada
                ? `${formMantenimiento.fecha_programada} ${formMantenimiento.hora_programada}:00`
                : formMantenimiento.fecha_programada;

        const payload = {
            extintor_id: extintorSeleccionadoId,
            tipo: formMantenimiento.tipo,
            descripcion: formMantenimiento.descripcion,
            fecha_programada: fechaCompleta,
        };

        setProcesando(true);

        if (
            eventoSeleccionado &&
            eventoSeleccionado.clase === "mantenimiento"
        ) {
            router.put(
                route("agenda.mantenimientos.update", eventoSeleccionado.id),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                    onFinish: () => setProcesando(false),
                },
            );
        } else {
            router.post(route("agenda.mantenimientos.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    limpiarFormularios();
                    if (onSuccess) onSuccess();
                },
                onFinish: () => setProcesando(false),
            });
        }
    };

    const handleSubmitCapacitacion = (e) => {
        e.preventDefault();
        const fechaCompleta =
            formCapacitacion.fecha && formCapacitacion.hora
                ? `${formCapacitacion.fecha} ${formCapacitacion.hora}:00`
                : formCapacitacion.fecha;

        const payload = {
            nombre: formCapacitacion.nombre,
            fecha_hora: fechaCompleta,
            ubicacion_id: formCapacitacion.ubicacion_id,
            extintores_id: formCapacitacion.extintores_id,
        };

        setProcesando(true);

        if (eventoSeleccionado && eventoSeleccionado.clase === "capacitacion") {
            router.put(
                route("agenda.capacitaciones.update", eventoSeleccionado.id),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (onSuccess) onSuccess();
                    },
                    onFinish: () => setProcesando(false),
                },
            );
        } else {
            router.post(route("agenda.capacitaciones.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    limpiarFormularios();
                    if (onSuccess) onSuccess();
                },
                onFinish: () => setProcesando(false),
            });
        }
    };

    const handleEliminar = () => {
        if (!eventoSeleccionado) return;

        const tipoTexto =
            eventoSeleccionado.clase === "capacitacion"
                ? "esta capacitación"
                : "este mantenimiento";

        if (
            !window.confirm(
                `¿Estás seguro de que deseas eliminar ${tipoTexto}?`,
            )
        ) {
            return;
        }

        const url =
            eventoSeleccionado.clase === "capacitacion"
                ? route("agenda.capacitaciones.destroy", eventoSeleccionado.id)
                : route("agenda.mantenimientos.destroy", eventoSeleccionado.id);

        setProcesando(true);
        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                limpiarFormularios();
                if (onSuccess) onSuccess();
            },
            onFinish: () => setProcesando(false),
        });
    };

    return (
        <aside className="w-full lg:w-80 bg-white border border-neutro-300 rounded-xl p-4 md:p-5 flex flex-col gap-3.5 shadow-sm font-sans shrink-0">
            <div className="flex items-center justify-between">
                <h2 className="text-titulo-2 text-neutro-900">
                    {activeTab === "capacitacion"
                        ? eventoSeleccionado
                            ? "Detalles de Capacitación"
                            : "Nueva Capacitación"
                        : eventoSeleccionado
                          ? "Detalles de Mantenimiento"
                          : "Programar Mantenimiento"}
                </h2>
                {eventoSeleccionado && (
                    <span className="text-[11px] font-semibold bg-neutro-100 text-neutro-600 px-2 py-0.5 rounded-full">
                        Edición
                    </span>
                )}
            </div>

            {flash?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-2.5">
                    {flash.error}
                </div>
            )}

            <div className="flex bg-neutro-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setActiveTab("mantenimiento")}
                    className={`flex-1 py-1.5 text-[11px] md:text-xs font-semibold rounded-md transition cursor-pointer ${
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
                    className={`flex-1 py-1.5 text-[11px] md:text-xs font-semibold rounded-md transition cursor-pointer ${
                        activeTab === "capacitacion"
                            ? "bg-white text-neutro-900 shadow-sm"
                            : "text-neutro-600 hover:text-neutro-900"
                    }`}
                >
                    Capacitación
                </button>
            </div>

            {activeTab === "capacitacion" ? (
                <form
                    onSubmit={handleSubmitCapacitacion}
                    className="flex flex-col gap-3"
                >
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
                        {errors?.nombre && (
                            <span className="text-red-600 text-[11px]">
                                {errors.nombre}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
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
                        {errors?.fecha_hora && (
                            <span className="text-red-600 text-[11px]">
                                {errors.fecha_hora}
                            </span>
                        )}
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
                                <option value="" disabled>
                                    Seleccione una ubicación
                                </option>
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
                        {errors?.ubicacion_id && (
                            <span className="text-red-600 text-[11px]">
                                {errors.ubicacion_id}
                            </span>
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
                                    className="flex items-center gap-2 text-[11px] md:text-xs text-neutro-900 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formCapacitacion.extintores_id.some(
                                            (id) =>
                                                String(id) ===
                                                String(extintor.id),
                                        )}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFormCapacitacion((prev) => ({
                                                ...prev,
                                                extintores_id: isChecked
                                                    ? [
                                                          ...prev.extintores_id,
                                                          extintor.id,
                                                      ]
                                                    : prev.extintores_id.filter(
                                                          (id) =>
                                                              String(id) !==
                                                              String(
                                                                  extintor.id,
                                                              ),
                                                      ),
                                            }));
                                        }}
                                        className="rounded border-neutro-300 text-primario-700 focus:ring-0 cursor-pointer"
                                    />
                                    {extintor.etiqueta_inventario}
                                </label>
                            ))}
                        </div>
                        {errors?.extintores_id && (
                            <span className="text-red-600 text-[11px]">
                                {errors.extintores_id}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 mt-1">
                        {eventoSeleccionado && (
                            <button
                                type="button"
                                disabled={procesando}
                                onClick={handleEliminar}
                                className="w-1/3 bg-white hover:bg-red-50 text-red-600 border border-red-600 text-etiqueta px-3 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={procesando}
                            className={`${
                                eventoSeleccionado ? "w-2/3" : "w-full"
                            } bg-primario-700 hover:bg-primario-900 text-white text-etiqueta px-5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50`}
                        >
                            {eventoSeleccionado ? "Guardar cambios" : "Agendar"}
                        </button>
                    </div>
                </form>
            ) : (
                <form
                    onSubmit={handleSubmitMantenimiento}
                    className="flex flex-col gap-2.5"
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-etiqueta text-neutro-900">
                                Seleccionar Extintor
                            </span>
                            <span className="bg-[#1b9e85] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
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
                        {errors?.extintor_id && (
                            <span className="text-red-600 text-[11px]">
                                {errors.extintor_id}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-etiqueta text-neutro-900">
                            Datos del extintor
                        </span>
                        <div className="border border-neutro-300 bg-neutro-50 rounded-lg p-2 text-[11px] md:text-xs text-neutro-600 flex flex-col gap-0.5">
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
                            <select
                                name="tipo"
                                value={formMantenimiento.tipo}
                                onChange={(e) =>
                                    setFormMantenimiento({
                                        ...formMantenimiento,
                                        tipo: e.target.value,
                                    })
                                }
                                className="border border-neutro-300 rounded-md px-3 py-1.5 text-sm text-neutro-900 focus:border-primario-700 focus:ring-0 cursor-pointer"
                            >
                                <option value="" disabled>
                                    Seleccione un tipo
                                </option>
                                <option value="Revisión">Revisión</option>
                                <option value="Relleno de contenido">
                                    Relleno de contenido
                                </option>
                                <option value="Otra">Otra</option>
                            </select>
                            {errors?.tipo && (
                                <span className="text-red-600 text-[11px]">
                                    {errors.tipo}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-etiqueta text-neutro-900">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha_programada"
                                        value={
                                            formMantenimiento.fecha_programada
                                        }
                                        onChange={(e) =>
                                            setFormMantenimiento({
                                                ...formMantenimiento,
                                                fecha_programada:
                                                    e.target.value,
                                            })
                                        }
                                        className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-etiqueta text-neutro-900">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        name="hora_programada"
                                        value={
                                            formMantenimiento.hora_programada
                                        }
                                        onChange={(e) =>
                                            setFormMantenimiento({
                                                ...formMantenimiento,
                                                hora_programada: e.target.value,
                                            })
                                        }
                                        className="border border-neutro-300 rounded-md px-2 py-1.5 text-sm text-center text-neutro-900 focus:border-primario-700 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            {errors?.fecha_programada && (
                                <span className="text-red-600 text-[11px]">
                                    {errors.fecha_programada}
                                </span>
                            )}
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
                            {errors?.descripcion && (
                                <span className="text-red-600 text-[11px]">
                                    {errors.descripcion}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                        {eventoSeleccionado && (
                            <button
                                type="button"
                                disabled={procesando}
                                onClick={handleEliminar}
                                className="w-1/3 bg-white hover:bg-red-50 text-red-600 border border-red-600 text-etiqueta px-3 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={procesando}
                            className={`${
                                eventoSeleccionado ? "w-2/3" : "w-full"
                            } bg-primario-700 hover:bg-primario-900 text-white text-etiqueta py-2 rounded-lg transition cursor-pointer disabled:opacity-50`}
                        >
                            {eventoSeleccionado
                                ? "Guardar cambios"
                                : "Guardar Mantenimiento"}
                        </button>
                    </div>
                </form>
            )}
        </aside>
    );
}
