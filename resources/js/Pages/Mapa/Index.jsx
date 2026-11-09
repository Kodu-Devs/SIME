import { useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import Croquis from "@/Components/Mapa/Croquis";

const EDIFICIOS_MAPA = [
    "Edificio A",
    "Edificio B",
    "Edificio C",
    "Edificio D",
    "Edificio E",
    "Cafetería y SUM",
    "Almacén",
    "Almacén 2",
    "Vigilancia",
];

export default function Index({
    instalaciones = [],
    porEdificio = {},
    vencidos = 0,
    porVencer = 0,
    vigentes = 0,
    total = 0,
}) {
    const { auth } = usePage().props;
    const esAdmin = Boolean(auth?.user);
    const Layout = esAdmin ? AdminLayout : PublicLayout;

    // Soporte para atajo desde BarraBusqueda (?edificio=Edificio A)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const nombreEdificio = params.get("edificio");
        if (nombreEdificio && instalaciones.length > 0) {
            const encontrada = instalaciones.find(
                (i) => i.nombre.toLowerCase() === nombreEdificio.toLowerCase(),
            );
            if (encontrada) {
                router.get(route("mapa.edificio", encontrada.id));
            }
        }
    }, [instalaciones]);

    const irAEdificio = (instalacion) => {
        if (!instalacion?.id) return;
        router.get(route("mapa.edificio", instalacion.id));
    };

    const instalacionesLista = instalaciones.filter((inst) =>
        EDIFICIOS_MAPA.includes(inst.nombre),
    );

    const nombreVisible = (nombreBD) =>
        nombreBD === "Vigilancia" ? "Almacén 2" : nombreBD;

    return (
        <Layout>
            <Head title="Mapa de la Institución" />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        {esAdmin
                            ? "Ubicar extintores"
                            : "¿Dónde está el extintor más cercano?"}
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-neutro-600 mt-1">
                        <span className="text-neutro-900 font-bold">
                            Institución
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda (2/3): Croquis Interactivo */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 min-h-[420px]">
                            <Croquis
                                instalaciones={instalaciones}
                                porEdificio={porEdificio}
                                onSelectEdificio={irAEdificio}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha (1/3): Resumen e Instalaciones desde BD */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full">
                        <div className="flex-1">
                            <h3 className="text-titulo-2 font-bold text-neutro-900">
                                Toda la institución
                            </h3>
                            <p className="text-xs text-neutro-600 mt-1">
                                {total} extintores marcados en los planos
                            </p>

                            {/* Tarjetas de métricas que vienen de MapaController@index */}
                            <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
                                <div className="bg-acento-500 text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {vigentes}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Vigentes
                                    </span>
                                </div>
                                <div className="bg-neutro-600 text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {porVencer}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Por vencer
                                    </span>
                                </div>
                                <div className="bg-primario-700 text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {vencidos}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Vencidos
                                    </span>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-neutro-600 tracking-wider uppercase mb-2">
                                EDIFICIOS
                            </p>

                            {/* Lista dinámica armada con la prop instalaciones y porEdificio */}
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                                {instalacionesLista.map((inst) => {
                                    const stats =
                                        porEdificio[inst.nombre] || {};
                                    const totalExt =
                                        stats.total ??
                                        inst.extintores_count ??
                                        0;
                                    const vencidosExt =
                                        stats.vencidos ??
                                        inst.vencidos_count ??
                                        0;

                                    const etiquetaNombre = nombreVisible(
                                        inst.nombre,
                                    );
                                    const inicial = etiquetaNombre.includes(
                                        "Edificio",
                                    )
                                        ? etiquetaNombre.split(" ")[1]
                                        : etiquetaNombre.charAt(0);

                                    return (
                                        <button
                                            key={inst.id}
                                            type="button"
                                            onClick={() => irAEdificio(inst)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg border border-neutro-100 hover:bg-neutro-50 transition-colors group text-left"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-primario-700 font-bold text-sm w-4 shrink-0">
                                                    {inicial}
                                                </span>
                                                <span className="text-sm font-semibold text-neutro-900 truncate">
                                                    {etiquetaNombre}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-xs text-neutro-600">
                                                    {totalExt}{" "}
                                                    {totalExt === 1
                                                        ? "extintor"
                                                        : "extintores"}{" "}
                                                    - {vencidosExt}{" "}
                                                    {vencidosExt === 1
                                                        ? "vencido"
                                                        : "vencidos"}
                                                </span>
                                                <span className="text-neutro-300 group-hover:text-neutro-600">
                                                    ›
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
