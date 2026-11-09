import React from "react";

// 1. DIBUJOS BASE (Extraemos los rectángulos de cada edificio 1 sola vez)
const BaseA = () => (
    <>
        <rect
            width="707.887"
            height="391.91"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 4 353.921)"
            fill="#F1F0F0"
            shapeRendering="crispEdges"
        />
        <rect
            x="3.46418"
            width="703.887"
            height="387.91"
            rx="6"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 4.46405 355.652)"
            stroke="#D7D4D4"
            strokeWidth="4"
            shapeRendering="crispEdges"
        />
        <rect
            width="168.544"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 21.3209 353.921)"
            fill="#FDEDED"
        />
        <rect
            opacity="0.38"
            width="52.4181"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 171.478 267.235)"
            fill="#1C9691"
        />
        <rect
            width="112.901"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 221.065 238.608)"
            fill="#FDEDED"
        />
        <rect
            width="104.836"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 323.032 179.742)"
            fill="#F1F0F0"
        />
        <rect
            width="112.094"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 418.016 124.909)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 519.285 66.446)"
            fill="#FDEDED"
        />
        <rect
            width="168.544"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 214.843 465.641)"
            fill="#FDEDED"
        />
        <rect
            opacity="0.38"
            width="52.4181"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 365 378.955)"
            fill="#1C9691"
        />
        <rect
            width="112.901"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 414.587 350.328)"
            fill="#F9CACB"
        />
        <rect
            width="104.836"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 516.554 291.463)"
            fill="#928586"
        />
        <rect
            width="112.094"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 611.538 236.629)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 712.806 178.166)"
            fill="#FDEDED"
        />
    </>
);

// Edificio B - Planta baja (también la usa el Edificio D)
const BaseBD = () => (
    <>
        <rect
            width="707.887"
            height="392.271"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0 353.92)"
            fill="#F1F0F0"
            shapeRendering="crispEdges"
        />
        <rect
            x="3.46418"
            width="703.887"
            height="388.271"
            rx="6"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0.464046 355.652)"
            stroke="#D7D4D4"
            strokeWidth="4"
            shapeRendering="crispEdges"
        />
        <rect
            width="112.901"
            height="148.635"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 118.58 295.464)"
            fill="#FDEDED"
        />
        <rect
            width="72.4092"
            height="71.8841"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 286.924 274.65)"
            fill="#928586"
        />
        <rect
            width="72.4092"
            height="72.0713"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 220.779 236.464)"
            fill="#F9CACB"
        />
        <rect
            width="72.4092"
            height="149.006"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 354.318 159.372)"
            fill="#FDEDED"
        />
        <rect
            width="112.094"
            height="148.635"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 17.3209 353.92)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.635"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 521.187 63.0388)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.635"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 421.208 120.757)"
            fill="#FDEDED"
        />
        <rect
            width="344.751"
            height="148.635"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 210.999 465.731)"
            fill="#FDEDED"
        />
        <rect
            width="338.292"
            height="147.881"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 514.417 291.322)"
            fill="#FDEDED"
        />
    </>
);

// Edificio B - Planta alta (oficina turquesa grande + franja gris)
const BaseBAlta = () => (
    <>
        <rect
            width="707.887"
            height="391.98"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0 353.92)"
            fill="#F1F0F0"
            shapeRendering="crispEdges"
        />
        <rect
            x="3.46418"
            width="703.887"
            height="387.98"
            rx="6"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 0.464046 355.652)"
            stroke="#D7D4D4"
            strokeWidth="4"
            shapeRendering="crispEdges"
        />
        <rect
            width="112.901"
            height="148.49"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 118.58 295.464)"
            fill="#FDEDED"
        />
        <rect
            width="72.4092"
            height="71.8138"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 286.859 274.613)"
            fill="#928586"
        />
        <rect
            width="72.4092"
            height="72.0008"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 220.778 236.464)"
            fill="#F9CACB"
        />
        <rect
            opacity="0.38"
            width="149.646"
            height="148.864"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 287.668 197.849)"
            fill="#1C9691"
        />
        <rect
            width="112.094"
            height="148.49"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 17.3208 353.92)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.49"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 521.187 63.0388)"
            fill="#FDEDED"
        />
        <rect
            width="110.616"
            height="148.49"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 421.208 120.757)"
            fill="#FDEDED"
        />
        <rect
            width="687.887"
            height="148.49"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 210.873 465.658)"
            fill="#D7D4D4"
        />
    </>
);

