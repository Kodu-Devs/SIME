import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ExtintoresHeader from '@/Components/Extintores/ExtintoresHeader';
import ExtintorFilterPills from '@/Components/Extintores/ExtintorFilterPills';
import ExtintoresTable from '@/Components/Extintores/ExtintoresTable';
import ExtintorFormPanel from '@/Components/Extintores/ExtintorFormPanel';

export default function Index(props) {
    // Sesión obtenida mediante usePage de Inertia
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

    // Normalización: cruza la ubicación con el árbol de instalaciones para resolver Edificio y Piso reales
    const normalizedExtintores = useMemo(() => {
        return extintoresRaw.map((ext) => {
            const areaNombre = ext.ubicacion_nombre || ext.area_nombre || '';
            const ubicacionId = ext.ubicacion_id || ext.raw?.ubicacion_id;

            let edificioDetectado = ext.instalacion_nombre || '';
            let pisoDetectado = '';

            // Búsqueda en el árbol de instalaciones
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

            // Evitar que se muestre "Piso N/A" 
            const finalPiso = (ext.piso_numero && !String(ext.piso_numero).includes('N/A'))
                ? `Piso ${ext.piso_numero}`
                : pisoDetectado;

            const finalEdificio = edificioDetectado || '';

            return {
                id: ext.id,
                codigo: ext.etiqueta_inventario,
                tipo: ext.tipo_nombre,
                tipoextintor_id: ext.tipoextintor_id,
                capacidad: `${String(ext.capacidad).replace(/[^0-9.]/g, '')} kg`,
                capacidad_raw: ext.capacidad,
                area_nombre: areaNombre,
                edificio: finalEdificio,
                piso: finalPiso,
                proximo_mantenimiento: ext.proximo_mantenimiento || 'Sin programar',
                estado: ext.estado || ext.estatus || 'Disponible',
                raw: ext
            };
        });
    }, [extintoresRaw, instalaciones]);

    // Filtrado reactivo alineado a las reglas del backend (Vigente, Por vencer, Vencido)
    const filteredExtintores = useMemo(() => {
        if (activeFilter === 'Todos') return normalizedExtintores;

        return normalizedExtintores.filter((ext) => {
            const estado = (ext.estado || '').toLowerCase();
            const filtro = activeFilter.toLowerCase();

            // Vigentes / Disponibles
            if (filtro.includes('dispon') || filtro.includes('vigent')) {
                return estado.includes('vigent') || estado.includes('dispon') || estado.includes('operativ');
            }

            // Por vencer / Próximos / Medio uso
            if (filtro.includes('vencer') || filtro.includes('proxim') || filtro.includes('medio')) {
                return estado.includes('por vencer') || estado.includes('vencer') || estado.includes('medio') || estado.includes('mantenim');
            }

            // Vencidos / Vacíos
            if (filtro.includes('vencid') || filtro.includes('vaci') || filtro.includes('vací')) {
                return estado.includes('vencid') || estado.includes('vac');
            }

            // Fuera de servicio / Baja
            if (filtro.includes('servicio') || filtro.includes('baja')) {
                return estado.includes('baja') || estado.includes('fuera');
            }

            return estado === filtro;
        });
    }, [normalizedExtintores, activeFilter]);

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

    return (
        <AdminLayout auth={auth} user={auth?.user}>
            <Head title="Extintores - SIME" />

            <div className="font-['Manrope'] pb-12">
                {/* 1. Encabezado del módulo */}
                <ExtintoresHeader onAddNew={handleAddNew} />

                {/* 2. Barra de píldoras de filtrado */}
                <ExtintorFilterPills
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* 3. VISTA MÓVIL (Tarjetas o Formulario) */}
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
                        <ExtintoresTable
                            extintores={filteredExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                        />
                    )}
                </div>

                {/* 4. VISTA ESCRITORIO (Tabla a 8 columnas y Formulario a 4 columnas) */}
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