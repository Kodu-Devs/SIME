import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import HistorialAdminView from "@/Components/Historial/HistorialAdminView";
import HistorialPublicoView from "@/Components/Historial/HistorialPublicoView";

export default function Index({
    edificios = [],
    eventos = [],
    filters = {},
    extintores = [],
    capacitaciones = [],
}) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    return (
        <Layout>
            <Head title={isAdmin ? "Historial" : "Aprende más"} />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                {isAdmin ? (
                    <>
                        <div>
                            <h1 className="text-titulo-1 font-bold text-neutro-900">
                                Historial
                            </h1>
                            <p className="text-xs text-neutro-600 mt-0.5">
                                Bitácora de usos, mantenimientos realizados y
                                exportación de informes
                            </p>
                        </div>

                        <HistorialAdminView
                            eventos={eventos}
                            filters={filters}
                            edificios={edificios}
                            extintores={extintores}
                            capacitaciones={capacitaciones}
                        />
                    </>
                ) : (
                    <HistorialPublicoView />
                )}
            </div>
        </Layout>
    );
}
