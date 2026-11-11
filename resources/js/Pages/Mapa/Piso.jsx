import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import Planta from "@/Components/Mapa/Planta";
import { MapPin, Flame } from "lucide-react";

const ESTILOS_ESTADO = {
    vigente: {
        texto: "Vigente",
        badge: "bg-acento-500/15 text-acento-500 border-acento-500/30",
        punto: "bg-acento-500",
    },
    por_vencer: {
        texto: "Por vencer",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        punto: "bg-amber-500",
    },
    vencido: {
        texto: "Vencido",
        badge: "bg-primario-100 text-primario-700 border-primario-300",
        punto: "bg-primario-500",
    },
};

export default function Piso({
    instalacion = {},
    piso = {},
    ubicaciones = [],
}) {
    const { auth } = usePage().props;
    const isAdmin = Boolean(auth?.user);
    const Layout = isAdmin ? AdminLayout : PublicLayout;

    const [ubicacionActiva, setUbicacionActiva] = useState(null);

    const sinUbicar = ubicaciones.filter((u) => !u.posicion);
    const nombreEdificio =
        instalacion?.nombre === "Vigilancia"
            ? "Almacén 2"
            : instalacion?.nombre;

    const esEdificioDeUnPiso =
        piso?.nombre === "Nivel único" ||
        piso?.nombre === "Nivel unico" ||
        [
            "Cafetería y SUM",
            "Cafetería",
            "Almacén",
            "Almacén 2",
            "Vigilancia",
        ].includes(instalacion?.nombre);

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return "Sin fecha";
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return String(fechaStr).slice(0, 10);
        return fecha.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const volverAtras = () => {
        if (esEdificioDeUnPiso) {
            router.get(route("mapa.index"));
        } else {
            router.get(route("mapa.edificio", instalacion.id));
        }
    };

    return (
        <Layout>
            <Head title={`Plano — ${nombreEdificio} (${piso?.nombre})`} />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        {isAdmin
                            ? "Ubicar extintores"
                            : "¿Dónde está el extintor más cercano?"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutro-600 mt-1">
                        <Link
                            href={route("mapa.index")}
                            className="text-primario-500 hover:underline font-semibold"
                        >
                            Institución
                        </Link>
                        <span className="text-neutro-300">/</span>
                        {esEdificioDeUnPiso ? (
                            <span className="text-neutro-900 font-bold">
                                {nombreEdificio}
                            </span>
                        ) : (
                            <>
                                <Link
                                    href={route(
                                        "mapa.edificio",
                                        instalacion?.id,
                                    )}
                                    className="text-primario-500 hover:underline font-semibold"
                                >
                                    {nombreEdificio}
                                </Link>
                                <span className="text-neutro-300">/</span>
                                <span className="text-neutro-900 font-bold">
                                    {piso?.nombre}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda (2/3): Plano 2D de la Planta */}
                    <div className="lg:col-span-2">
                        <Planta
                            edificio={nombreEdificio}
                            piso={piso?.nombre}
                            ubicaciones={ubicaciones}
                            ubicacionActivaId={ubicacionActiva?.id}
                            onSeleccionarUbicacion={setUbicacionActiva}
                            onVolver={volverAtras}
                            onSeleccionarEspacio={(espacio) => {
                                const match = ubicaciones.find(
                                    (u) =>
                                        u.nombre
                                            .toLowerCase()
                                            .includes(
                                                (espacio?.nombre || "")
                                                    .trim()
                                                    .toLowerCase(),
                                            ) && espacio?.nombre,
                                );
                                if (match) setUbicacionActiva(match);
                            }}
                        />
                    </div>

                    {/* Columna Derecha (1/3): Panel de Ubicaciones y Extintores del Piso */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutro-100 flex flex-col h-full space-y-5">
                        <div>
                            <h3 className="text-titulo-2 font-bold text-neutro-900">
                                {isAdmin
                                    ? "Ubicaciones de la planta"
                                    : "Extintores en esta planta"}
                            </h3>
                            <p className="text-xs text-neutro-600 mt-0.5">
                                {nombreEdificio} — {piso?.nombre}
                            </p>
                        </div>

                        {/* Leyenda de colores de estado */}
                        <div className="flex flex-wrap items-center gap-3 text-xs bg-neutro-50 p-2.5 rounded-lg border border-neutro-100">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-neutro-900">
                                <span className="w-2.5 h-2.5 rounded-full bg-acento-500"></span>
                                Vigente
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-neutro-900">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                Por vencer
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-neutro-900">
                                <span className="w-2.5 h-2.5 rounded-full bg-primario-500"></span>
                                Vencido
                            </span>
                        </div>

                        {/* Si es Admin, mostramos qué ubicaciones están pendientes de coordenada */}
                        {isAdmin && sinUbicar.length > 0 && (
                            <div className="p-3 rounded-lg bg-primario-100/40 border border-primario-300/60">
                                <p className="text-xs font-bold text-primario-700">
                                    Por ubicar en el plano ({sinUbicar.length})
                                </p>
                                <p className="text-[11px] text-neutro-600 mt-0.5">
                                    Áreas registradas en este piso pendientes de
                                    coordenada en el mapa.
                                </p>
                            </div>
                        )}

                        {/* Lista de Ubicaciones y sus Extintores */}
                        {ubicaciones.length === 0 ? (
                            <div className="py-8 text-center text-xs text-neutro-600">
                                No hay ubicaciones registradas en este piso.
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                                {ubicaciones.map((ub) => {
                                    const seleccionada =
                                        ubicacionActiva?.id === ub.id;
                                    const etiquetaUbicacion =
                                        ub.nombre === "Cuarto de vigilancia"
                                            ? "Almacén 2"
                                            : ub.nombre;

                                    return (
                                        <div
                                            key={ub.id}
                                            onClick={() =>
                                                setUbicacionActiva(ub)
                                            }
                                            className={`p-3.5 rounded-xl border transition cursor-pointer ${
                                                seleccionada
                                                    ? "border-primario-500 bg-primario-100/20"
                                                    : "border-neutro-100 hover:bg-neutro-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <MapPin className="w-4 h-4 text-primario-700 shrink-0" />
                                                    <span className="text-sm font-bold text-neutro-900 truncate">
                                                        {etiquetaUbicacion}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutro-100 text-neutro-600 shrink-0">
                                                    {ub.tipo_area ===
                                                    "Vigilancia"
                                                        ? "Almacén"
                                                        : ub.tipo_area}
                                                </span>
                                            </div>

                                            {ub.extintores &&
                                            ub.extintores.length > 0 ? (
                                                <div className="space-y-2 mt-2 pt-2 border-t border-neutro-100">
                                                    {ub.extintores.map(
                                                        (ext) => {
                                                            const configEstado =
                                                                ESTILOS_ESTADO[
                                                                    ext.estado
                                                                ] ||
                                                                ESTILOS_ESTADO.vigente;

                                                            return (
                                                                <div
                                                                    key={ext.id}
                                                                    className="bg-white rounded-lg p-2.5 border border-neutro-100 text-xs space-y-1"
                                                                >
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <span className="font-bold text-neutro-900 inline-flex items-center gap-1">
                                                                            <Flame className="w-3.5 h-3.5 text-primario-500" />
                                                                            {
                                                                                ext.etiqueta
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${configEstado.badge}`}
                                                                        >
                                                                            {
                                                                                configEstado.texto
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap justify-between text-[11px] text-neutro-600">
                                                                        <span>
                                                                            Tipo:{" "}
                                                                            <strong className="text-neutro-900">
                                                                                {
                                                                                    ext.tipo
                                                                                }
                                                                            </strong>{" "}
                                                                            (
                                                                            {
                                                                                ext.capacidad
                                                                            }
                                                                            )
                                                                        </span>
                                                                        <span>
                                                                            Estatus:{" "}
                                                                            <strong className="text-neutro-900">
                                                                                {
                                                                                    ext.estatus
                                                                                }
                                                                            </strong>
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-neutro-600">
                                                                        Próxima
                                                                        revisión:{" "}
                                                                        {formatearFecha(
                                                                            ext.vencimiento,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-neutro-600 italic">
                                                    Sin extintores asignados en
                                                    esta ubicación.
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
