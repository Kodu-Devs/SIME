import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import TarjetaMetrica from "@/Components/Dashboard/TarjetaMetrica";

export default function Dashboard({ tarjetas }) {
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
