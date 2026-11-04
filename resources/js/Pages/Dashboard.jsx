import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import TarjetaMetrica from "@/Components/Dashboard/TarjetaMetrica";
import BannerAlerta from "@/Components/Dashboard/BannerAlerta";
import PanelAgenda from "@/Components/Dashboard/PanelAgenda";
import PanelRecomendaciones from "@/Components/Dashboard/PanelRecomendaciones";

export default function Dashboard({
    tarjetas,
    alerta_vencido,
    agenda,
    recomendaciones = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 text-gray-900 grid grid-cols-4 gap-4">
                        <TarjetaMetrica
                            titulo="Extintores"
                            valor={tarjetas.total_extintores}
                            detalle={`En ${tarjetas.total_edificios} edificios`}
                        />

                        <TarjetaMetrica
                            titulo="Vigentes"
                            valor={tarjetas.vigentes}
                            detalle="al día"
                        />

                        <TarjetaMetrica
                            titulo="Por vencer"
                            valor={tarjetas.por_vencer}
                            detalle="proximos 7 días"
                        />

                        <TarjetaMetrica
                            titulo="Vencidos"
                            valor={tarjetas.vencidos}
                            detalle="Requiere atencion"
                        />
                    </div>
                    {alerta_vencido && (
                        <BannerAlerta
                            etiqueta={alerta_vencido.etiqueta}
                            ubicacion={alerta_vencido.ubicacion}
                            edificio={alerta_vencido.edificio}
                            piso={alerta_vencido.piso}
                        />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PanelAgenda eventos={agenda} />

                        <PanelRecomendaciones
                            recomendaciones={recomendaciones}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
