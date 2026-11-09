import { useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import Croquis from "@/Components/Mapa/Croquis";

export default function Index({
    instalaciones = [],
    porEstatus = {},
    vencidos = 0,
}) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    // Calculamos el total de extintores sumando extintores_count que envía MapaController@index
    const totalExtintores = instalaciones.reduce(
        (acc, inst) => acc + Number(inst.extintores_count || 0),
        0,
    );

    const disponibles = Number(porEstatus["Disponible"] || 0);
    const medioUso = Number(porEstatus["Medio uso"] || 0);

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

    return (
        <Layout>
            <Head title="Mapa de la Institución" />

            <div className="mb-4">
                <h1 className="text-titulo-2 font-bold text-neutro-900">
                    {isAdmin
                        ? "Ubicar extintores"
                        : "¿Dónde está el extintor más cercano?"}
                </h1>

                <div className="flex items-center gap-2 text-etiqueta mt-2">
                    <span className="text-neutro-900 font-bold">
                        Institución
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda (2/3): Croquis del Campus de Alex */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 min-h-[420px]">
                        <Croquis
                            instalaciones={instalaciones}
                            onSelectEdificio={irAEdificio}
                        />
                    </div>
                </div>

                {/* Columna Derecha (1/3): Resumen e Instalaciones desde BD */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutro-900">
                            Toda la institución
                        </h3>
                        <p className="text-xs text-neutro-600 mt-1">
                            {totalExtintores} extintores activos en el plantel
                        </p>

                        {/* Indicadores reales que envía MapaController@index */}
                        <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
                            <div className="bg-acento-500 text-white p-3 rounded-lg flex flex-col justify-between">
                                <span className="text-xl font-bold">
                                    {disponibles}
                                </span>
                                <span className="text-[10px] uppercase font-medium">
                                    Disponibles
                                </span>
                            </div>
                            <div className="bg-neutro-600 text-white p-3 rounded-lg flex flex-col justify-between">
                                <span className="text-xl font-bold">
                                    {medioUso}
                                </span>
                                <span className="text-[10px] uppercase font-medium">
                                    Medio uso
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
                            Instalaciones y Edificios
                        </p>

                        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                            {instalaciones.map((inst) => {
                                const inicial = inst.nombre.includes("Edificio")
                                    ? inst.nombre.split(" ")[1]
                                    : inst.nombre.charAt(0);

                                return (
                                    <button
                                        key={inst.id}
                                        type="button"
                                        onClick={() => irAEdificio(inst)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-neutro-100 hover:bg-neutro-50 transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-primario-700 font-bold text-sm w-5 shrink-0">
                                                {inicial}
                                            </span>
                                            <span className="text-sm font-semibold text-neutro-900 truncate">
                                                {inst.nombre}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs text-neutro-600">
                                                {inst.extintores_count ?? 0}{" "}
                                                extintores
                                            </span>
                                            <span className="text-neutro-300 group-hover:text-neutro-900">
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
        </Layout>
    );
}
