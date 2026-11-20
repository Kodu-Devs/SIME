import { useRef, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PublicLayout from "@/Layouts/PublicLayout";
import Planta from "@/Components/Mapa/Planta";
import {
    MapPin,
    Flame,
    GripVertical,
    X,
    AlertTriangle,
    Crosshair,
} from "lucide-react";

const ESTILOS_ESTADO = {
    vigente: {
        texto: "Vigente",
        badge: "bg-acento-500/15 text-acento-500 border-acento-500/30",
        punto: "bg-acento-500",
        hex: "#10b981",
    },
    por_vencer: {
        texto: "Por vencer",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        punto: "bg-amber-500",
        hex: "#f59e0b",
    },
    vencido: {
        texto: "Vencido",
        badge: "bg-primario-100 text-primario-700 border-primario-300",
        punto: "bg-primario-500",
        hex: "#ef4444",
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

    const contenedorPlanoRef = useRef(null);
    const [extintorActivoId, setExtintorActivoId] = useState(null);
    const [extintorAQuitar, setExtintorAQuitar] = useState(null);
    const [extintorParaColocar, setExtintorParaColocar] = useState(null);

    const tienePosicion = (ub, extId) => {
        if (!ub?.posicion || typeof ub.posicion !== "object") return false;
        const coord = ub.posicion[String(extId)];
        return (
            coord && typeof coord.x === "number" && typeof coord.y === "number"
        );
    };

    const extintoresSinUbicar = ubicaciones.flatMap((ub) =>
        (ub.extintores || [])
            .filter((ext) => !tienePosicion(ub, ext.id))
            .map((ext) => ({
                ...ext,
                ubicacionId: ub.id,
                ubicacionNombre:
                    ub.nombre === "Cuarto de vigilancia"
                        ? "Almacén 2"
                        : ub.nombre,
            })),
    );

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

    const handleGuardarPosicion = (ubicacionId, extintorId, { x, y }) => {
        router.put(
            route("mapa.ubicacion.posicion", ubicacionId),
            { extintor_id: extintorId, x, y },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (err) => {
                    console.error("Error al guardar posición:", err);
                },
            },
        );
    };

    const confirmarQuitarPosicion = () => {
        if (!extintorAQuitar) return;
        handleGuardarPosicion(extintorAQuitar.ubicacionId, extintorAQuitar.id, {
            x: null,
            y: null,
        });
        if (extintorActivoId === extintorAQuitar.id) {
            setExtintorActivoId(null);
        }
        if (extintorParaColocar?.id === extintorAQuitar.id) {
            setExtintorParaColocar(null);
        }
        setExtintorAQuitar(null);
    };

    const seleccionarParaColocarEnPlano = (ubicacionId, ext) => {
        if (!isAdmin) return;
        if (extintorParaColocar?.id === ext.id) {
            setExtintorParaColocar(null);
            return;
        }
        setExtintorParaColocar({
            ...ext,
            ubicacionId,
        });
        setExtintorActivoId(ext.id);
        contenedorPlanoRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const iniciarArrastreExtintor = (e, ubicacionId, ext) => {
        e.stopPropagation();
        setExtintorParaColocar(null);
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
                ubicacionId,
                extintorId: ext.id,
            }),
        );
        e.dataTransfer.effectAllowed = "move";

        const configEstado =
            ESTILOS_ESTADO[ext.estado] || ESTILOS_ESTADO.vigente;

        const ghost = document.createElement("div");
        ghost.id = "extintor-drag-ghost";
        ghost.style.cssText = `
            position: fixed;
            top: -100px;
            left: -100px;
            width: 34px;
            height: 34px;
            border-radius: 9999px;
            background-color: ${configEstado.hex};
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            pointer-events: none;
            z-index: 9999;
        `;

        ghost.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5"/>
                <path d="M9 18h8"/>
                <path d="M18 3h-3"/>
                <path d="M11 3a6 6 0 0 0-6 6v11"/>
                <path d="M5 13h4"/>
                <path d="M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z"/>
            </svg>
        `;

        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 17, 17);

        requestAnimationFrame(() => {
            ghost.remove();
        });
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
                    <div ref={contenedorPlanoRef} className="lg:col-span-2">
                        <Planta
                            edificio={nombreEdificio}
                            piso={piso?.nombre}
                            ubicaciones={ubicaciones}
                            extintorActivoId={extintorActivoId}
                            extintorParaColocar={extintorParaColocar}
                            onCancelarColocar={() =>
                                setExtintorParaColocar(null)
                            }
                            onSeleccionarExtintor={(ext) =>
                                setExtintorActivoId(ext.id)
                            }
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
                                if (match?.extintores?.[0]) {
                                    setExtintorActivoId(match.extintores[0].id);
                                }
                            }}
                            isAdmin={isAdmin}
                            onGuardarPosicion={handleGuardarPosicion}
                        />
                    </div>

                    {/* Columna Derecha (1/3): Panel de Ubicaciones y Extintores */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutro-100 flex flex-col h-full space-y-5">
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

                        {/* Extintores individuales pendientes por ubicar */}
                        {isAdmin && extintoresSinUbicar.length > 0 && (
                            <div className="p-3 rounded-lg bg-primario-100/40 border border-primario-300/60">
                                <p className="text-xs font-bold text-primario-700">
                                    Por ubicar en el plano (
                                    {extintoresSinUbicar.length})
                                </p>
                                <p className="text-[11px] text-neutro-600 mt-0.5 mb-3">
                                    Arrastra cada uno hacia su área en el plano
                                    o tócalo para ubicarlo.
                                </p>

                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {extintoresSinUbicar.map((ext) => {
                                        const configEstado =
                                            ESTILOS_ESTADO[ext.estado] ||
                                            ESTILOS_ESTADO.vigente;
                                        const enModoColocar =
                                            extintorParaColocar?.id === ext.id;

                                        return (
                                            <div
                                                key={ext.id}
                                                draggable={isAdmin}
                                                onDragStart={(e) =>
                                                    iniciarArrastreExtintor(
                                                        e,
                                                        ext.ubicacionId,
                                                        ext,
                                                    )
                                                }
                                                onClick={() =>
                                                    seleccionarParaColocarEnPlano(
                                                        ext.ubicacionId,
                                                        ext,
                                                    )
                                                }
                                                className={`p-2.5 border rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                                    enModoColocar
                                                        ? "bg-amber-50 border-amber-400 ring-1 ring-amber-400"
                                                        : "bg-white border-neutro-200 hover:border-primario-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <GripVertical className="w-4 h-4 text-neutro-400 shrink-0 hidden sm:block" />
                                                    <Crosshair className="w-4 h-4 text-primario-500 shrink-0 sm:hidden" />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-xs text-neutro-900 truncate">
                                                            {ext.etiqueta}
                                                        </p>
                                                        <p className="text-[11px] text-neutro-500 truncate">
                                                            {
                                                                ext.ubicacionNombre
                                                            }{" "}
                                                            • {ext.tipo}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${configEstado.badge}`}
                                                >
                                                    {enModoColocar
                                                        ? "Toca el mapa"
                                                        : configEstado.texto}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
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
                                    const etiquetaUbicacion =
                                        ub.nombre === "Cuarto de vigilancia"
                                            ? "Almacén 2"
                                            : ub.nombre;

                                    return (
                                        <div
                                            key={ub.id}
                                            className="p-3.5 rounded-xl border border-neutro-100 bg-neutro-50/40"
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
                                                            const ubicado =
                                                                tienePosicion(
                                                                    ub,
                                                                    ext.id,
                                                                );
                                                            const seleccionado =
                                                                extintorActivoId ===
                                                                ext.id;
                                                            const enModoColocar =
                                                                extintorParaColocar?.id ===
                                                                ext.id;

                                                            return (
                                                                <div
                                                                    key={ext.id}
                                                                    draggable={
                                                                        isAdmin
                                                                    }
                                                                    onDragStart={(
                                                                        e,
                                                                    ) => {
                                                                        if (
                                                                            !isAdmin
                                                                        )
                                                                            return;
                                                                        iniciarArrastreExtintor(
                                                                            e,
                                                                            ub.id,
                                                                            ext,
                                                                        );
                                                                    }}
                                                                    onClick={() => {
                                                                        if (
                                                                            isAdmin
                                                                        ) {
                                                                            seleccionarParaColocarEnPlano(
                                                                                ub.id,
                                                                                {
                                                                                    ...ext,
                                                                                    ubicacionNombre:
                                                                                        etiquetaUbicacion,
                                                                                },
                                                                            );
                                                                        } else {
                                                                            setExtintorActivoId(
                                                                                ext.id,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`rounded-lg p-2.5 border text-xs space-y-1.5 transition ${
                                                                        enModoColocar
                                                                            ? "bg-amber-50 border-amber-400 ring-1 ring-amber-400"
                                                                            : seleccionado
                                                                              ? "bg-white border-primario-500 ring-1 ring-primario-500"
                                                                              : "bg-white border-neutro-200 hover:border-neutro-300"
                                                                    } ${
                                                                        isAdmin
                                                                            ? "cursor-grab active:cursor-grabbing"
                                                                            : "cursor-pointer"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <span className="font-bold text-neutro-900 inline-flex items-center gap-1 min-w-0">
                                                                            {isAdmin && (
                                                                                <GripVertical className="w-3.5 h-3.5 text-neutro-400 shrink-0 hidden sm:inline" />
                                                                            )}
                                                                            <Flame className="w-3.5 h-3.5 text-primario-500 shrink-0" />
                                                                            <span className="truncate">
                                                                                {
                                                                                    ext.etiqueta
                                                                                }
                                                                            </span>
                                                                        </span>

                                                                        <div className="flex items-center gap-1 shrink-0">
                                                                            <span
                                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${configEstado.badge}`}
                                                                            >
                                                                                {
                                                                                    configEstado.texto
                                                                                }
                                                                            </span>

                                                                            {isAdmin &&
                                                                                ubicado && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) => {
                                                                                            e.stopPropagation();
                                                                                            setExtintorAQuitar(
                                                                                                {
                                                                                                    ...ext,
                                                                                                    ubicacionId:
                                                                                                        ub.id,
                                                                                                    ubicacionNombre:
                                                                                                        etiquetaUbicacion,
                                                                                                },
                                                                                            );
                                                                                        }}
                                                                                        title="Quitar extintor del plano"
                                                                                        className="p-1 rounded text-neutro-500 hover:text-primario-700 hover:bg-primario-100/60 transition-colors"
                                                                                    >
                                                                                        <X className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                )}
                                                                        </div>
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

            {/* Modal de Confirmación para quitar extintor del plano */}
            {extintorAQuitar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutro-200 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-amber-100 text-amber-700 shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutro-900">
                                    ¿Quitar extintor del plano?
                                </h3>
                                <p className="text-xs text-neutro-600 mt-1 leading-relaxed">
                                    Se eliminará únicamente la posición en el
                                    mapa del extintor{" "}
                                    <strong className="text-neutro-900">
                                        {extintorAQuitar.etiqueta}
                                    </strong>{" "}
                                    y regresará a{" "}
                                    <strong className="text-neutro-900">
                                        "Por ubicar en el plano"
                                    </strong>
                                    . El equipo no se eliminará del sistema.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setExtintorAQuitar(null)}
                                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutro-100 text-neutro-800 hover:bg-neutro-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarQuitarPosicion}
                                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-primario-500 text-white hover:bg-primario-700 transition-colors"
                            >
                                Sí, quitar del plano
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
