import { Head, router } from "@inertiajs/react";
import TarjetaMetrica from "@/Components/Dashboard/TarjetaMetrica";
import BannerAlerta from "@/Components/Dashboard/BannerAlerta";
import PanelAgenda from "@/Components/Dashboard/PanelAgenda";
import PanelRecomendaciones from "@/Components/Dashboard/PanelRecomendaciones";
import MapaContenedor from "@/Components/Dashboard/MapaContenedor";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Dashboard({
    tarjetas,
    alerta_vencido,
    agenda,
    recomendaciones = [],
    instalaciones = [],
    porEdificio = {},
}) {
    return (
        <AdminLayout>
            <Head title="Resumen" />

            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                    <div className="order-1 lg:col-span-2">
                        <h1 className="text-titulo-1 font-bold text-neutro-900">
                            Resumen
                        </h1>
                        <p className="text-xs text-neutro-600 mt-0.5">
                            Estado general de los equipos y actividad reciente
                            del plantel
                        </p>
                    </div>

                    <div className="order-2 lg:order-4 h-full">
                        <MapaContenedor
                            instalaciones={instalaciones}
                            porEdificio={porEdificio}
                        />
                    </div>

                    <div className="order-3 lg:order-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <TarjetaMetrica
                            titulo="Extintores"
                            valor={tarjetas.total_extintores}
                            detalle={`En ${tarjetas.total_edificios} edificios`}
                            colorTexto="text-neutro-900"
                            onClick={() =>
                                router.get(route("extintores.index"))
                            }
                        />
                        <TarjetaMetrica
                            titulo="Vigentes"
                            valor={tarjetas.vigentes}
                            detalle="al día"
                            colorTexto="text-acento-500"
                            onClick={() =>
                                router.get(route("extintores.index"))
                            }
                        />
                        <TarjetaMetrica
                            titulo="Por vencer"
                            valor={tarjetas.por_vencer}
                            detalle="próximos 7 días"
                            colorTexto="text-sime-warning"
                            onClick={() => router.get(route("alertas.index"))}
                        />
                        <TarjetaMetrica
                            titulo="Vencidos"
                            valor={tarjetas.vencidos}
                            detalle="Requiere atención"
                            colorTexto="text-primario-500"
                            onClick={() => router.get(route("alertas.index"))}
                        />
                    </div>

                    {alerta_vencido && (
                        <div className="order-4 lg:order-3 lg:col-span-2">
                            <BannerAlerta
                                id={alerta_vencido.id}
                                etiqueta={alerta_vencido.etiqueta}
                                ubicacion={alerta_vencido.ubicacion}
                                edificio={alerta_vencido.edificio}
                                piso={alerta_vencido.piso}
                            />
                        </div>
                    )}

                    <div className="order-5 lg:order-5 flex flex-col gap-6">
                        <PanelAgenda eventos={agenda} />
                        <PanelRecomendaciones
                            recomendaciones={recomendaciones}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
