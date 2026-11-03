import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ExtintoresHeader from '@/Components/Extintores/ExtintoresHeader';
import ExtintorFilterPills from '@/Components/Extintores/ExtintorFilterPills';
import ExtintoresTable from '@/Components/Extintores/ExtintoresTable';
import ExtintorFormPanel from '@/Components/Extintores/ExtintorFormPanel';

const ITEMS_PER_PAGE = 5; // Mantiene la altura fija dentro de la pantalla sin scroll

export default function Index(props) {
    const { auth } = usePage().props;

    // Datos recibidos desde ExtintorController
    const extintoresRaw = props.extintores?.data || (Array.isArray(props.extintores) ? props.extintores : []);
    const tipos = props.tipos || [];
    const instalaciones = props.instalaciones || [];
    const capacidades_kg = props.capacidades_kg || ['4.5', '6', '9'];
    const capacidades_l = props.capacidades_l || ['6', '9'];

    // Estados de interacción
    const [selectedExtintor, setSelectedExtintor] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Si el usuario cambia el filtro, regresar a la página 1
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    // Normalización: cruza la ubicación con el árbol de instalaciones
    const normalizedExtintores = useMemo(() => {
        return extintoresRaw.map((ext) => {
            const areaNombre = ext.ubicacion_nombre || ext.area_nombre || '';
            const ubicacionId = ext.ubicacion_id || ext.raw?.ubicacion_id;
            const tipoId = ext.tipoextintor_id || ext.raw?.tipoextintor_id;

            let edificioDetectado = ext.instalacion_nombre || '';
            let pisoDetectado = '';

            if (instalaciones.length > 0 && areaNombre) {
                for (const inst of instalaciones) {
                    for (const p of (inst.pisos || [])) {
                        for (const ub of (p.ubicaciones || [])) {
                            const matchId = ubicacionId && String(ub.id) === String(ubicacionId);
                            const matchNombre = ub.nombre && ub.nombre.trim().toLowerCase() === areaNombre.trim().toLowerCase();

                            if (matchId || matchNombre) {
                                edificioDetectado = inst.nombre || '';
                                pisoDetectado = p.nombre || (p.numero ? `Piso ${p.numero}` : '');
                                break;
                            }
                        }
                        if (pisoDetectado) break;
                    }
                    if (edificioDetectado) break;
                }
            }

            const finalPiso = (ext.piso_numero && !String(ext.piso_numero).includes('N/A'))
                ? `Piso ${ext.piso_numero}`
                : pisoDetectado;

            const finalEdificio = edificioDetectado || '';

            const tipoObj = tipos.find(t => t.id === tipoId);
            const unidad = tipoObj?.unidad === 'l' ? 'L' : 'kg';
            const capacidadLimpia = String(ext.capacidad_raw || ext.capacidad || '').replace(/[^0-9.]/g, '');

            return {
                id: ext.id,
                codigo: ext.etiqueta_inventario || ext.codigo,
                tipo: ext.tipo_nombre || ext.tipo || 'No definido',
                tipoextintor_id: tipoId,
                capacidad: capacidadLimpia ? `${capacidadLimpia} ${unidad}` : 'N/A',
                capacidad_raw: ext.capacidad_raw || ext.capacidad,
                area_nombre: areaNombre,
                ubicacion_id: ubicacionId,
                edificio: finalEdificio,
                piso: finalPiso,
                proximo_mantenimiento: ext.proximo_mantenimiento || 'Sin programar',
                estado: ext.estado ?? ext.estatus ?? 'Disponible',
                raw: ext.raw || ext
            };
        });
    }, [extintoresRaw, instalaciones, tipos]);

    // Filtrado reactivo
    const filteredExtintores = useMemo(() => {
        if (activeFilter === 'Todos') return normalizedExtintores;

        return normalizedExtintores.filter((ext) => {
            const estado = (ext.estado || '').toLowerCase();
            const filtro = activeFilter.toLowerCase();

            if (filtro.includes('dispon') || filtro.includes('vigent')) {
                return estado.includes('vigent') || estado.includes('dispon') || estado.includes('operativ');
            }
            if (filtro.includes('vencer') || filtro.includes('proxim') || filtro.includes('medio')) {
                return estado.includes('por vencer') || estado.includes('vencer') || estado.includes('medio') || estado.includes('mantenim');
            }
            if (filtro.includes('vencid') || filtro.includes('vaci') || filtro.includes('vací')) {
                return estado.includes('vencid') || estado.includes('vac');
            }
            if (filtro.includes('servicio') || filtro.includes('baja')) {
                return estado.includes('baja') || estado.includes('fuera');
            }
            return estado === filtro;
        });
    }, [normalizedExtintores, activeFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredExtintores.length / ITEMS_PER_PAGE) || 1;
    const paginatedExtintores = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExtintores.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredExtintores, currentPage]);

    // Manejadores de eventos
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

    const handleAddNew = () => {
        setSelectedExtintor(null);
        setIsMobileFormOpen(true);
    };

    // Paginación con el nuevo formato
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-neutral-200 sm:px-6 rounded-b-xl shadow-sm mt-1">
                <div className="text-xs text-neutral-500">
                    Página <span className="font-semibold text-neutral-700">{currentPage}</span> de{' '}
                    <span className="font-semibold text-neutral-700">{totalPages}</span>
                </div>

                <div className="inline-flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 text-xs font-semibold rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-[#C0262D] text-white shadow-sm'
                                    : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout auth={auth} user={auth?.user}>
            <Head title="Extintores - SIME" />

            <div className="font-['Manrope'] pb-6">
                {/* 1. Encabezado */}
                <ExtintoresHeader onAddNew={handleAddNew} />

                {/* 2. Barra de píldoras de filtrado */}
                <ExtintorFilterPills
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* 3. Vista móvil */}
                <div className="block md:hidden">
                    {isMobileFormOpen ? (
                        <div>
                            <div className="mb-3">
                                <button
                                    type="button"
                                    onClick={handleClearSelection}
                                    className="text-xs text-[#C0262D] font-bold inline-flex items-center gap-1.5"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Volver a la lista
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
                        <div>
                            <ExtintoresTable
                                extintores={paginatedExtintores}
                                selectedExtintor={selectedExtintor}
                                onSelectExtintor={handleSelectExtintor}
                            />
                            {renderPagination()}
                        </div>
                    )}
                </div>

                {/* 4. Vista escritorio */}
                <div className="hidden md:grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-8">
                        <ExtintoresTable
                            extintores={paginatedExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                        />
                        {renderPagination()}
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