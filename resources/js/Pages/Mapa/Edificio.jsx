import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import VistaIsometrica from "@/Components/Mapa/Planos/VistaIsometrica";
import Planta from "@/Components/Mapa/Planta";

export default function Edificio({ instalacion }) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    const pisos = instalacion?.pisos || [];
    const esUnSoloNivel = pisos.length === 1;
    const nombreEdificio =
        instalacion?.nombre === "Vigilancia"
            ? "Almacén 2"
            : instalacion?.nombre;

    const irAPisoPorObjeto = (pisoObj) => {
        if (!pisoObj?.id) return;
        router.get(route("mapa.piso", [instalacion.id, pisoObj.id]));
    };

    const manejarSelectPisoDesdeSVG = (nombreNivel) => {
        const normalizar = (str = "") => str.trim().toLowerCase();
        let pisoEncontrado = pisos.find(
            (p) => normalizar(p.nombre) === normalizar(nombreNivel),
        );

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
            <Head title={`Mapa — ${nombreEdificio || "Edificio"}`} />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        {isAdmin
                            ? "Ubicar extintores"
                            : "¿Dónde está el extintor más cercano?"}
                    </h1>

                    <div className="flex items-center gap-2 text-xs text-neutro-600 mt-1">
                        <Link
                            href={route("mapa.index")}
                            className="text-primario-500 hover:underline font-semibold"
                        >
                            Institución
                        </Link>
                        <span className="text-neutro-300">/</span>
                        <span className="text-neutro-900 font-bold">
                            {nombreEdificio}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda (2/3): Si es de 1 solo nivel muestra Planta, si tiene varios muestra VistaIsometrica */}
                    <div className="lg:col-span-2">
                        {esUnSoloNivel ? (
                            <Planta
                                edificio={nombreEdificio}
                                piso={pisos[0]?.nombre || "Nivel único"}
                                onVolver={() => router.get(route("mapa.index"))}
                                onSeleccionarEspacio={() =>
                                    irAPisoPorObjeto(pisos[0])
                                }
                            />
                        ) : (
                            <VistaIsometrica
                                edificio={nombreEdificio}
                                onVolver={() => router.get(route("mapa.index"))}
                                onSelectPiso={manejarSelectPisoDesdeSVG}
                            />
                        )}
                    </div>

                    {/* Columna Derecha (1/3): Selector de Pisos Reales de BD */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full">
                        <h3 className="text-titulo-2 font-bold text-neutro-900">
                            {nombreEdificio}
                        </h3>
                        <p className="text-xs text-neutro-600 mt-1 mb-4">
                            {esUnSoloNivel
                                ? "Haz clic en el plano o en el botón inferior para ver el detalle de extintores de esta área:"
                                : "Elige un piso para abrir su plano y consultar sus ubicaciones:"}
                        </p>

                        <div className="space-y-2">
                            {pisos.map((piso) => (
                                <button
                                    key={piso.id}
                                    type="button"
                                    onClick={() => irAPisoPorObjeto(piso)}
                                    className="w-full flex justify-between items-center p-3.5 rounded-lg border border-neutro-100 hover:border-primario-500 hover:bg-primario-100/20 text-etiqueta font-semibold text-neutro-900 transition"
                                >
                                    <span>
                                        {esUnSoloNivel
                                            ? `Ver extintores (${piso.nombre})`
                                            : piso.nombre}
                                    </span>
                                    <span className="text-neutro-600">›</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
