import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Head, usePage, Link, router } from "@inertiajs/react"; // <-- Agregado router
import AdminLayout from "@/Layouts/AdminLayout";
import ExtintoresHeader from "@/Components/Extintores/ExtintoresHeader";
import ExtintorFilterPills from "@/Components/Extintores/ExtintorFilterPills";
import ExtintoresTable from "@/Components/Extintores/ExtintoresTable";
import ExtintorFormPanel from "@/Components/Extintores/ExtintorFormPanel";

export default function Index(props) {
    const { auth, flash } = usePage().props;

    const [flashVisible, setFlashVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashVisible(true);
            const timer = setTimeout(() => {
                setFlashVisible(false);
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Datos paginados recibidos desde ExtintorController
    const extintoresPaginator = props.extintores || {};
    const extintoresRaw = extintoresPaginator.data || (Array.isArray(props.extintores) ? props.extintores : []);
    const tipos = props.tipos || [];
    const instalaciones = props.instalaciones || [];
    const capacidades_kg = props.capacidades_kg || [];
    const capacidades_l = props.capacidades_l || [];

    const [selectedExtintor, setSelectedExtintor] = useState(null);
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

    // El filtro activo viene sincronizado con la URL desde el backend
    const activeFilter = props.filtroActivo || "Todos";

    // Petición al servidor cuando se pulsa una píldora de filtro
    const handleFilterChange = (nuevoFiltro) => {
        router.get(
            route('extintores.index'),
            { filtro: nuevoFiltro },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    // Normalización de ubicaciones
    const normalizedExtintores = useMemo(() => {
        return extintoresRaw.map((ext) => {
            const areaNombre = ext.ubicacion_nombre || ext.area_nombre || "";
            const ubicacionId = ext.ubicacion_id || ext.raw?.ubicacion_id;
            const tipoId = ext.tipoextintor_id || ext.raw?.tipoextintor_id;

            let edificioDetectado = ext.instalacion_nombre || "";
            let pisoDetectado = "";

            if (instalaciones.length > 0 && areaNombre) {
                for (const inst of instalaciones) {
                    for (const p of inst.pisos || []) {
                        for (const ub of p.ubicaciones || []) {
                            const matchId = ubicacionId && String(ub.id) === String(ubicacionId);
                            const matchNombre = ub.nombre && ub.nombre.trim().toLowerCase() === areaNombre.trim().toLowerCase();

                            if (matchId || matchNombre) {
                                edificioDetectado = inst.nombre || "";
                                pisoDetectado = p.nombre || (p.numero ? `Piso ${p.numero}` : "");
                                break;
                            }
                        }
                        if (pisoDetectado) break;
                    }
                    if (edificioDetectado) break;
                }
            }

            const finalPiso = ext.piso_numero && !String(ext.piso_numero).includes("N/A")
                ? `Piso ${ext.piso_numero}`
                : pisoDetectado;

            return {
                id: ext.id,
                codigo: ext.etiqueta_inventario || ext.codigo,
                tipo: ext.tipo_nombre || ext.tipo || "No definido",
                tipoextintor_id: tipoId,
                capacidad: ext.capacidad || ext.raw?.capacidad || "N/A",
                capacidad_raw: ext.capacidad_raw || ext.capacidad,
                area_nombre: areaNombre,
                ubicacion_id: ubicacionId,
                edificio: edificioDetectado || "",
                piso: finalPiso,
                proximo_mantenimiento: ext.proximo_mantenimiento || "Sin programar",
                proxima_revision: ext.proxima_revision || "Sin programar",
                estado: ext.estado ?? ext.estatus ?? "Disponible",
                raw: ext.raw || ext,
            };
        });
    }, [extintoresRaw, instalaciones, tipos]);

    const handleSelectExtintor = (extintor) => {
        setSelectedExtintor(extintor);
        if (extintor) {
            setIsMobileFormOpen(true);
        }
    };

    const handleCloseMobileForm = () => {
        setSelectedExtintor(null);
        setIsMobileFormOpen(false);
    };

    const handleAddNew = () => {
        setSelectedExtintor(null);
        setIsMobileFormOpen(true);
    };

    const renderPagination = () => {
        const { current_page, last_page, prev_page_url, next_page_url, links } = extintoresPaginator;

        if (!last_page || last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#D7D4D4] sm:px-6 rounded-b-2xl shadow-xs mt-1 font-['Manrope']">
                <div className="text-xs text-[#6D6162]">
                    Página <span className="font-semibold text-[#272222]">{current_page}</span> de{" "}
                    <span className="font-semibold text-[#272222]">{last_page}</span>
                </div>

                <div className="inline-flex items-center gap-1">
                    <Link
                        href={prev_page_url || "#"}
                        preserveScroll
                        preserveState
                        as={prev_page_url ? "a" : "span"}
                        className={`p-1.5 rounded-lg border border-[#D7D4D4] text-[#6D6162] transition-colors ${prev_page_url
                            ? "hover:bg-[#F1F0F0] cursor-pointer"
                            : "opacity-40 cursor-not-allowed pointer-events-none"
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Link>

                    {links &&
                        links.slice(1, -1).map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || "#"}
                                preserveScroll
                                preserveState
                                as={link.url ? "a" : "span"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${link.active
                                    ? "bg-[#C0262D] text-white shadow-xs"
                                    : "border border-[#D7D4D4] text-[#272222] hover:bg-[#F1F0F0]"
                                    } ${!link.url ? "opacity-40 pointer-events-none" : "cursor-pointer"}`}
                            />
                        ))}

                    <Link
                        href={next_page_url || "#"}
                        preserveScroll
                        preserveState
                        as={next_page_url ? "a" : "span"}
                        className={`p-1.5 rounded-lg border border-[#D7D4D4] text-[#6D6162] transition-colors ${next_page_url
                            ? "hover:bg-[#F1F0F0] cursor-pointer"
                            : "opacity-40 cursor-not-allowed pointer-events-none"
                            }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout auth={auth} user={auth?.user}>
            <Head title="Extintores - SIME" />

            <div className="w-full max-w-7xl mx-auto space-y-4 pb-6 overflow-x-hidden font-['Manrope']">
                {/* 1. Encabezado */}
                <ExtintoresHeader onAddNew={handleAddNew} />

                {/* 2. Banner de Notificación */}
                {flashVisible && (flash?.success || flash?.error) && (
                    <div
                        className={`flex items-center justify-between p-3.5 rounded-2xl border shadow-xs transition-all duration-300 ${flash?.success
                            ? "bg-[#D6F4F2] border-[#1C9691]/40 text-[#10706B]"
                            : "bg-[#FDEDED] border-[#F9CACB] text-[#C0262D]"
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {flash?.success ? (
                                <CheckCircle2 className="w-4 h-4 text-[#1C9691] shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-[#C0262D] shrink-0" />
                            )}
                            <span className="text-xs font-semibold">{flash.success || flash.error}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFlashVisible(false)}
                            className="p-1 rounded-lg transition-colors hover:bg-black/5"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* 3. Filtros conectados al servidor */}
                <ExtintorFilterPills
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                />

                {/* 4. Vista Móvil */}
                <div className="block md:hidden">
                    {isMobileFormOpen ? (
                        <div>
                            <div className="mb-3">
                                <button
                                    type="button"
                                    onClick={handleCloseMobileForm}
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
                                onClearSelection={handleCloseMobileForm}
                            />
                        </div>
                    ) : (
                        <div>
                            <ExtintoresTable
                                extintores={normalizedExtintores}
                                selectedExtintor={selectedExtintor}
                                onSelectExtintor={handleSelectExtintor}
                            />
                            {renderPagination()}
                        </div>
                    )}
                </div>

                {/* 5. Vista Escritorio */}
                <div className="hidden md:grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-8">
                        <ExtintoresTable
                            extintores={normalizedExtintores}
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
                            onClearSelection={() => setSelectedExtintor(null)}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}