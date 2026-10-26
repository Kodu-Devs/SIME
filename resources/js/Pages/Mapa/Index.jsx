import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Index({
    porEstatus = {},
    vencidos = 0,
    porTipo = [],
    porEdificio = {},
}) {
    const { auth } = usePage().props;
    const esAdmin = Boolean(auth?.user);

    // ESTADOS DE NAVEGACIÓN DEL MAPA (Sin recargar la página):
    // 1. Si ambos son null -> Muestra el Croquis Verde de todo el Campus (Componente de Alex)
    // 2. Si edificioSeleccionado tiene valor -> Muestra los pisos de ese edificio en el panel derecho
    // 3. Si pisoSeleccionado tiene valor -> Cambia el croquis por el Plano de Salones (Componente de Ulises)
    const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
    const [pisoSeleccionado, setPisoSeleccionado] = useState(null);

    // Elegimos automáticamente el Layout según si inició sesión o es público
    const Layout = esAdmin ? AdminLayout : PublicLayout;

    return (
        <Layout>
            <Head title="Mapa de la Institución" />

            {/* ENCABEZADO Y MIGAS DE PAN (Institución > Edificio A > Planta baja) */}
            <div className="mb-4">
                <h1 className="text-titulo-2 font-bold text-neutro-900">
                    {esAdmin
                        ? "Ubicar extintores"
                        : "¿Dónde está el extintor más cercano?"}
                </h1>

                <div className="flex items-center gap-2 text-etiqueta mt-2">
                    <button
                        onClick={() => {
                            setEdificioSeleccionado(null);
                            setPisoSeleccionado(null);
                        }}
                        className="text-primario-500 hover:underline"
                    >
                        🏠 Institución
                    </button>

                    {edificioSeleccionado && (
                        <>
                            <span className="text-neutro-300">&gt;</span>
                            <button
                                onClick={() => setPisoSeleccionado(null)}
                                className="text-primario-500 hover:underline"
                            >
                                {edificioSeleccionado}
                            </button>
                        </>
                    )}

                    {pisoSeleccionado && (
                        <>
                            <span className="text-neutro-300">&gt;</span>
                            <span className="text-neutro-900 font-bold">
                                {pisoSeleccionado}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* CONTENEDOR MAESTRO-DETALLE (Izquierda: Mapa/Plano | Derecha: Panel de info) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUMNA IZQUIERDA (2/3): SECCIÓN INTERACTIVA QUE CAMBIA SIN RECARGAR */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutro-100 min-h-[420px]">
                    {!pisoSeleccionado ? (
                        /* VISTA 1: Croquis General del Campus (Aquí irá <CampusCroquis /> de Alex) */
                        <div className="bg-green-100 rounded-xl p-6 h-full flex flex-col justify-between">
                            <p className="text-etiqueta text-neutro-600 mb-4">
                                Mapa de la Institución — Haz clic en un
                                edificio:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    "Edificio A",
                                    "Edificio B",
                                    "Edificio C",
                                    "Edificio D",
                                    "Edificio E",
                                    "Cafetería y SUM",
                                ].map((nombreEdificio) => (
                                    <button
                                        key={nombreEdificio}
                                        onClick={() =>
                                            setEdificioSeleccionado(
                                                nombreEdificio,
                                            )
                                        }
                                        className={`p-4 rounded-xl bg-white shadow text-left border-2 transition ${
                                            edificioSeleccionado ===
                                            nombreEdificio
                                                ? "border-primario-500"
                                                : "border-transparent hover:border-acento-500"
                                        }`}
                                    >
                                        <p className="font-bold text-neutro-900">
                                            {nombreEdificio}
                                        </p>
                                        <p className="text-xs text-neutro-600 mt-1">
                                            {porEdificio[nombreEdificio] ?? 0}{" "}
                                            extintores
                                        </p>
                                        <div className="h-2 w-full bg-acento-500 rounded-full mt-2" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* VISTA 2: Plano Interno del Piso (Aquí irá <BuildingFloorPlan /> de Ulises) */
                        <div className="border-2 border-dashed border-neutro-100 rounded-xl p-6 h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-titulo-2 text-neutro-900">
                                    Plano de {edificioSeleccionado} —{" "}
                                    {pisoSeleccionado}
                                </h2>
                                <button
                                    onClick={() => setPisoSeleccionado(null)}
                                    className="text-xs text-primario-500 hover:underline"
                                >
                                    ← Volver al croquis
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3 text-center text-xs">
                                <div className="bg-primario-100 p-6 rounded-lg">
                                    Salón
                                </div>
                                <div className="bg-acento-500/20 p-6 rounded-lg font-bold">
                                    📍 Oficina
                                </div>
                                <div className="bg-primario-300 p-6 rounded-lg">
                                    📍 Baño
                                </div>
                                <div className="bg-neutro-100 p-6 rounded-lg">
                                    Escaleras
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA (1/3): PANEL LATERAL QUE CAMBIA SEGÚN LA SELECCIÓN */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100">
                    {!edificioSeleccionado ? (
                        <div>
                            <h3 className="text-titulo-2 text-neutro-900">
                                Toda la institución
                            </h3>
                            <p className="text-xs text-neutro-600 mt-1">
                                Selecciona un edificio en el mapa para ver sus
                                pisos.
                            </p>
                            <div className="mt-4 p-3 rounded-lg bg-primario-100 text-primario-700 text-etiqueta">
                                Vencidos totales: {vencidos}
                            </div>
                        </div>
                    ) : !pisoSeleccionado ? (
                        <div>
                            <h3 className="text-titulo-2 text-neutro-900">
                                {edificioSeleccionado}
                            </h3>
                            <p className="text-xs text-neutro-600 mb-4">
                                Elige un piso para abrir su plano:
                            </p>
                            <div className="space-y-2">
                                {["Planta baja", "Nivel 1"].map((piso) => (
                                    <button
                                        key={piso}
                                        onClick={() =>
                                            setPisoSeleccionado(piso)
                                        }
                                        className="w-full flex justify-between items-center p-3 rounded-lg border border-neutro-100 hover:bg-neutro-50 text-etiqueta"
                                    >
                                        <span>{piso}</span>
                                        <span>&gt;</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-titulo-2 text-neutro-900">
                                {esAdmin
                                    ? "Por ubicar"
                                    : "Extintores en esta planta"}
                            </h3>
                            <p className="text-xs text-neutro-600 mt-1">
                                {esAdmin
                                    ? "Arrastra un extintor hacia el plano de la izquierda."
                                    : `Mostrando equipos de ${edificioSeleccionado} - ${pisoSeleccionado}`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
