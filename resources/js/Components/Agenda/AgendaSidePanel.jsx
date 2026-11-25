import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

export default function AgendaSidePanel({
    combos = {},
    eventoSeleccionado = null,
    extintorInicial = null,
    onCancelMovil,
    onSuccess,
    onClearSelection,
    tabInicial = "mantenimiento",
}) {
    const { errors } = usePage().props;
    const [activeTab, setActiveTab] = useState(tabInicial);
    const [procesando, setProcesando] = useState(false);
    const [mostrarAvisos, setMostrarAvisos] = useState(false);

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

    const handleCambiarTab = (nuevoTab) => {
        if (nuevoTab === activeTab) return;

        setActiveTab(nuevoTab);

        if (eventoSeleccionado) {
            limpiarFormularios();
            if (onClearSelection) {
                onClearSelection();
            } else if (onSuccess) {
                onSuccess();
            }
        }
    };

    useEffect(() => {
        setMostrarAvisos(false);
    }, [eventoSeleccionado, activeTab]);

    useEffect(() => {
        if (!eventoSeleccionado) {
            setActiveTab(tabInicial);
        }
    }, [tabInicial]);

    useEffect(() => {
        if (!eventoSeleccionado) {
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
    }, [eventoSeleccionado]);

    useEffect(() => {
        if (eventoSeleccionado || !extintorInicial) return;

        const buscado = String(extintorInicial).trim().toLowerCase();
        const encontrado = extintoresMantenimiento.find(
            (ext) =>
                String(ext.id) === buscado ||
                String(ext.etiqueta_inventario || "")
                    .trim()
                    .toLowerCase() === buscado,
        );

        if (encontrado) {
            setActiveTab("mantenimiento");
            setExtintorSeleccionadoId(encontrado.id);
        }
    }, [extintorInicial, eventoSeleccionado, extintoresMantenimiento]);

    const handleCancelarEdicion = () => {
        limpiarFormularios();
        onClearSelection?.();
    };

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

        setMostrarAvisos(true);
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
                        setMostrarAvisos(false);
                        if (onSuccess) onSuccess();
                    },
                    onFinish: () => setProcesando(false),
                },
            );
        } else {
            router.post(route("agenda.mantenimientos.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setMostrarAvisos(false);
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

        setMostrarAvisos(true);
        setProcesando(true);

        if (eventoSeleccionado && eventoSeleccionado.clase === "capacitacion") {
            router.put(
                route("agenda.capacitaciones.update", eventoSeleccionado.id),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMostrarAvisos(false);
                        if (onSuccess) onSuccess();
                    },
                    onFinish: () => setProcesando(false),
                },
            );
        } else {
            router.post(route("agenda.capacitaciones.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setMostrarAvisos(false);
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

        setMostrarAvisos(true);
        setProcesando(true);
        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                setMostrarAvisos(false);
                limpiarFormularios();
                if (onSuccess) onSuccess();
            },
            onFinish: () => setProcesando(false),
        });
    };

    const inputClass =
        "w-full bg-white border border-neutro-100 rounded-lg px-3 py-2 text-xs text-neutro-900 font-medium focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500";

    return (
        <aside className="w-full bg-white border border-neutro-100 rounded-xl p-5 flex flex-col gap-3.5 shadow-sm shrink-0">
            <div>
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-neutro-900 leading-tight">
                        {activeTab === "capacitacion"
                            ? eventoSeleccionado
                                ? "Detalles de Capacitación"
                                : "Nueva Capacitación"
                            : eventoSeleccionado
                              ? "Detalles de Mantenimiento"
                              : "Programar Mantenimiento"}
                    </h2>

                    {eventoSeleccionado && (
                        <button
                            type="button"
                            onClick={handleCancelarEdicion}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutro-100 bg-neutro-50 hover:bg-primario-100 hover:border-primario-300 hover:text-primario-700 text-[11px] font-semibold text-neutro-600 transition-colors cursor-pointer shrink-0"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancelar</span>
                        </button>
                    )}
                </div>

                <span className="inline-block mt-2 bg-acento-500/15 text-acento-500 text-[11px] font-semibold px-3 py-0.5 rounded-full">
                    {eventoSeleccionado
                        ? "Modo edición · Evento seleccionado"
                        : "Modo creación · Sin selección"}
                </span>
            </div>

            <div className="flex bg-neutro-50 border border-neutro-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => handleCambiarTab("mantenimiento")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                        activeTab === "mantenimiento"
                            ? "bg-white text-neutro-900 shadow-xs"
                            : "text-neutro-600 hover:text-neutro-900"
                    }`}
                >
                    Mantenimiento
                </button>

                <button
                    type="button"
                    onClick={() => handleCambiarTab("capacitacion")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                        activeTab === "capacitacion"
                            ? "bg-white text-neutro-900 shadow-xs"
                            : "text-neutro-600 hover:text-neutro-900"
                    }`}
                >
                    Capacitación
                </button>
            </div>

            {activeTab === "capacitacion" ? (
                <form
                    onSubmit={handleSubmitCapacitacion}
                    className="flex flex-col gap-3 text-xs"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-neutro-900">
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
                            className={inputClass}
                        />
                        {mostrarAvisos && errors?.nombre && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.nombre}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-neutro-900">
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
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-neutro-900">
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
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        {mostrarAvisos && errors?.fecha_hora && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.fecha_hora}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-neutro-900">
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
                                className={inputClass}
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
                                className={inputClass}
                            />
                        )}
                        {mostrarAvisos && errors?.ubicacion_id && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.ubicacion_id}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-neutro-600 uppercase tracking-wider">
                            Extintores para la práctica
                        </span>

                        <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5 p-2.5 bg-neutro-50 border border-neutro-100 rounded-lg">
                            {extintoresCapacitacion.map((extintor) => (
                                <label
                                    key={extintor.id}
                                    className="flex items-center gap-2 text-xs text-neutro-900 cursor-pointer"
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
                                        className="rounded border-neutro-300 text-primario-500 focus:ring-primario-500 cursor-pointer"
                                    />
                                    <span className="font-mono text-[11px]">
                                        {extintor.etiqueta_inventario}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {mostrarAvisos && errors?.extintores_id && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.extintores_id}
                            </span>
                        )}
                    </div>

                    <div className="pt-1 flex gap-2.5">
                        {eventoSeleccionado && (
                            <button
                                type="button"
                                disabled={procesando}
                                onClick={handleEliminar}
                                className="w-1/3 bg-white hover:bg-primario-100 text-primario-700 border border-primario-700 text-xs font-bold px-3 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={procesando}
                            className={`${
                                eventoSeleccionado ? "w-2/3" : "w-full"
                            } bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50`}
                        >
                            {eventoSeleccionado ? "Guardar cambios" : "Agendar"}
                        </button>
                    </div>
                </form>
            ) : (
                <form
                    onSubmit={handleSubmitMantenimiento}
                    className="flex flex-col gap-3 text-xs"
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <label className="font-bold text-neutro-900">
                                Seleccionar extintor
                            </label>
                            <span className="bg-acento-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {extintorSeleccionado?.estatus || "Pendiente"}
                            </span>
                        </div>

                        <select
                            name="extintor_id"
                            value={extintorSeleccionadoId}
                            onChange={(e) =>
                                setExtintorSeleccionadoId(e.target.value)
                            }
                            className={`${inputClass} cursor-pointer`}
                        >
                            {extintoresMantenimiento.map((ext) => (
                                <option key={ext.id} value={ext.id}>
                                    {ext.etiqueta_inventario}
                                </option>
                            ))}
                        </select>
                        {mostrarAvisos && errors?.extintor_id && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.extintor_id}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-neutro-900">
                            Datos del extintor
                        </span>
                        <div className="border border-neutro-100 bg-neutro-50 rounded-lg px-3 py-2 text-[11px] text-neutro-600 flex flex-col gap-0.5">
                            <span className="font-semibold text-neutro-900">
                                {textoUbicacion}
                            </span>
                            <span>Tipo: {textoTipo}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-neutro-900">
                            Tipo de servicio
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
                            className={`${inputClass} cursor-pointer`}
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
                        {mostrarAvisos && errors?.tipo && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.tipo}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-neutro-900">
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
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-neutro-900">
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
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>
                        </div>
                        {mostrarAvisos && errors?.fecha_programada && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.fecha_programada}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-neutro-900">
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
                            className={`${inputClass} resize-none`}
                        />
                        {mostrarAvisos && errors?.descripcion && (
                            <span className="text-primario-700 text-[11px]">
                                {errors.descripcion}
                            </span>
                        )}
                    </div>

                    <div className="pt-1 flex gap-2.5">
                        {eventoSeleccionado && (
                            <button
                                type="button"
                                disabled={procesando}
                                onClick={handleEliminar}
                                className="w-1/3 bg-white hover:bg-primario-100 text-primario-700 border border-primario-700 text-xs font-bold px-3 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={procesando}
                            className={`${
                                eventoSeleccionado ? "w-2/3" : "w-full"
                            } bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50`}
                        >
                            {eventoSeleccionado
                                ? "Guardar cambios"
                                : "Guardar mantenimiento"}
                        </button>
                    </div>
                </form>
            )}
        </aside>
    );
}
