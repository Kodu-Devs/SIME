import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const getToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const addOneMonth = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return '';
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function ExtintorFormPanel({
    selectedExtintor = null,
    tipos = [],
    instalaciones = [],
    capacidades_kg = [],
    capacidades_l = [],
    onClearSelection
}) {
    const isEditing = Boolean(selectedExtintor);

    const [selectedInstalacionId, setSelectedInstalacionId] = useState('');
    const [selectedPisoId, setSelectedPisoId] = useState('');

    const todayDate = getToday();

    const { data, setData, post, put, patch, processing, errors, clearErrors } = useForm({
        tipoextintor_id: '',
        ubicacion_id: '',
        capacidad: '',
        fecha_instalacion: todayDate,
        fecha_vencimiento: addOneMonth(todayDate),
    });

    const tipoSeleccionado = useMemo(() => {
        return tipos.find((t) => String(t.id) === String(data.tipoextintor_id));
    }, [tipos, data.tipoextintor_id]);

    const esLitros = useMemo(() => {
        const u = (tipoSeleccionado?.unidad || '').toLowerCase().trim();
        return u === 'l' || u === 'litro' || u === 'litros';
    }, [tipoSeleccionado]);

    const listaCapacidades = useMemo(() => {
        return esLitros ? capacidades_l : capacidades_kg;
    }, [esLitros, capacidades_l, capacidades_kg]);

    const pisosDisponibles = useMemo(() => {
        if (!selectedInstalacionId) return [];
        const inst = instalaciones.find((i) => String(i.id) === String(selectedInstalacionId));
        return inst?.pisos || [];
    }, [selectedInstalacionId, instalaciones]);

    const ubicacionesDisponibles = useMemo(() => {
        if (!selectedPisoId) return [];
        const piso = pisosDisponibles.find((p) => String(p.id) === String(selectedPisoId));
        return piso?.ubicaciones || [];
    }, [selectedPisoId, pisosDisponibles]);

    useEffect(() => {
        clearErrors();

        if (selectedExtintor) {
            let resolvedTipoId = selectedExtintor.tipoextintor_id || selectedExtintor.raw?.tipoextintor_id || '';
            if (!resolvedTipoId && selectedExtintor.tipo) {
                const foundTipo = tipos.find(t =>
                    (t.nombre || '').toLowerCase() === selectedExtintor.tipo.toLowerCase()
                );
                if (foundTipo) resolvedTipoId = foundTipo.id;
            }

            let resolvedInstalacionId = '';
            let resolvedPisoId = '';
            let resolvedUbicacionId = selectedExtintor.ubicacion_id || selectedExtintor.raw?.ubicacion_id || '';

            if (selectedExtintor.area_nombre || selectedExtintor.ubicacion_nombre) {
                const areaBusqueda = (selectedExtintor.area_nombre || selectedExtintor.ubicacion_nombre || '').trim().toLowerCase();
                for (const inst of instalaciones) {
                    for (const p of (inst.pisos || [])) {
                        for (const ub of (p.ubicaciones || [])) {
                            const matchId = resolvedUbicacionId && String(ub.id) === String(resolvedUbicacionId);
                            const matchNombre = ub.nombre && ub.nombre.trim().toLowerCase() === areaBusqueda;

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

            setSelectedInstalacionId(resolvedInstalacionId ? String(resolvedInstalacionId) : '');
            setSelectedPisoId(resolvedPisoId ? String(resolvedPisoId) : '');

            let capActual = String(selectedExtintor.raw?.capacidad || selectedExtintor.capacidad || '').trim();
            const rawFechaInst = selectedExtintor.raw?.fecha_instalacion;
            const fechaInst = rawFechaInst ? rawFechaInst.split('T')[0] : getToday();

            const rawFechaVenc = selectedExtintor.raw?.fecha_vencimiento;
            const fechaVenc = rawFechaVenc ? rawFechaVenc.split('T')[0] : addOneMonth(fechaInst);

            setData({
                tipoextintor_id: String(resolvedTipoId),
                ubicacion_id: String(resolvedUbicacionId),
                capacidad: capActual,
                fecha_instalacion: fechaInst,
                fecha_vencimiento: fechaVenc,
            });
        } else {
            const defaultToday = getToday();
            setSelectedInstalacionId('');
            setSelectedPisoId('');
            setData({
                tipoextintor_id: '',
                ubicacion_id: '',
                capacidad: '',
                fecha_instalacion: defaultToday,
                fecha_vencimiento: addOneMonth(defaultToday),
            });
        }
    }, [selectedExtintor, tipos, instalaciones]);

    const handleTipoChange = (e) => {
        setData((prev) => ({
            ...prev,
            tipoextintor_id: e.target.value,
            capacidad: '',
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
        setSelectedInstalacionId('');
        setSelectedPisoId('');
        clearErrors();
        const defaultToday = getToday();
        setData({
            tipoextintor_id: '',
            ubicacion_id: '',
            capacidad: '',
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
            post('/extintores', {
                preserveScroll: true,
                onSuccess: () => handleCancel(),
            });
        }
    };

    const handleBaja = () => {
        if (!selectedExtintor) return;
        if (confirm(`¿Confirmas la baja del extintor ${selectedExtintor.codigo}?`)) {
            patch(`/extintores/${selectedExtintor.id}/baja`, {
                preserveScroll: true,
                onSuccess: () => handleCancel(),
            });
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-[#D7D4D4] p-6 shadow-xs font-['Manrope'] overflow-hidden">
            {/* Header del Panel */}
            <div className="text-center">
                <h3 className="font-bold text-[#272222] text-[15px]">
                    {isEditing ? `Modificar ${selectedExtintor.codigo}` : 'Registro de un nuevo extintor'}
                </h3>
                <div className="mt-2 flex justify-center">
                    <span className="inline-block bg-[#D6F4F2] text-[#1C9691] text-[11px] font-semibold px-4 py-1 rounded-full">
                        {isEditing
                            ? 'Modo de edición - hay un extintor seleccionado'
                            : 'Modo de creación - no hay extintor seleccionado'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                {/* Tipo */}
                <div>
                    <label className="block font-bold text-[#272222] mb-1.5">Tipo</label>
                    <div className="relative">
                        <select
                            name="tipoextintor_id"
                            value={data.tipoextintor_id}
                            onChange={handleTipoChange}
                            required
                            className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-hidden focus:border-[#C0262D] text-xs font-medium pr-9"
                        >
                            <option value="">[ Tipo ]</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-[#928586] absolute right-3 top-3 pointer-events-none" />
                    </div>
                </div>

                {/* Capacidad */}
                <div>
                    <label className="block font-bold text-[#272222] mb-1.5">Capacidad</label>
                    <div className="relative">
                        <select
                            name="capacidad"
                            value={data.capacidad}
                            onChange={(e) => setData('capacidad', e.target.value)}
                            disabled={!data.tipoextintor_id}
                            required
                            className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-hidden focus:border-[#C0262D] text-xs font-medium pr-9 disabled:bg-[#D7D4D4]/30"
                        >
                            <option value="">
                                {data.tipoextintor_id ? '[ Capacidad ]' : 'Selecciona un tipo primero'}
                            </option>
                            {listaCapacidades.map((cap) => (
                                <option key={cap} value={cap}>
                                    {cap}
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-[#928586] absolute right-3 top-3 pointer-events-none" />
                    </div>
                </div>

                {/* Edificio y Piso */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block font-bold text-[#272222] mb-1.5">Edificio</label>
                        <div className="relative">
                            <select
                                value={selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedInstalacionId(e.target.value);
                                    setSelectedPisoId('');
                                    setData('ubicacion_id', '');
                                }}
                                required
                                className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-hidden focus:border-[#C0262D] text-xs font-medium pr-9"
                            >
                                <option value="">[ Edificio ]</option>
                                {instalaciones.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.nombre}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="w-4 h-4 text-[#928586] absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-[#272222] mb-1.5">Piso</label>
                        <div className="relative">
                            <select
                                value={selectedPisoId}
                                disabled={!selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedPisoId(e.target.value);
                                    setData('ubicacion_id', '');
                                }}
                                required
                                className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-hidden focus:border-[#C0262D] text-xs font-medium pr-9 disabled:bg-[#D7D4D4]/30"
                            >
                                <option value="">[ Piso ]</option>
                                {pisosDisponibles.map((piso) => (
                                    <option key={piso.id} value={piso.id}>
                                        {piso.nombre}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="w-4 h-4 text-[#928586] absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Ubicación Exacta */}
                <div>
                    <label className="block font-bold text-[#272222] mb-1.5">Ubicación Exacta</label>
                    <div className="relative">
                        <select
                            name="ubicacion_id"
                            value={data.ubicacion_id}
                            disabled={!selectedPisoId}
                            onChange={(e) => setData('ubicacion_id', e.target.value)}
                            required
                            className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] bg-none focus:outline-hidden focus:border-[#C0262D] text-xs font-medium pr-9 disabled:bg-[#D7D4D4]/30"
                        >
                            <option value="">[ Selecciona Ubicación ]</option>
                            {ubicacionesDisponibles.map((ub) => (
                                <option key={ub.id} value={ub.id}>
                                    {ub.nombre}
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-[#928586] absolute right-3 top-3 pointer-events-none" />
                    </div>
                </div>

                {/* Fechas: Instalación y Vencimiento */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block font-bold text-[#272222] mb-1.5">Fecha de instalación</label>
                        <input
                            type="date"
                            name="fecha_instalacion"
                            value={data.fecha_instalacion}
                            max={todayDate}
                            onChange={handleFechaInstalacionChange}
                            required
                            className="w-full bg-[#F1F0F0]/60 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#272222] text-xs font-medium focus:outline-hidden focus:border-[#C0262D]"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-[#272222] mb-1.5">Fecha de vencimiento</label>
                        <input
                            type="date"
                            name="fecha_vencimiento"
                            value={data.fecha_vencimiento}
                            readOnly
                            tabIndex={-1}
                            className="w-full bg-[#D7D4D4]/40 border border-[#D7D4D4] rounded-xl px-3.5 py-2.5 text-[#6D6162] text-xs font-medium cursor-not-allowed select-none focus:outline-hidden"
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={isEditing ? handleBaja : handleCancel}
                        disabled={processing}
                        className="w-1/2 py-2.5 px-4 bg-white border border-[#C0262D] text-[#C0262D] font-bold rounded-xl text-xs hover:bg-[#FDEDED] transition-colors disabled:opacity-50"
                    >
                        {isEditing ? 'Dar de baja' : 'Cancelar'}
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-1/2 py-2.5 px-4 bg-[#F24C52] text-white font-bold rounded-xl text-xs hover:bg-[#C0262D] transition-colors shadow-xs disabled:opacity-50"
                    >
                        {isEditing ? 'Guardar cambios' : 'Confirmar registro'}
                    </button>
                </div>
            </form>
        </div>
    );
}