import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Index(props) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    return (
        <Layout>
            <Head title="SIME" />
            {isAdmin ? (
                <div>
                    Vista de Administrador (Con panel lateral de acciones)
                </div>
            ) : (
                <div>Vista de Consulta Pública (Solo lectura)</div>
            )}
        </Layout>
    );
}








