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
            <Head title="Historial" />

            {isAdmin ? (
                <div className="max-w-7xl mx-auto space-y-6">
                    <h1 className="text-titulo-2 font-bold text-neutro-900">
                        Historial
                    </h1>

                    <HistorialAdminView
                        eventos={eventos}
                        filters={filters}
                        edificios={edificios}
                        extintores={extintores}
                        capacitaciones={capacitaciones}
                    />
                </div>
            ) : (
                <div className="min-h-screen py-8 bg-[#F1F0F0]">
                    <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-16">
                        <HistorialPublicoView />
                    </div>
                </div>
            )}
        </Layout>
    );
}