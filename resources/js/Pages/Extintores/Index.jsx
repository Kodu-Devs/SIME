import React, { useState, useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import FlashBanner from "@/Components/FlashBanner";
import ExtintoresHeader from "@/Components/Extintores/ExtintoresHeader";
import ExtintorFilterPills from "@/Components/Extintores/ExtintorFilterPills";
import ExtintoresTable from "@/Components/Extintores/ExtintoresTable";
import ExtintorFormPanel from "@/Components/Extintores/ExtintorFormPanel";

export default function Index(props) {
    const { auth } = usePage().props;

    // Datos paginados recibidos desde ExtintorController
    const extintoresPaginator = props.extintores || {};
    const extintoresRaw =
        extintoresPaginator.data ||
        (Array.isArray(props.extintores) ? props.extintores : []);
    const tipos = props.tipos || [];
    const instalaciones = props.instalaciones || [];
    const capacidades_kg = props.capacidades_kg || [];
    const capacidades_l = props.capacidades_l || [];

    const [selectedExtintor, setSelectedExtintor] = useState(null);
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

    // El filtro activo y los conteos globales vienen sincronizados desde el backend
    const activeFilter = props.filtroActivo || "Todos";
    const conteos = props.conteos || {};
    // Petición al servidor sin mandar 'page' para que siempre inicie en la página 1
    const handleFilterChange = (nuevoFiltro) => {
        const params = nuevoFiltro === "Todos" ? {} : { filtro: nuevoFiltro };

        router.get(route("extintores.index"), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Normalización de ubicaciones y separación de estatus vs estado (vigencia)
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
                            const matchId =
                                ubicacionId &&
                                String(ub.id) === String(ubicacionId);
                            const matchNombre =
                                ub.nombre &&
                                ub.nombre.trim().toLowerCase() ===
                                    areaNombre.trim().toLowerCase();

                            if (matchId || matchNombre) {
                                edificioDetectado = inst.nombre || "";
                                pisoDetectado =
                                    p.nombre ||
                                    (p.numero ? `Piso ${p.numero}` : "");
                                break;
                            }
                        }
                        if (pisoDetectado) break;
                    }
                    if (edificioDetectado) break;
                }
            }

            const finalPiso =
                ext.piso_numero && !String(ext.piso_numero).includes("N/A")
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
                proximo_mantenimiento:
                    ext.proximo_mantenimiento || "Sin programar",
                proxima_revision: ext.proxima_revision || "Sin programar",
                estatus: ext.estatus || "Disponible",
                estado: ext.estado || "vigente",
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
        const { current_page, last_page, prev_page_url, next_page_url, links } =
            extintoresPaginator;

        if (!last_page || last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-neutro-100">
                <div className="text-xs text-neutro-600">
                    Página{" "}
                    <span className="font-semibold text-neutro-900">
                        {current_page}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-neutro-900">
                        {last_page}
                    </span>
                </div>

                <div className="inline-flex items-center gap-1">
                    <Link
                        href={prev_page_url || "#"}
                        preserveScroll
                        preserveState
                        as={prev_page_url ? "a" : "span"}
                        className={`p-1.5 rounded-lg border border-neutro-100 text-neutro-600 transition-colors ${
                            prev_page_url
                                ? "hover:bg-neutro-50 cursor-pointer"
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
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${
                                    link.active
                                        ? "bg-primario-500 text-white shadow-xs"
                                        : "border border-neutro-100 text-neutro-900 hover:bg-neutro-50"
                                } ${!link.url ? "opacity-40 pointer-events-none" : "cursor-pointer"}`}
                            />
                        ))}

                    <Link
                        href={next_page_url || "#"}
                        preserveScroll
                        preserveState
                        as={next_page_url ? "a" : "span"}
                        className={`p-1.5 rounded-lg border border-neutro-100 text-neutro-600 transition-colors ${
                            next_page_url
                                ? "hover:bg-neutro-50 cursor-pointer"
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
            <Head title="Extintores" />

            <div className="w-full max-w-7xl mx-auto space-y-4 pb-6 overflow-x-hidden">
                <ExtintoresHeader onAddNew={handleAddNew} />

                <FlashBanner />

                <ExtintorFilterPills
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    conteos={conteos}
                />

                {/* Vista Móvil */}
                <div className="block md:hidden">
                    {isMobileFormOpen ? (
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleCloseMobileForm}
                                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutro-100 hover:border-primario-300 hover:bg-primario-100/40 text-xs font-semibold text-neutro-900 hover:text-primario-700 shadow-xs transition-all cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4 text-neutro-600 group-hover:text-primario-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                <span>Volver a la lista</span>
                            </button>

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
                        <ExtintoresTable
                            extintores={normalizedExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                            footer={renderPagination()}
                        />
                    )}
                </div>

                {/* Vista Escritorio */}
                <div className="hidden md:grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-8">
                        <ExtintoresTable
                            extintores={normalizedExtintores}
                            selectedExtintor={selectedExtintor}
                            onSelectExtintor={handleSelectExtintor}
                            footer={renderPagination()}
                        />
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
