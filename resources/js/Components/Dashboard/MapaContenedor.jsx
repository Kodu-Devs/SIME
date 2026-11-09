import { Link, router } from "@inertiajs/react";
import Croquis from "@/Components/Mapa/Croquis";
import { Maximize2 } from "lucide-react";

export default function MapaContenedor({
    instalaciones = [],
    porEdificio = {},
}) {
    const manejarSeleccionEdificio = (edificio) => {
        // Si tiene ID (porque llegó la prop instalaciones), va directo a /mapa/{id}
        if (edificio?.id) {
            router.get(route("mapa.edificio", edificio.id));
            return;
        }

        // Si solo tiene el nombre (desde Dashboard), usa el atajo ?edificio=... que ya resuelve Mapa/Index.jsx
        if (edificio?.nombre) {
            router.get(route("mapa.index"), { edificio: edificio.nombre });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutro-100 p-6 flex flex-col h-full min-h-[450px]">
            {/* Encabezado de la tarjeta */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-titulo-2 text-neutro-900 font-bold">
                        Mapa de la institución
                    </h2>
                    <p className="text-xs text-neutro-600 mt-1">
                        Elige un edificio para consultar sus niveles y
                        extintores
                    </p>
                </div>

                <Link
                    href={route("mapa.index")}
                    className="text-neutro-600 hover:text-primario-700 hover:bg-primario-100/50 p-2 rounded-lg transition-colors"
                    title="Abrir mapa completo"
                >
                    <Maximize2 className="w-5 h-5" />
                </Link>
            </div>

            {/* Contenedor del Croquis */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
                <Croquis
                    instalaciones={instalaciones}
                    porEdificio={porEdificio}
                    onSelectEdificio={manejarSeleccionEdificio}
                />
            </div>
        </div>
    );
}
