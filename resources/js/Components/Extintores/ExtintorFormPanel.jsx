import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { ChevronDown, X } from "lucide-react";

const getToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const addOneMonth = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return "";
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const AREAS_EXCLUIDAS = [
    "glorieta",
    "cancha",
    "estacionamiento",
    "estacionamiento de motocicletas",
    "parque vehicular",
    "vigilancia",
];

export default function ExtintorFormPanel({
    selectedExtintor = null,
    tipos = [],
    instalaciones = [],
    capacidades_kg = [],
    capacidades_l = [],
    onClearSelection,
}) {
    const isEditing = Boolean(selectedExtintor);

    const [selectedInstalacionId, setSelectedInstalacionId] = useState("");
    const [selectedPisoId, setSelectedPisoId] = useState("");

    const todayDate = getToday();

    const { data, setData, post, put, patch, processing, errors, clearErrors } =
        useForm({
            tipoextintor_id: "",
            ubicacion_id: "",
            capacidad: "",
            fecha_instalacion: todayDate,
            fecha_vencimiento: addOneMonth(todayDate),
        });

    const tipoSeleccionado = useMemo(() => {
        return tipos.find((t) => String(t.id) === String(data.tipoextintor_id));
    }, [tipos, data.tipoextintor_id]);

    const esLitros = useMemo(() => {
        const u = (tipoSeleccionado?.unidad || "").toLowerCase().trim();
        return u === "l" || u === "litro" || u === "litros";
    }, [tipoSeleccionado]);

    const listaCapacidades = useMemo(() => {
        return esLitros ? capacidades_l : capacidades_kg;
    }, [esLitros, capacidades_l, capacidades_kg]);

    const instalacionesCroquis = useMemo(() => {
        return instalaciones.filter((inst) => {
            const nombre = (inst.nombre || "").trim().toLowerCase();
            if (
                selectedInstalacionId &&
                String(inst.id) === String(selectedInstalacionId)
            ) {
                return true;
            }
            return !AREAS_EXCLUIDAS.includes(nombre);
        });
    }, [instalaciones, selectedInstalacionId]);

    const pisosDisponibles = useMemo(() => {
        if (!selectedInstalacionId) return [];
        const inst = instalaciones.find(
            (i) => String(i.id) === String(selectedInstalacionId),
        );
        return inst?.pisos || [];
    }, [selectedInstalacionId, instalaciones]);

    const ubicacionesDisponibles = useMemo(() => {
        if (!selectedPisoId) return [];
        const piso = pisosDisponibles.find(
            (p) => String(p.id) === String(selectedPisoId),
        );
        return piso?.ubicaciones || [];
    }, [selectedPisoId, pisosDisponibles]);

    useEffect(() => {
        clearErrors();

        if (selectedExtintor) {
            let resolvedTipoId =
                selectedExtintor.tipoextintor_id ||
                selectedExtintor.raw?.tipoextintor_id ||
                "";
            if (!resolvedTipoId && selectedExtintor.tipo) {
                const foundTipo = tipos.find(
                    (t) =>
                        (t.nombre || "").toLowerCase() ===
                        selectedExtintor.tipo.toLowerCase(),
                );
                if (foundTipo) resolvedTipoId = foundTipo.id;
            }

            let resolvedInstalacionId = "";
            let resolvedPisoId = "";
            let resolvedUbicacionId =
                selectedExtintor.ubicacion_id ||
                selectedExtintor.raw?.ubicacion_id ||
                "";

            if (
                selectedExtintor.area_nombre ||
                selectedExtintor.ubicacion_nombre
            ) {
                const areaBusqueda = (
                    selectedExtintor.area_nombre ||
                    selectedExtintor.ubicacion_nombre ||
                    ""
                )
                    .trim()
                    .toLowerCase();
                for (const inst of instalaciones) {
                    for (const p of inst.pisos || []) {
                        for (const ub of p.ubicaciones || []) {
                            const matchId =
                                resolvedUbicacionId &&
                                String(ub.id) === String(resolvedUbicacionId);
                            const matchNombre =
                                ub.nombre &&
                                ub.nombre.trim().toLowerCase() === areaBusqueda;

                            if (matchId || matchNombre) {
                                resolvedInstalacionId = inst.id;
                                resolvedPisoId = p.id;
                                resolvedUbicacionId = ub.id;
                                break;
                            }
                        }
                        if (resolvedUbicacionId && resolvedPisoId) break;
                    }
                    if (resolvedInstalacionId) break;
                }
            }

            setSelectedInstalacionId(
                resolvedInstalacionId ? String(resolvedInstalacionId) : "",
            );
            setSelectedPisoId(resolvedPisoId ? String(resolvedPisoId) : "");

            let capActual = String(
                selectedExtintor.raw?.capacidad ||
                    selectedExtintor.capacidad ||
                    "",
            ).trim();
            const rawFechaInst = selectedExtintor.raw?.fecha_instalacion;
            const fechaInst = rawFechaInst
                ? rawFechaInst.split("T")[0]
                : getToday();

            const rawFechaVenc = selectedExtintor.raw?.fecha_vencimiento;
            const fechaVenc = rawFechaVenc
                ? rawFechaVenc.split("T")[0]
                : addOneMonth(fechaInst);

            setData({
                tipoextintor_id: String(resolvedTipoId),
                ubicacion_id: String(resolvedUbicacionId),
                capacidad: capActual,
                fecha_instalacion: fechaInst,
                fecha_vencimiento: fechaVenc,
            });
        } else {
            const defaultToday = getToday();
            setSelectedInstalacionId("");
            setSelectedPisoId("");
            setData({
                tipoextintor_id: "",
                ubicacion_id: "",
                capacidad: "",
                fecha_instalacion: defaultToday,
                fecha_vencimiento: addOneMonth(defaultToday),
            });
        }
    }, [selectedExtintor, tipos, instalaciones]);

    const handleTipoChange = (e) => {
        setData((prev) => ({
            ...prev,
            tipoextintor_id: e.target.value,
            capacidad: "",
        }));
    };

    const handleFechaInstalacionChange = (e) => {
        const nuevaFechaInst = e.target.value;
        const nuevaFechaVenc = addOneMonth(nuevaFechaInst);
        setData((prev) => ({
            ...prev,
            fecha_instalacion: nuevaFechaInst,
            fecha_vencimiento: nuevaFechaVenc,
        }));
    };

    const handleCancel = () => {
        setSelectedInstalacionId("");
        setSelectedPisoId("");
        clearErrors();
        const defaultToday = getToday();
        setData({
            tipoextintor_id: "",
            ubicacion_id: "",
            capacidad: "",
            fecha_instalacion: defaultToday,
            fecha_vencimiento: addOneMonth(defaultToday),
        });
        if (onClearSelection) onClearSelection();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/extintores/${selectedExtintor.id}`, {
                preserveScroll: true,
                onSuccess: () => handleCancel(),
            });
        } else {
            post("/extintores", {
                preserveScroll: true,
                onSuccess: () => handleCancel(),
            });
        }
    };

    const handleBaja = () => {
        if (!selectedExtintor) return;
        if (
            confirm(
                `¿Confirmas la baja del extintor ${selectedExtintor.codigo}?`,
            )
        ) {
            patch(`/extintores/${selectedExtintor.id}/baja`, {
                preserveScroll: true,
                onSuccess: () => handleCancel(),
            });
        }
    };

    const selectClass =
        "w-full bg-white border border-neutro-100 rounded-lg px-3 py-2 text-neutro-900 [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500 text-xs font-medium pr-8 disabled:bg-neutro-50 disabled:text-neutro-300";

    return (
        <div className="bg-white rounded-xl border border-neutro-100 shadow-sm p-5 overflow-hidden">
            {/* Header del Panel alineado a la izquierda */}
            <div>
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-neutro-900 text-base leading-tight">
                        {isEditing
                            ? `Modificar ${selectedExtintor.codigo}`
                            : "Registrar nuevo extintor"}
                    </h3>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutro-100 bg-neutro-50 hover:bg-primario-100 hover:border-primario-300 hover:text-primario-700 text-[11px] font-semibold text-neutro-600 transition-colors cursor-pointer shrink-0"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancelar</span>
                        </button>
                    )}
                </div>

                <span className="inline-block mt-2 bg-acento-500/15 text-acento-500 text-[11px] font-semibold px-3 py-0.5 rounded-full">
                    {isEditing
                        ? "Modo edición · Extintor seleccionado"
                        : "Modo creación · Sin selección"}
                </span>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
                {/* Tipo */}
                <div>
                    <label className="block font-bold text-neutro-900 mb-1.5">
                        Tipo
                    </label>
                    <div className="relative">
                        <select
                            name="tipoextintor_id"
                            value={data.tipoextintor_id}
                            onChange={handleTipoChange}
                            required
                            className={selectClass}
                        >
                            <option value="">Selecciona un tipo</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-neutro-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Capacidad */}
                <div>
                    <label className="block font-bold text-neutro-900 mb-1.5">
                        Capacidad
                    </label>
                    <div className="relative">
                        <select
                            name="capacidad"
                            value={data.capacidad}
                            onChange={(e) =>
                                setData("capacidad", e.target.value)
                            }
                            disabled={!data.tipoextintor_id}
                            required
                            className={selectClass}
                        >
                            <option value="">
                                {data.tipoextintor_id
                                    ? "Selecciona capacidad"
                                    : "Selecciona un tipo primero"}
                            </option>
                            {listaCapacidades.map((cap) => (
                                <option key={cap} value={cap}>
                                    {cap}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-neutro-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Edificio y Piso */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block font-bold text-neutro-900 mb-1.5">
                            Edificio
                        </label>
                        <div className="relative">
                            <select
                                value={selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedInstalacionId(e.target.value);
                                    setSelectedPisoId("");
                                    setData("ubicacion_id", "");
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">Edificio</option>
                                {instalacionesCroquis.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.nombre}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-neutro-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-neutro-900 mb-1.5">
                            Piso
                        </label>
                        <div className="relative">
                            <select
                                value={selectedPisoId}
                                disabled={!selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedPisoId(e.target.value);
                                    setData("ubicacion_id", "");
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">Piso</option>
                                {pisosDisponibles.map((piso) => (
                                    <option key={piso.id} value={piso.id}>
                                        {piso.nombre}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-neutro-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Ubicación Exacta */}
                <div>
                    <label className="block font-bold text-neutro-900 mb-1.5">
                        Ubicación exacta
                    </label>
                    <div className="relative">
                        <select
                            name="ubicacion_id"
                            value={data.ubicacion_id}
                            disabled={!selectedPisoId}
                            onChange={(e) =>
                                setData("ubicacion_id", e.target.value)
                            }
                            required
                            className={selectClass}
                        >
                            <option value="">Selecciona una ubicación</option>
                            {ubicacionesDisponibles.map((ub) => (
                                <option key={ub.id} value={ub.id}>
                                    {ub.nombre}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-neutro-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block font-bold text-neutro-900 mb-1.5">
                            Fecha de instalación
                        </label>
                        <input
                            type="date"
                            name="fecha_instalacion"
                            value={data.fecha_instalacion}
                            max={todayDate}
                            onChange={handleFechaInstalacionChange}
                            required
                            className="w-full bg-white border border-neutro-100 rounded-lg px-3 py-2 text-neutro-900 text-xs font-medium focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-neutro-900 mb-1.5">
                            Fecha de vencimiento
                        </label>
                        <input
                            type="date"
                            name="fecha_vencimiento"
                            value={data.fecha_vencimiento}
                            readOnly
                            tabIndex={-1}
                            className="w-full bg-neutro-50 border border-neutro-100 rounded-lg px-3 py-2 text-neutro-600 text-xs font-medium cursor-not-allowed select-none focus:outline-none"
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={isEditing ? handleBaja : handleCancel}
                        disabled={processing}
                        className="w-1/2 py-2.5 px-4 bg-white border border-primario-700 text-primario-700 font-bold rounded-xl text-xs hover:bg-primario-100 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isEditing ? "Dar de baja" : "Cancelar"}
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-1/2 py-2.5 px-4 bg-primario-500 hover:bg-primario-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                        {isEditing ? "Guardar cambios" : "Confirmar registro"}
                    </button>
                </div>
            </form>
        </div>
    );
}
