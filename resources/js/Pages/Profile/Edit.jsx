import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit() {
    return (
        <AdminLayout>
            <Head title="Mi perfil" />

            <div className="w-full max-w-7xl mx-auto space-y-4">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        Perfil
                    </h1>
                    <p className="text-xs text-neutro-600 mt-0.5">
                        Administra tu perfil
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutro-100">
                    <UpdateProfileInformationForm />
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutro-100">
                    <UpdatePasswordForm />
                </div>
            </div>
        </AdminLayout>
    );
}