const BaseC = () => (
    <>
        <rect
            width="707.887"
            height="391.91"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 4 353.92)"
            fill="#F1F0F0"
            shapeRendering="crispEdges"
        />
        <rect
            x="3.46418"
            width="703.887"
            height="387.91"
            rx="6"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 4.46405 355.652)"
            stroke="#D7D4D4"
            strokeWidth="4"
            shapeRendering="crispEdges"
        />
        <rect
            width="113.229"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 220.78 238.773)"
            fill="#FDEDED"
        />
        <rect
            width="105.141"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 323.043 179.736)"
            fill="#F1F0F0"
        />
        <rect
            width="228.349"
            height="148.077"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 418.071 124.877)"
            fill="#FDEDED"
        />
        <rect
            width="112.42"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 19.0573 355.227)"
            fill="#FDEDED"
        />
        <rect
            width="110.937"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 120.62 296.595)"
            fill="#FDEDED"
        />
        <rect
            width="226.735"
            height="148.833"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 213.65 465.952)"
            fill="#FDEDED"
        />
        <rect
            width="113.229"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 414.302 350.493)"
            fill="#F9CACB"
        />
        <rect
            width="105.141"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 516.565 291.456)"
            fill="#928586"
        />
        <rect
            width="112.42"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 611.825 236.463)"
            fill="#FDEDED"
        />
        <rect
            width="110.937"
            height="148.455"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 713.388 177.83)"
            fill="#FDEDED"
        />
    </>
);

const BaseE = () => (
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
        <rect
            width="146.15"
            height="382.112"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 8.89551 354.795)"
            fill="#FDEDED"
        />
        <rect
            opacity="0.38"
            width="46.7791"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 139.71 279.276)"
            fill="#1C9691"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 184.471 253.435)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 273.692 201.928)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 362.912 150.421)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 452.132 98.9141)"
            fill="#FDEDED"
        />
        <rect
            width="46.7791"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 337.649 393.546)"
            fill="#F9CACB"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 382.411 367.705)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 471.631 316.198)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 560.852 264.692)"
            fill="#FDEDED"
        />
        <rect
            width="98.1147"
            height="153.556"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 650.072 213.185)"
            fill="#FDEDED"
        />
        <rect
            width="84.0973"
            height="122.472"
            rx="8"
            transform="matrix(0.866044 -0.499967 0.866044 0.499967 653.777 112.317)"
            fill="#D9D9D9"
        />
    </>
);

// CONFIG_EDIFICIOS
const CONFIG_EDIFICIOS = {
    "Edificio A": {
        viewBox: "0 -240 962 800",
        ComponenteBase: BaseA,
        niveles: [
            { nombre: "Planta baja", y: 0 },
            { nombre: "Nivel 1", y: -220 },
        ],
    },
    "Edificio B": {
        viewBox: "0 -240 962 800",
        ComponenteBase: BaseBD,
        niveles: [
            { nombre: "Planta baja", y: 0, Componente: BaseBD },
            { nombre: "Nivel 1", y: -220, Componente: BaseBAlta },
        ],
    },
    "Edificio C": {
        viewBox: "0 -240 962 800",
        ComponenteBase: BaseC,
        niveles: [
            { nombre: "Planta baja", y: 0 },
            { nombre: "Nivel 1", y: -220 },
        ],
    },
    "Edificio D": {
        viewBox: "0 -240 962 800",
        ComponenteBase: BaseBD,
        niveles: [
            { nombre: "Planta baja", y: 0, Componente: BaseBD },
            { nombre: "Nivel 1", y: -220, Componente: BaseBAlta },
        ],
    },
    "Edificio E": {
        viewBox: "0 -560 962 1120",
        ComponenteBase: BaseE,
        niveles: [
            { nombre: "Planta baja", y: 0 },
            { nombre: "Nivel 1", y: -180 },
            { nombre: "Nivel 2", y: -360 },
            { nombre: "Nivel 3", y: -540 },
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

        const { viewBox, ComponenteBase, niveles } = config;

        return (
            <svg
                width="100%"
                height="auto"
                viewBox={viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-h-[500px] drop-shadow-md overflow-visible"
            >
                {/* Definición de la sombra reutilizable */}
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

                {/* 3. MAPEO AUTOMÁTICO: cada nivel usa su propio componente o, si no tiene, la base del edificio */}
                {niveles.map((nivel) => {
                    const Componente = nivel.Componente || ComponenteBase;
                    return (
                        <g
                            key={nivel.nombre}
                            transform={
                                nivel.y !== 0
                                    ? `translate(0, ${nivel.y})`
                                    : undefined
                            }
                            filter="url(#shadow)"
                            onClick={() => onSelectPiso(nivel.nombre)}
                            className="cursor-pointer hover:opacity-75 transition-all duration-300"
                        >
                            <Componente />
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-neutral-100 p-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                        Mapa de la Institucion
                    </h2>
                    <span className="inline-block mt-1 text-xs text-neutral-500">
                        {edificio} - Selecciona un nivel
                    </span>
                </div>
                <button
                    onClick={onVolver}
                    className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3.5 py-2 rounded-lg transition-colors"
                >
                    ← Volver al croquis
                </button>
            </div>

            <div className="w-full flex justify-center items-center min-h-[440px] bg-[#FAF9F9] rounded-xl p-4 border border-neutral-100 overflow-hidden">
                {renderizarEdificio3D()}
            </div>
        </div>
    );
}
