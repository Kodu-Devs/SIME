import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';

export default function ExtintorFormPanel({
    selectedExtintor = null,
    tipos = [],
    instalaciones = [],
    capacidades_kg = ['4.5', '6', '9'],
    capacidades_l = ['6', '9'],
    onClearSelection
}) {
    const isEditing = Boolean(selectedExtintor);

    // Selección en cascada: Instalación -> Piso -> Ubicación
    const [selectedInstalacionId, setSelectedInstalacionId] = useState('');
    const [selectedPisoId, setSelectedPisoId] = useState('');

    const { data, setData, post, put, patch, processing, reset, errors, clearErrors } = useForm({
        tipoextintor_id: '',
        ubicacion_id: '',
        capacidad: '',
        fecha_instalacion: new Date().toISOString().split('T')[0],
        fecha_vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    });

    // Pisos de la instalación seleccionada
    const pisosDisponibles = useMemo(() => {
        if (!selectedInstalacionId) return [];
        const inst = instalaciones.find((i) => i.id == selectedInstalacionId);
        return inst?.pisos || [];
    }, [selectedInstalacionId, instalaciones]);

    // Ubicaciones del piso seleccionado
    const ubicacionesDisponibles = useMemo(() => {
        if (!selectedPisoId) return [];
        const piso = pisosDisponibles.find((p) => p.id == selectedPisoId);
        return piso?.ubicaciones || [];
    }, [selectedPisoId, pisosDisponibles]);

    // Lista de capacidades según la unidad del tipo
    const listaCapacidades = useMemo(() => {
        const tipo = tipos.find((t) => t.id == data.tipoextintor_id);
        return (tipo && tipo.unidad === 'l') ? capacidades_l : capacidades_kg;
    }, [data.tipoextintor_id, tipos, capacidades_kg, capacidades_l]);

    useEffect(() => {
        clearErrors();
        if (selectedExtintor) {
            setData({
                tipoextintor_id: selectedExtintor.raw?.tipoextintor_id || selectedExtintor.tipoextintor_id || '',
                ubicacion_id: selectedExtintor.raw?.ubicacion_id || '',
                capacidad: selectedExtintor.capacidad_raw || '',
                fecha_instalacion: selectedExtintor.raw?.fecha_instalacion || new Date().toISOString().split('T')[0],
                fecha_vencimiento: selectedExtintor.raw?.fecha_vencimiento || '',
            });
        } else {
            reset();
            setSelectedInstalacionId('');
            setSelectedPisoId('');
        }
    }, [selectedExtintor]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/extintores/${selectedExtintor.id}`, {
                preserveScroll: true,
                onSuccess: () => onClearSelection(),
            });
        } else {
            post('/extintores', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClearSelection();
                },
            });
        }
    };

    const handleBaja = () => {
        if (!selectedExtintor) return;
        if (confirm(`¿Confirmas la baja del extintor ${selectedExtintor.codigo}?`)) {
            patch(`/extintores/${selectedExtintor.id}/baja`, {
                preserveScroll: true,
                onSuccess: () => onClearSelection(),
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm font-['Manrope']">
            {/* Encabezado */}
            <div className="text-center">
                <h3 className="font-bold text-neutral-900 text-base md:text-[15px]">
                    {isEditing ? `Modificar ${selectedExtintor.codigo}` : 'Registro de un nuevo extintor'}
                </h3>
                <div className="mt-2 flex justify-center">
                    <span className="inline-block bg-[#D3F5F2] text-[#127F79] text-xs md:text-[11px] font-medium px-3.5 py-1 rounded-full">
                        {isEditing
                            ? 'Modo de edición - hay un extintor seleccionado'
                            : 'Modo de creación - no hay extintor seleccionado'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
                {/* Tipo de Extintor */}
                <div>
                    <label className="block font-bold text-neutral-800 mb-1">Tipo</label>
                    <div className="relative">
                        <select
                            name="tipoextintor_id"
                            value={data.tipoextintor_id}
                            onChange={(e) => setData('tipoextintor_id', e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 appearance-none focus:outline-none focus:border-[#C0262D] text-xs font-medium pr-8"
                        >
                            <option value="">[ Tipo ]</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3.5 top-2.5 text-neutral-400 pointer-events-none text-xs">&gt;</span>
                    </div>
                    {errors.tipoextintor_id && (
                        <span className="text-[11px] text-red-500 mt-0.5 block">{errors.tipoextintor_id}</span>
                    )}
                </div>

                {/* Capacidad */}
                <div>
                    <label className="block font-bold text-neutral-800 mb-1">Capacidad</label>
                    <div className="relative">
                        <select
                            name="capacidad"
                            value={data.capacidad}
                            onChange={(e) => setData('capacidad', e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 appearance-none focus:outline-none focus:border-[#C0262D] text-xs font-medium pr-8"
                        >
                            <option value="">[ Capacidad ]</option>
                            {listaCapacidades.map((cap) => (
                                <option key={cap} value={cap}>
                                    {cap} kg/l
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3.5 top-2.5 text-neutral-400 pointer-events-none text-xs">&gt;</span>
                    </div>
                    {errors.capacidad && (
                        <span className="text-[11px] text-red-500 mt-0.5 block">{errors.capacidad}</span>
                    )}
                </div>

                {/* Edificio y Piso (Cascada) */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block font-bold text-neutral-800 mb-1">Edificio</label>
                        <div className="relative">
                            <select
                                value={selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedInstalacionId(e.target.value);
                                    setSelectedPisoId('');
                                    setData('ubicacion_id', '');
                                }}
                                className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 appearance-none focus:outline-none focus:border-[#C0262D] text-xs font-medium pr-8"
                            >
                                <option value="">[ Edificio ]</option>
                                {instalaciones.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.nombre}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-3.5 top-2.5 text-neutral-400 pointer-events-none text-xs">&gt;</span>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-neutral-800 mb-1">Piso</label>
                        <div className="relative">
                            <select
                                value={selectedPisoId}
                                disabled={!selectedInstalacionId}
                                onChange={(e) => {
                                    setSelectedPisoId(e.target.value);
                                    setData('ubicacion_id', '');
                                }}
                                className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 appearance-none focus:outline-none focus:border-[#C0262D] text-xs font-medium pr-8 disabled:bg-neutral-100"
                            >
                                <option value="">[ Piso ]</option>
                                {pisosDisponibles.map((piso) => (
                                    <option key={piso.id} value={piso.id}>
                                        {piso.nombre}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-3.5 top-2.5 text-neutral-400 pointer-events-none text-xs">&gt;</span>
                        </div>
                    </div>
                </div>

                {/* Ubicación Exacta */}
                <div>
                    <label className="block font-bold text-neutral-800 mb-1">Ubicación Exacta</label>
                    <div className="relative">
                        <select
                            name="ubicacion_id"
                            value={data.ubicacion_id}
                            disabled={!selectedPisoId}
                            onChange={(e) => setData('ubicacion_id', e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 appearance-none focus:outline-none focus:border-[#C0262D] text-xs font-medium pr-8 disabled:bg-neutral-100"
                        >
                            <option value="">[ Selecciona Ubicación ]</option>
                            {ubicacionesDisponibles.map((ub) => (
                                <option key={ub.id} value={ub.id}>
                                    {ub.nombre}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3.5 top-2.5 text-neutral-400 pointer-events-none text-xs">&gt;</span>
                    </div>
                    {errors.ubicacion_id && (
                        <span className="text-[11px] text-red-500 mt-0.5 block">{errors.ubicacion_id}</span>
                    )}
                </div>

                {/* Inputs de Fechas Autorizados */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                        <label className="block font-bold text-neutral-800 mb-1">Fecha Instalación</label>
                        <input
                            type="date"
                            name="fecha_instalacion"
                            value={data.fecha_instalacion}
                            onChange={(e) => setData('fecha_instalacion', e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 text-xs font-medium focus:outline-none focus:border-[#C0262D]"
                        />
                        {errors.fecha_instalacion && (
                            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.fecha_instalacion}</span>
                        )}
                    </div>
                    <div>
                        <label className="block font-bold text-neutral-800 mb-1">Fecha Vencimiento</label>
                        <input
                            type="date"
                            name="fecha_vencimiento"
                            value={data.fecha_vencimiento}
                            onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                            className="w-full bg-white border border-neutral-300 rounded-xl md:rounded-lg px-3 py-2 text-neutral-700 text-xs font-medium focus:outline-none focus:border-[#C0262D]"
                        />
                        {errors.fecha_vencimiento && (
                            <span className="text-[10px] text-red-500 mt-0.5 block">{errors.fecha_vencimiento}</span>
                        )}
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={isEditing ? handleBaja : onClearSelection}
                        disabled={processing}
                        className="w-1/2 py-2.5 px-3 border border-[#C0262D] text-[#C0262D] font-bold rounded-xl md:rounded-lg text-xs hover:bg-[#FDEDED] transition-colors disabled:opacity-50"
                    >
                        {isEditing ? 'Dar de baja' : 'Cancelar'}
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-1/2 py-2.5 px-3 bg-[#8C1823] text-white font-bold rounded-xl md:rounded-lg text-xs hover:bg-[#73121B] transition-colors disabled:opacity-50"
                    >
                        {isEditing ? 'Guardar cambios' : 'Confirmar registro'}
                    </button>
                </div>
            </form>
        </div>
    );
}