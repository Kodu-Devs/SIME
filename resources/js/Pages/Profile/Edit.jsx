import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit() {
    return (
        <AdminLayout>
            <Head title="Perfil" />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                {/* Encabezado Principal */}
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        Perfil
                    </h1>
                    <p className="text-xs text-neutro-600 mt-0.5">
                        Administra tu perfil
                    </p>
                </div>

                {/* Tarjeta 1: Datos de Perfil */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutro-100">
                    <UpdateProfileInformationForm />
                </div>

                {/* Tarjeta 2: Actualizar Contraseña */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutro-100">
                    <UpdatePasswordForm />
                </div>
            </div>
        </AdminLayout>
    );
}
