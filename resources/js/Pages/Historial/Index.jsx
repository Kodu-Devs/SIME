import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import ExportarModal from "@/Components/Historial/ExportarModal";
import { FileDown } from "lucide-react";

export default function Index({ edificios = [] }) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    const [modalExportarAbierto, setModalExportarAbierto] = useState(false);

    return (
        <Layout>
            <Head title="Historial" />

            {isAdmin ? (
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-neutro-100">
                        <div>
                            <h1 className="text-titulo-2 font-bold text-neutro-900">
                                Historial
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalExportarAbierto(true)}
                            className="inline-flex items-center gap-2 bg-primario-700 hover:bg-primario-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
                        >
                            <FileDown className="w-4 h-4" />
                            <span>Exportar informe</span>
                        </button>
                    </div>

                    {/* Modal de exportación creado por Sara */}
                    <ExportarModal
                        abierto={modalExportarAbierto}
                        onCerrar={() => setModalExportarAbierto(false)}
                        edificios={edificios}
                    />
                </div>
            ) : (
                <div>Vista de Consulta Pública (Solo lectura)</div>
            )}
        </Layout>
    );
}
