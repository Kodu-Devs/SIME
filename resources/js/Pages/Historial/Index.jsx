import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";

import HistorialPublicoView from "@/Components/Historial/HistorialPublicoView";

export default function Index(props) {
    const { auth } = usePage().props;
    
    const isAdmin = Boolean(auth?.user);
    

    const Layout = isAdmin ? AdminLayout : PublicLayout;

    return (
        <Layout>
            <Head title="SIME - Aprende" />
            {isAdmin ? (
                <div>
                    Vista de Administrador (Con panel lateral de acciones)
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