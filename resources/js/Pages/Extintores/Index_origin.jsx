
import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ExtintoresTable from '@/Components/Extintores/ExtintoresTable';
import ExtintorFormPanel from '@/Components/Extintores/ExtintorFormPanel';

export default function Index(props) {
    const auth = props.auth || { user: { name: 'Administrador', email: 'admin@tecnm.mx' } };

    // Si viene paginado por Laravel (paginate(10)), los datos están en .data
    const extintoresRaw = props.extintores?.data || (Array.isArray(props.extintores) ? props.extintores : []);
    const tipos = props.tipos || [];
    const instalaciones = props.instalaciones || [];
    const capacidades_kg = props.capacidades_kg || ['4.5', '6', '9'];
    const capacidades_l = props.capacidades_l || ['6', '9'];

    const [selectedExtintor, setSelectedExtintor] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

    const filterOptions = [
        { name: 'Todos', dot: null },
        { name: 'Disponibles', dot: 'bg-[#1C9691]' },
        { name: 'Medio uso', dot: 'bg-[#F2994A]' },
        { name: 'Vacíos', dot: 'bg-[#C0262D]' },
        { name: 'Fuera de servicio', dot: 'bg-neutral-800' }
    ];

    // Mapeo exacto de los campos que retorna el controlador
    const normalizedExtintores = useMemo(() => {
        return extintoresRaw.map((ext) => ({
            id: ext.id,
            codigo: ext.etiqueta_inventario,
            tipo: ext.tipo_nombre,
            tipoextintor_id: ext.tipoextintor_id,
            capacidad: `${ext.capacidad} kg`,
            capacidad_raw: ext.capacidad,
            area_nombre: ext.ubicacion_nombre,
            edificio: ext.instalacion_nombre || '',
            piso: ext.piso_numero ? `Piso ${ext.piso_numero}` : '',
            proximo_mantenimiento: ext.proximo_mantenimiento,
            estado: ext.estatus || 'Disponible',
            raw: ext
        }));
    }, [extintoresRaw]);

    // Filtrado de píldoras
    const filteredExtintores = useMemo(() => {
        if (activeFilter === 'Todos') return normalizedExtintores;

        return normalizedExtintores.filter((ext) => {
            const estado = (ext.estado || '').toLowerCase();
            if (activeFilter === 'Disponibles') {
                return estado.includes('dispon') || estado.includes('operativ');
            }
            if (activeFilter === 'Medio uso') {
                return estado.includes('medio') || estado.includes('mantenim');
            }
            if (activeFilter === 'Vacíos') {
                return estado.includes('vac') || estado.includes('vencid');
            }
            if (activeFilter === 'Fuera de servicio') {
                return estado.includes('baja') || estado.includes('fuera');
            }
            return estado === activeFilter.toLowerCase();
        });
    }, [normalizedExtintores, activeFilter]);

    const handleSelectExtintor = (extintor) => {
        setSelectedExtintor(extintor);
        if (extintor) {
            setIsMobileFormOpen(true);
        }
    };

    const handleClearSelection = () => {
        setSelectedExtintor(null);
        setIsMobileFormOpen(false);
    };

    return (
        <AdminLayout auth={auth} user={auth?.user}>
            <Head title="Extintores - SIME" />

            <div className="font-['Manrope'] pb-12">
                <div className="mb-4">
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Extintores</h1>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">Inventario completo</p>
                </div>

                {/* Filtros Píldoras responsivas */}
                <div className="flex items-center justify-between gap-1 sm:gap-2 w-full mb-5">
                    {filterOptions.map((filter) => {
                        const isActive = activeFilter === filter.name;
                        return (
                            <button
                                key={filter.name}
                                type="button"
                                onClick={() => setActiveFilter(filter.name)}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-all text-center ${isActive
                                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                                    }`}
                            >
                                {filter.dot && (
                                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${filter.dot}`} />
                                )}
                                <span className="truncate">{filter.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Botón Añadir Móvil */}
                <div className="flex md:hidden justify-end mb-3">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedExtintor(null);
                            setIsMobileFormOpen(true);
                        }}
                        className="bg-[#8C1823] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-[#73121B] transition-colors"
                    >
                        + Añadir
                    </button>
                </div>

                {/* Vista Móvil */}
                <div className="block md:hidden">
                    {isMobileFormOpen ? (
                        <div>
                            <div className="mb-3">
                                <button
                                    type="button"
                                    onClick={handleClearSelection}
                                    className="text-xs text-[#C0262D] font-bold flex items-center gap-1"
                                >
                                    ← Volver a la lista
                                </button>
                            </div>
                            <ExtintorFormPanel
                                selectedExtintor={selectedExtintor}
                                tipos={tipos}
                                instalaciones={instalaciones}
                                capacidades_kg={capacidades_kg}
                                capacidades_l={capacidades_l}
                                onClearSelection={handleClearSelection}
                            />
                        </div>
                    ) : (
                        <ExtintoresTable
                            extintores={filteredExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                        />
                    )}
                </div>

                {/* Vista Escritorio */}
                <div className="hidden md:grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-8">
                        <ExtintoresTable
                            extintores={filteredExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                        />
                    </div>
                    <div className="col-span-4 sticky top-6">
                        <ExtintorFormPanel
                            selectedExtintor={selectedExtintor}
                            tipos={tipos}
                            instalaciones={instalaciones}
                            capacidades_kg={capacidades_kg}
                            capacidades_l={capacidades_l}
                            onClearSelection={handleClearSelection}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
