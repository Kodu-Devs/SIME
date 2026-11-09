import { useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import VistaIsometrica from "@/Components/Mapa/Planos/VistaIsometrica";

export default function Edificio({ instalacion }) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    const pisos = instalacion?.pisos || [];

    // Si la instalación solo tiene un piso ("Nivel único"), abrimos su plano directamente
    useEffect(() => {
        if (instalacion?.id && pisos.length === 1) {
            router.replace(route("mapa.piso", [instalacion.id, pisos[0].id]));
        }
    }, [instalacion, pisos]);

    const irAPisoPorObjeto = (pisoObj) => {
        if (!pisoObj?.id) return;
        router.get(route("mapa.piso", [instalacion.id, pisoObj.id]));
    };

    // Cuando el usuario da clic en un nivel del SVG 3D de Alex, buscamos su ID en instalacion.pisos
    const manejarSelectPisoDesdeSVG = (nombreNivel) => {
        const normalizar = (str = "") => str.trim().toLowerCase();
        let pisoEncontrado = pisos.find(
            (p) => normalizar(p.nombre) === normalizar(nombreNivel),
        );

        // Respaldo por si el SVG manda "Planta alta" y en la BD se llama "Nivel 1"
        if (!pisoEncontrado && normalizar(nombreNivel) === "planta alta") {
            pisoEncontrado = pisos.find(
                (p) => normalizar(p.nombre) === "nivel 1",
            );
        }

        if (pisoEncontrado) {
            irAPisoPorObjeto(pisoEncontrado);
        }
    };

    return (
        <Layout>
            <Head title={`Mapa — ${instalacion?.nombre || "Edificio"}`} />

            {/* Migas de pan */}
            <div className="mb-4">
                <h1 className="text-titulo-2 font-bold text-neutro-900">
                    {isAdmin
                        ? "Ubicar extintores"
                        : "¿Dónde está el extintor más cercano?"}
                </h1>

                <div className="flex items-center gap-2 text-etiqueta mt-2">
                    <Link
                        href={route("mapa.index")}
                        className="text-primario-500 hover:underline"
                    >
                        Institución
                    </Link>
                    <span className="text-neutro-300">/</span>
                    <span className="text-neutro-900 font-bold">
                        {instalacion?.nombre}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda (2/3): Vista Isométrica 3D de Alex */}
                <div className="lg:col-span-2">
                    <VistaIsometrica
                        edificio={instalacion?.nombre}
                        onVolver={() => router.get(route("mapa.index"))}
                        onSelectPiso={manejarSelectPisoDesdeSVG}
                    />
                </div>

                {/* Columna Derecha (1/3): Selector de Pisos Reales de BD */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full">
                    <h3 className="text-titulo-2 font-bold text-neutro-900">
                        {instalacion?.nombre}
                    </h3>
                    <p className="text-xs text-neutro-600 mt-1 mb-4">
                        Elige un piso para abrir su plano y consultar sus
                        ubicaciones:
                    </p>

                    <div className="space-y-2">
                        {pisos.map((piso) => (
                            <button
                                key={piso.id}
                                type="button"
                                onClick={() => irAPisoPorObjeto(piso)}
                                className="w-full flex justify-between items-center p-3.5 rounded-lg border border-neutro-100 hover:border-primario-500 hover:bg-primario-100/20 text-etiqueta font-semibold text-neutro-900 transition"
                            >
                                <span>{piso.nombre}</span>
                                <span className="text-neutro-600">›</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
