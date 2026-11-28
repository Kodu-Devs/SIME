import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import CentroAyuda from "@/Components/Ayuda/CentroAyuda";
import { manualUsuario } from "@/data/Ayuda/manualUsuario";

export default function Usuario() {
    return (
        <PublicLayout>
            <Head title="Centro de ayuda" />
            <CentroAyuda manual={manualUsuario} />
        </PublicLayout>
    );
}
