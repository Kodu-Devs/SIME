import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import Croquis from "@/Components/Mapa/Croquis";
import Planta from "@/Components/Mapa/Planta";
import VistaIsometrica from "@/Components/Mapa/Planos/VistaIsometrica";

export default function Index({
    vencidos = 0,
    porVencer = 0,
    vigentes = 0,
    total = 0, //
    porEdificio = {},
}) {
    const { auth } = usePage().props;
    const esAdmin = Boolean(auth?.user);
    const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
    const [pisoSeleccionado, setPisoSeleccionado] = useState(null);
    const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
    const Layout = esAdmin ? AdminLayout : PublicLayout;

    const pisosPorEdificio = {
        "Edificio A": ["Planta alta", "Planta baja"],
        "Edificio B": ["Planta alta", "Planta baja"],
        "Edificio C": ["Planta alta", "Planta baja"],
        "Edificio D": ["Planta alta", "Planta baja"],
        "Edificio E": ["Nivel 3", "Nivel 2", "Nivel 1", "Planta baja"],
        Cafetería: ["Planta baja"],
        Almacen: ["Planta baja"],
        "Almacen 2": ["Planta baja"],
    };

    const nivelesDisponibles = edificioSeleccionado
        ? pisosPorEdificio[edificioSeleccionado] || ["Planta baja"]
        : [];

    return (
        <Layout>
            <Head title="Mapa de la Institución" />

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
                            setEspacioSeleccionado(null);
                        }}
                        className="text-primario-500 hover:underline"
                    >
                        Institución
                    </button>
                    {edificioSeleccionado && (
                        <>
                            <span className="text-neutro-300">/</span>
                            <button
                                onClick={() => {
                                    setPisoSeleccionado(null);
                                    setEspacioSeleccionado(null);
                                }}
                                className="text-primario-500 hover:underline"
                            >
                                {edificioSeleccionado}
                            </button>
                        </>
                    )}
                    {pisoSeleccionado && (
                        <>
                            <span className="text-neutro-300">/</span>
                            <span className="text-neutro-900 font-bold">
                                {pisoSeleccionado}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {!edificioSeleccionado ? (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 min-h-[420px]">
                            <Croquis
                                onSelectEdificio={(nombre) => {
                                    setEdificioSeleccionado(nombre);
                                    const pisosDelEdificio = pisosPorEdificio[
                                        nombre
                                    ] || ["Planta baja"];
                                    if (pisosDelEdificio.length === 1) {
                                        setPisoSeleccionado(
                                            pisosDelEdificio[0],
                                        );
                                    } else {
                                        setPisoSeleccionado(null);
                                    }
                                    setEspacioSeleccionado(null);
                                }}
                            />
                        </div>
                    ) : !pisoSeleccionado ? (
                        <VistaIsometrica
                            edificio={edificioSeleccionado}
                            onVolver={() => setEdificioSeleccionado(null)}
                            onSelectPiso={setPisoSeleccionado}
                        />
                    ) : (
                        <Planta
                            edificio={edificioSeleccionado}
                            piso={pisoSeleccionado}
                            onVolver={() => {
                                setPisoSeleccionado(null);
                                setEspacioSeleccionado(null);
                            }}
                            onSeleccionarEspacio={setEspacioSeleccionado}
                        />
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full">
                    {!edificioSeleccionado ? (
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-neutro-900">
                                Toda la institución
                            </h3>
                            <p className="text-xs text-neutro-500 mt-1">
                                {total} extintores marcados en los planos
                            </p>

                            {/* panel lateral datos*/}
                            <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
                                <div className="bg-[#48A5A3] text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {vigentes}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Vigentes
                                    </span>
                                </div>
                                <div className="bg-[#786C6A] text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {porVencer}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Por vencer
                                    </span>
                                </div>
                                <div className="bg-[#C82A2E] text-white p-3 rounded-lg flex flex-col justify-between">
                                    <span className="text-xl font-bold">
                                        {vencidos}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium">
                                        Vencidos
                                    </span>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
                                EDIFICIOS
                            </p>

                            {/* LISTA DE EDIFICIOS */}
                            <div className="space-y-2">
                                {Object.keys(pisosPorEdificio).map(
                                    (edificioKey) => {
                                        // Datos simulados (debes reemplazarlos con tu objeto porEdificio real si viene estructurado así)
                                        const totalExt =
                                            porEdificio[edificioKey]?.total ||
                                            0;
                                        const vencidosExt =
                                            porEdificio[edificioKey]
                                                ?.vencidos || 0;
                                        const inicial = edificioKey.includes(
                                            "Edificio",
                                        )
                                            ? edificioKey.split(" ")[1]
                                            : edificioKey.charAt(0);

                                        return (
                                            <button
                                                key={edificioKey}
                                                onClick={() => {
                                                    setEdificioSeleccionado(
                                                        edificioKey,
                                                    );
                                                    const pisosDelEdificio =
                                                        pisosPorEdificio[
                                                            edificioKey
                                                        ] || ["Planta baja"];
                                                    if (
                                                        pisosDelEdificio.length ===
                                                        1
                                                    ) {
                                                        setPisoSeleccionado(
                                                            pisosDelEdificio[0],
                                                        );
                                                    } else {
                                                        setPisoSeleccionado(
                                                            null,
                                                        );
                                                    }
                                                    setEspacioSeleccionado(
                                                        null,
                                                    );
                                                }}
                                                className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[#C82A2E] font-bold text-sm w-4">
                                                        {inicial}
                                                    </span>
                                                    <span className="text-sm font-semibold text-neutral-800">
                                                        {edificioKey}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-neutral-500">
                                                        {totalExt} extintores -{" "}
                                                        {vencidosExt} vencido
                                                    </span>
                                                    <span className="text-neutral-400 group-hover:text-neutral-600">
                                                        ›
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    ) : (
                        // vista edificio seleccionado
                        <div>
                            <h3 className="text-titulo-2 text-neutro-900">
                                {edificioSeleccionado}
                            </h3>
                            <p className="text-xs text-neutro-600 mb-4">
                                {pisoSeleccionado
                                    ? "Cambiar de piso:"
                                    : "Elige un piso para abrir su plano:"}
                            </p>

                            <div className="space-y-2 mb-6">
                                {nivelesDisponibles.map((piso) => (
                                    <button
                                        key={piso}
                                        onClick={() => {
                                            setPisoSeleccionado(piso);
                                            setEspacioSeleccionado(null);
                                        }}
                                        className={`w-full flex justify-between items-center p-3 rounded-lg border text-etiqueta transition-all ${
                                            pisoSeleccionado === piso
                                                ? "border-primario-500 bg-primario-50 text-primario-700 font-bold shadow-sm"
                                                : "border-neutro-100 hover:bg-neutro-50 text-neutro-700"
                                        }`}
                                    >
                                        <span>{piso}</span>
                                        <span></span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
