import React, { useRef, useState } from "react";
import PlantaBaja from "@/Components/Mapa/Planos/PlantaBaja";
import PlantaAlta from "@/Components/Mapa/Planos/PlantaAlta";
import NivelesEdificioE from "@/Components/Mapa/Planos/Niveles";
import {
    FireExtinguisher,
    Crosshair,
    X,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

const normalizarTexto = (texto = "") =>
    texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\blab\.?\b/g, "laboratorio")
        .trim();

export default function Planta({
    edificio,
    piso,
    ubicaciones = [],
    extintorActivoId = null,
    extintorParaColocar = null,
    onCancelarColocar,
    onSeleccionarExtintor,
    onVolver,
    onSeleccionarEspacio,
    isAdmin = false,
    onGuardarPosicion,
}) {
    const planoRef = useRef(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [errorZona, setErrorZona] = useState(null);

    const esNivelSuperiorE =
        ["Nivel 1", "Nivel 2", "Nivel 3"].includes(piso) &&
        edificio === "Edificio E";

    const esPlantaBajaOUnica = piso === "Planta baja" || piso === "Nivel único";

    const esPlantaAltaABCD =
        (piso === "Nivel 1" || piso === "Planta alta") &&
        edificio !== "Edificio E";

    const esCafeteria =
        edificio === "Cafetería y SUM" || edificio === "Cafetería";

    // Mantiene la caja de coordenadas (planoRef) pegada al borde real del SVG sin espacio sobrante
    const claseAspectoPlano = esCafeteria
        ? "max-w-[580px] aspect-[668/530]"
        : esPlantaBajaOUnica
          ? "max-w-[816px] aspect-[876/493]"
          : "max-w-[824px] aspect-[876/489]";

    const obtenerColorExtintor = (estado) => {
        if (estado === "vencido") {
            return "bg-primario-500 border-white text-white";
        }
        if (estado === "por_vencer") {
            return "bg-amber-500 border-white text-white";
        }
        return "bg-acento-500 border-white text-white";
    };

    const extintoresUbicados = ubicaciones.flatMap((ub) => {
        if (
            !ub.posicion ||
            typeof ub.posicion !== "object" ||
            Array.isArray(ub.posicion)
        ) {
            return [];
        }

        return (ub.extintores || [])
            .map((ext) => {
                const coord = ub.posicion[String(ext.id)];
                if (
                    coord &&
                    typeof coord.x === "number" &&
                    typeof coord.y === "number"
                ) {
                    return {
                        ...ext,
                        ubicacionId: ub.id,
                        ubicacionNombre: ub.nombre,
                        coord,
                    };
                }
                return null;
            })
            .filter(Boolean);
    });

    const calcularPorcentaje = (clientX, clientY) => {
        if (!planoRef.current) return null;
        const rect = planoRef.current.getBoundingClientRect();
        const rawX = ((clientX - rect.left) / rect.width) * 100;
        const rawY = ((clientY - rect.top) / rect.height) * 100;

        return {
            x: Number(Math.max(2, Math.min(98, rawX)).toFixed(2)),
            y: Number(Math.max(2, Math.min(98, rawY)).toFixed(2)),
        };
    };

    // Verifica que el punto (clientX, clientY) corresponda a la ubicación asignada del extintor
    const validarZonaDestino = (clientX, clientY, ubicacionId) => {
        const ubicacion = ubicaciones.find(
            (u) => Number(u.id) === Number(ubicacionId),
        );
        if (!ubicacion) return { valido: true };

        const nombreUbicacion = normalizarTexto(ubicacion.nombre);
        const tipoArea = normalizarTexto(ubicacion.tipo_area);

        // Si es exterior o patio abierto, se permite en todo el plano
        if (
            nombreUbicacion.includes("exterior") ||
            tipoArea.includes("exterior")
        ) {
            return { valido: true };
        }

        // Busca en el elemento tocado o en su contenedor <g data-zona="...">
        const elementos = document.elementsFromPoint(clientX, clientY);
        const nodoZona = elementos
            .map((el) => el.closest?.("[data-zona]"))
            .find(Boolean);
        const zonaDetectadaRaw = nodoZona?.getAttribute("data-zona") || "";
        const zonaDetectada = normalizarTexto(zonaDetectadaRaw);

        // Caso Pasillo: debe caer en un espacio marcado como "pasillo" o en el área gris abierta
        if (
            nombreUbicacion.includes("pasillo") ||
            tipoArea.includes("pasillo")
        ) {
            if (!zonaDetectada || zonaDetectada === "pasillo") {
                return { valido: true };
            }
            return {
                valido: false,
                mensaje: `Este extintor pertenece a "${ubicacion.nombre}", no puede colocarlo dentro de "${zonaDetectadaRaw}".`,
            };
        }

        // Si soltó en el área gris vacía (pasillo) pero el extintor pertenece a un cuarto específico
        if (!zonaDetectada) {
            return {
                valido: false,
                mensaje: `Este extintor pertenece a "${ubicacion.nombre}". Suéltelo dentro de esa área en el plano.`,
            };
        }

        // Alias conocidos entre nombres de BD y etiquetas del SVG
        const esVigilanciaOAlmacen2 =
            (nombreUbicacion.includes("vigilancia") ||
                nombreUbicacion.includes("almacen 2")) &&
            (zonaDetectada.includes("vigilancia") ||
                zonaDetectada.includes("almacen 2"));

        const esCafeteriaOCocina =
            (nombreUbicacion.includes("cocina") ||
                nombreUbicacion.includes("cafeteria")) &&
            (zonaDetectada.includes("cocina") ||
                zonaDetectada.includes("cafeteria"));

        const esBano =
            nombreUbicacion.includes("bano") && zonaDetectada.includes("bano");

        const coincide =
            esVigilanciaOAlmacen2 ||
            esCafeteriaOCocina ||
            esBano ||
            zonaDetectada.includes(nombreUbicacion) ||
            nombreUbicacion.includes(zonaDetectada);

        if (!coincide) {
            return {
                valido: false,
                mensaje: `Ubicación incorrecta: este extintor pertenece a "${ubicacion.nombre}", no a "${zonaDetectadaRaw}".`,
            };
        }

        return { valido: true };
    };

    const intentarGuardar = (clientX, clientY, ubicacionId, extintorId) => {
        const validacion = validarZonaDestino(clientX, clientY, ubicacionId);

        if (!validacion.valido) {
            setErrorZona(validacion.mensaje);
            setTimeout(() => setErrorZona(null), 4500);
            return false;
        }

        setErrorZona(null);
        const coords = calcularPorcentaje(clientX, clientY);
        if (coords) {
            onGuardarPosicion?.(ubicacionId, extintorId, coords);
            return true;
        }
        return false;
    };

    const manejarDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);

        if (!isAdmin) return;

        const dataRaw = e.dataTransfer.getData("application/json");
        if (!dataRaw) return;

        const { ubicacionId, extintorId } = JSON.parse(dataRaw);
        if (!ubicacionId || !extintorId) return;

        intentarGuardar(e.clientX, e.clientY, ubicacionId, extintorId);
    };

    const manejarClickPlano = (e) => {
        if (!isAdmin || !extintorParaColocar) return;

        const guardado = intentarGuardar(
            e.clientX,
            e.clientY,
            extintorParaColocar.ubicacionId,
            extintorParaColocar.id,
        );

        if (guardado) {
            onCancelarColocar?.();
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutro-100 p-4 sm:p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-neutro-100">
                <div>
                    <h2 className="text-titulo-2 font-bold text-neutro-900">
                        {edificio}
                    </h2>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primario-100 text-primario-700">
                        {piso}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onVolver}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutro-100 hover:border-primario-300 hover:bg-primario-100/40 text-xs font-semibold text-neutro-900 hover:text-primario-700 shadow-xs transition-all cursor-pointer shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 text-neutro-600 group-hover:text-primario-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Volver</span>
                </button>
            </div>

            {/* Alerta cuando se intenta soltar en una zona que no corresponde */}
            {errorZona && (
                <div className="w-full mb-3 p-2.5 rounded-lg bg-primario-100 border border-primario-300 flex items-center justify-between gap-2 text-xs text-primario-900">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primario-600 shrink-0" />
                        <span className="font-medium">{errorZona}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setErrorZona(null)}
                        className="p-0.5 rounded hover:bg-primario-200/60"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Banner guía cuando hay un extintor seleccionado para colocar con toque */}
            {isAdmin && extintorParaColocar && (
                <div className="w-full mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 min-w-0">
                        <Crosshair className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                        <span className="truncate">
                            Toque dentro de{" "}
                            <strong>
                                {extintorParaColocar.ubicacionNombre}
                            </strong>{" "}
                            para ubicar{" "}
                            <strong>{extintorParaColocar.etiqueta}</strong>
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelarColocar}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 shrink-0"
                    >
                        <X className="w-3.5 h-3.5" />
                        Cancelar
                    </button>
                </div>
            )}

            {/* Marco exterior visual */}
            <div
                className={`w-full flex justify-center items-center rounded-xl p-2 sm:p-3 border overflow-hidden transition-all duration-200 ${
                    isDraggingOver || extintorParaColocar
                        ? "bg-primario-50/20 border-primario-500 ring-2 ring-primario-500"
                        : "bg-neutro-50 border-neutro-100"
                }`}
            >
                {/* Contenedor interno exacto del SVG: referencia única para Drop, Click y Pines */}
                <div
                    ref={planoRef}
                    onClick={manejarClickPlano}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={manejarDrop}
                    className={`relative w-full ${claseAspectoPlano} ${
                        isDraggingOver || extintorParaColocar
                            ? "cursor-crosshair"
                            : ""
                    }`}
                >
                    {esPlantaBajaOUnica && (
                        <PlantaBaja
                            edificio={edificio}
                            onSeleccionarEspacio={
                                extintorParaColocar
                                    ? undefined
                                    : onSeleccionarEspacio
                            }
                        />
                    )}

                    {esPlantaAltaABCD && (
                        <PlantaAlta
                            edificio={edificio}
                            onSeleccionarEspacio={
                                extintorParaColocar
                                    ? undefined
                                    : onSeleccionarEspacio
                            }
                        />
                    )}

                    {esNivelSuperiorE && (
                        <NivelesEdificioE
                            piso={piso}
                            onSeleccionarEspacio={
                                extintorParaColocar
                                    ? undefined
                                    : onSeleccionarEspacio
                            }
                        />
                    )}

                    {!esPlantaBajaOUnica &&
                        !esPlantaAltaABCD &&
                        !esNivelSuperiorE && (
                            <div className="w-full h-full flex items-center justify-center text-neutro-600 text-sm">
                                Plano de {piso} en preparación
                            </div>
                        )}

                    {/* Pines individuales por cada extintor ubicado */}
                    {extintoresUbicados.map((ext) => {
                        const colorClase = obtenerColorExtintor(ext.estado);
                        const activo = extintorActivoId === ext.id;

                        return (
                            <button
                                key={ext.id}
                                type="button"
                                draggable={isAdmin}
                                onDragStart={(e) => {
                                    if (!isAdmin) return;
                                    e.stopPropagation();
                                    e.dataTransfer.setData(
                                        "application/json",
                                        JSON.stringify({
                                            ubicacionId: ext.ubicacionId,
                                            extintorId: ext.id,
                                        }),
                                    );
                                    e.dataTransfer.effectAllowed = "move";
                                }}
                                onClick={(e) => {
                                    if (extintorParaColocar) return;
                                    e.stopPropagation();
                                    onSeleccionarExtintor?.(ext);
                                }}
                                style={{
                                    left: `${ext.coord.x}%`,
                                    top: `${ext.coord.y}%`,
                                }}
                                title={`${ext.etiqueta} — ${ext.ubicacionNombre} (${ext.tipo} ${ext.capacidad})`}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center transition-transform ${colorClase} ${
                                    activo
                                        ? "scale-125 ring-2 ring-neutro-900 z-20"
                                        : "hover:scale-110 z-10"
                                } ${
                                    isAdmin
                                        ? "cursor-grab active:cursor-grabbing"
                                        : "cursor-pointer"
                                }`}
                            >
                                <FireExtinguisher className="w-4 h-4 stroke-[2.2]" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
