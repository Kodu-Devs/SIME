import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import CentroAyuda from "@/Components/Ayuda/CentroAyuda";
import { manualAdministrador } from "@/data/Ayuda/manualAdministrador";

export default function Administrador() {
    return (
        <AdminLayout>
            <Head title="Centro de ayuda" />
            <CentroAyuda manual={manualAdministrador} />
        </AdminLayout>
    );
}
