import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TablaTiposExtintor from "./TablaTiposExtintor";
import ComoUsarExtintor from "./ComoUsarExtintor";
import TarjetaTipoFuego from "./TarjetaTipoFuego";
import MetodoTapa from "./MetodoTapa";
import { clasesFuego } from "../../data/aprende";

export default function HistorialPublicoView() {
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [claseEnfocada, setClaseEnfocada] = useState(null);
    const tarjetasRef = useRef({});

    const abrirGuiaEnClase = (claseId = null) => {
        setClaseEnfocada(claseId);
        setMostrarDetalles(true);
    };

    const volverAVistaGeneral = () => {
        setMostrarDetalles(false);
        setClaseEnfocada(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (!mostrarDetalles) return;

        if (claseEnfocada) {
            requestAnimationFrame(() => {
                const tarjeta = tarjetasRef.current[claseEnfocada];
                if (tarjeta) {
                    tarjeta.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [mostrarDetalles, claseEnfocada]);

    return (
        <div className="space-y-5 font-sans">
            {!mostrarDetalles ? (
                <>
                    <div>
                        <h1 className="text-titulo-1 font-bold text-neutro-900">
                            Aprende
                        </h1>
                        <p className="text-xs text-neutro-600 mt-0.5">
                            Información según el tipo de extintor y clases de
                            fuego
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        <div className="lg:col-span-2 min-w-0">
                            <TablaTiposExtintor
                                onSelectClase={abrirGuiaEnClase}
                            />
                        </div>

                        <div className="flex flex-col justify-between gap-4">
                            <ComoUsarExtintor
                                onSelectClase={abrirGuiaEnClase}
                            />

                            <button
                                type="button"
                                onClick={() => abrirGuiaEnClase(null)}
                                className="w-full bg-primario-500 hover:bg-primario-700 text-white font-semibold text-etiqueta py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
                            >
                                Ver guía completa
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div className="sticky top-0 z-30 -mx-4 px-4 md:-mx-8 md:px-8 py-2.5 sm:py-3 bg-neutro-50/95 backdrop-blur-sm border-b border-neutro-100/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
                        <div>
                            <span className="text-primario-500 text-[10px] font-bold uppercase tracking-wider block">
                                Antes de que lo necesite
                            </span>
                            <h1 className="text-lg sm:text-titulo-1 font-bold text-neutro-900 leading-tight">
                                Guía de tipos de fuego y extintores
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={volverAVistaGeneral}
                            className="group inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-neutro-100 hover:border-primario-300 hover:bg-primario-100/40 text-xs font-semibold text-neutro-900 hover:text-primario-700 shadow-sm transition-all cursor-pointer shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 text-neutro-600 group-hover:text-primario-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            <span>Volver a la tabla</span>
                        </button>
                    </div>

                    <div>
                        {clasesFuego.map((clase) => (
                            <div
                                className="scroll-mt-36 sm:scroll-mt-24"
                                key={clase.id}
                                ref={(el) => {
                                    if (el) {
                                        tarjetasRef.current[clase.id] = el;
                                    } else {
                                        delete tarjetasRef.current[clase.id];
                                    }
                                }}
                            >
                                <TarjetaTipoFuego
                                    letra={clase.letra}
                                    titulo={clase.titulo}
                                    destacada={claseEnfocada === clase.id}
                                >
                                    {/* Identificación */}
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                            Identificación
                                        </h4>
                                        <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                            {clase.identificacion}
                                        </div>
                                    </div>

                                    {/* Combustibles */}
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                            Combustibles
                                        </h4>
                                        <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                            {clase.combustibles}
                                        </div>
                                    </div>

                                    {/* Extintores recomendados */}
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                            Extintores recomendados
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            {clase.extintoresRecomendados.map(
                                                (ext, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg"
                                                    >
                                                        <strong className="font-semibold">
                                                            {ext.nombre}:{" "}
                                                        </strong>
                                                        {ext.desc}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Áreas comunes */}
                                    {clase.areasComunes && (
                                        <div>
                                            <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                                Áreas comunes
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                {Array.isArray(
                                                    clase.areasComunes,
                                                ) ? (
                                                    clase.areasComunes.map(
                                                        (area, index) => (
                                                            <div
                                                                key={index}
                                                                className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg"
                                                            >
                                                                <strong className="font-semibold">
                                                                    {
                                                                        area.nombre
                                                                    }
                                                                </strong>
                                                                <br />
                                                                <span className="text-[#6D6162]">
                                                                    {area.desc}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                                        {clase.areasComunes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ubicación */}
                                    {clase.ubicacion && (
                                        <div>
                                            <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                                Ubicación
                                            </h4>
                                            <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                                {clase.ubicacion}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cómo se usa y seguridad */}
                                    {clase.comoSeUsa &&
                                        clase.comoSeUsa.length > 0 && (
                                            <div>
                                                <h4 className="text-[13px] text-[#6D6162] mb-1.5">
                                                    Cómo se usa y seguridad
                                                </h4>
                                                <div className="flex flex-col gap-2">
                                                    {clase.comoSeUsa.map(
                                                        (paso, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex bg-[#EAEAEA] py-3 px-4 rounded-lg items-start"
                                                            >
                                                                <span className="text-[#F24C52] font-bold text-xl mr-4 leading-none">
                                                                    {index + 1}
                                                                </span>
                                                                <p className="text-[15px] text-[#272222]">
                                                                    {paso}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Alertas */}
                                    {clase.alertas &&
                                        clase.alertas.map((alerta, index) => (
                                            <div
                                                key={index}
                                                className="mt-2 p-4 bg-[#FDF2F2] rounded-lg flex items-start"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-[#F24C52] mr-3 mt-0.5 flex-shrink-0"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                <p className="text-[15px] text-[#F24C52]">
                                                    <strong className="font-bold">
                                                        {alerta.tipo}{" "}
                                                    </strong>
                                                    {alerta.texto}
                                                </p>
                                            </div>
                                        ))}
                                </TarjetaTipoFuego>
                            </div>
                        ))}
                    </div>

                    <MetodoTapa />
                </div>
            )}
        </div>
    );
}
