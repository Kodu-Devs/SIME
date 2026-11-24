import React from "react";
import { ArrowLeft } from "lucide-react";
import { DISTRIBUCIONES_PB } from "@/Components/Mapa/Planos/PlantaBaja";
import { DISTRIBUCIONES_PA } from "@/Components/Mapa/Planos/PlantaAlta";
import { DISTRIBUCIONES_NIVELES_E } from "@/Components/Mapa/Planos/Niveles";

const COLORES_ISO = {
    salon: { fill: "#FDEDED" },
    oficina: { fill: "#1C9691", opacity: 0.38 },
    bano: { fill: "#F9CACB" },
    escaleras: { fill: "#928586" },
    pasillo: { fill: "#F1F0F0" },
    taller: { fill: "#D7D4D4" },
    vestibulo: { fill: "#FDEDED", opacity: 0.38 },
};

const BaseIsometricaPlanta = ({ espacios = [] }) => (
    <>
        <rect
            width="707.887"
            height="391.91"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0 353.921)"
            fill="#F1F0F0"
            shapeRendering="crispEdges"
        />
        <rect
            x="3.46418"
            width="703.887"
            height="387.91"
            rx="6"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0.464046 355.653)"
            stroke="#D7D4D4"
            strokeWidth="4"
            shapeRendering="crispEdges"
        />
        <g transform="matrix(0.866044 -0.499967 0.866044 0.499967 0 353.921) scale(0.816479)">
            {espacios.map((espacio, index) => {
                const estilo = COLORES_ISO[espacio.tipo] || COLORES_ISO.salon;
                return (
                    <rect
                        key={index}
                        x={espacio.x}
                        y={espacio.y}
                        width={espacio.width}
                        height={espacio.height}
                        rx="9.8"
                        fill={espacio.fill || estilo.fill}
                        opacity={estilo.opacity}
                    />
                );
            })}
        </g>
    </>
);

const CONFIG_EDIFICIOS = {
    "Edificio A": {
        viewBox: "0 -240 962 800",
        niveles: [
            {
                nombre: "Planta baja",
                y: 0,
                espacios: DISTRIBUCIONES_PB["Edificio A"],
            },
            {
                nombre: "Nivel 1",
                y: -220,
                espacios: DISTRIBUCIONES_PA["Edificio A"],
            },
        ],
    },
    "Edificio B": {
        viewBox: "0 -240 962 800",
        niveles: [
            {
                nombre: "Planta baja",
                y: 0,
                espacios: DISTRIBUCIONES_PB["Edificio B"],
            },
            {
                nombre: "Nivel 1",
                y: -220,
                espacios: DISTRIBUCIONES_PA["Edificio B"],
            },
        ],
    },
    "Edificio C": {
        viewBox: "0 -240 962 800",
        niveles: [
            {
                nombre: "Planta baja",
                y: 0,
                espacios: DISTRIBUCIONES_PB["Edificio C"],
            },
            {
                nombre: "Nivel 1",
                y: -220,
                espacios: DISTRIBUCIONES_PA["Edificio C"],
            },
        ],
    },
    "Edificio D": {
        viewBox: "0 -240 962 800",
        niveles: [
            {
                nombre: "Planta baja",
                y: 0,
                espacios: DISTRIBUCIONES_PB["Edificio D"],
            },
            {
                nombre: "Nivel 1",
                y: -220,
                espacios: DISTRIBUCIONES_PA["Edificio D"],
            },
        ],
    },
    "Edificio E": {
        viewBox: "0 -560 962 1120",
        niveles: [
            {
                nombre: "Planta baja",
                y: 0,
                espacios: DISTRIBUCIONES_PB["Edificio E"],
            },
            {
                nombre: "Nivel 1",
                y: -180,
                espacios: DISTRIBUCIONES_NIVELES_E["Nivel 1"],
            },
            {
                nombre: "Nivel 2",
                y: -360,
                espacios: DISTRIBUCIONES_NIVELES_E["Nivel 2"],
            },
            {
                nombre: "Nivel 3",
                y: -540,
                espacios: DISTRIBUCIONES_NIVELES_E["Nivel 3"],
            },
        ],
    },
};

export default function VistaIsometrica({ edificio, onVolver, onSelectPiso }) {
    const renderizarEdificio3D = () => {
        const config = CONFIG_EDIFICIOS[edificio];

        if (!config) {
            return (
                <div className="w-full h-[400px] flex items-center justify-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
                    Vista 3D en desarrollo para {edificio}
                </div>
            );
        }

        const { viewBox, niveles } = config;

        return (
            <svg
                width="100%"
                height="auto"
                viewBox={viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-h-[500px] drop-shadow-md overflow-visible"
            >
                <defs>
                    <filter
                        id="shadow"
                        x="-50"
                        y="-50"
                        width="1061"
                        height="658"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="5" dy="5" />
                        <feGaussianBlur stdDeviation="3" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                </defs>

                {niveles.map((nivel) => (
                    <g
                        key={nivel.nombre}
                        transform={
                            nivel.y !== 0
                                ? `translate(0, ${nivel.y})`
                                : undefined
                        }
                        filter="url(#shadow)"
                        onClick={() => onSelectPiso(nivel.nombre)}
                        className="cursor-pointer hover:brightness-95 transition-all duration-200"
                    >
                        <BaseIsometricaPlanta espacios={nivel.espacios} />
                    </g>
                ))}
            </svg>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutro-100 p-4 sm:p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center gap-3 mb-4 pb-3 border-b border-neutro-100">
                <div>
                    <h2 className="text-titulo-2 font-bold text-neutro-900">
                        {edificio}
                    </h2>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primario-100 text-primario-700">
                        Selecciona un nivel
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onVolver}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutro-100 hover:border-primario-300 hover:bg-primario-100/40 text-xs font-semibold text-neutro-900 hover:text-primario-700 shadow-xs transition-all cursor-pointer shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 text-neutro-600 group-hover:text-primario-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Volver al croquis</span>
                </button>
            </div>

            <div className="w-full flex justify-center items-center min-h-[440px] bg-[#FAF9F9] rounded-xl p-4 border border-neutral-100 overflow-hidden">
                {renderizarEdificio3D()}
            </div>
        </div>
    );
}
