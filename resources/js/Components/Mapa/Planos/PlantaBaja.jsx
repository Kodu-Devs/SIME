import React from "react";
import Espacio from "@/Components/Mapa/Planos/Espacio";

const DISTRIBUCIONES_PB = {
    "Edificio A": [
        {
            x: 10,
            y: 10,
            width: 207.53,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 223,
            y: 10,
            width: 64.54,
            height: 194.5,
            tipo: "oficina",
            nombre: "Oficina de cómputo",
        },
        {
            x: 294,
            y: 10,
            width: 139.01,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 438.96,
            y: 10,
            width: 129.08,
            height: 194.5,
            tipo: "pasillo",
            nombre: "",
        },
        {
            x: 574,
            y: 10,
            width: 138.02,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 718,
            y: 10,
            width: 136.2,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 10,
            y: 280,
            width: 207.53,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 223,
            y: 280,
            width: 64.54,
            height: 194.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 294,
            y: 280,
            width: 139.01,
            height: 194.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 439,
            y: 280,
            width: 129.08,
            height: 194.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 574,
            y: 280,
            width: 138.02,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 718,
            y: 280,
            width: 136.2,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
    ],
    "Edificio C": [
        {
            x: 10,
            y: 10,
            width: 138.022,
            height: 194.5,
            tipo: "salon",
            nombre: "Lab. Programación",
        },
        {
            x: 154,
            y: 10,
            width: 136.202,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 296,
            y: 10,
            width: 139.015,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 441.071,
            y: 10,
            width: 129.086,
            height: 194.5,
            tipo: "pasillo",
            nombre: "Pasillo",
        },
        {
            x: 576,
            y: 10,
            width: 280.352,
            height: 194.99,
            tipo: "salon",
            nombre: "Auditorio",
        },
        {
            x: 10,
            y: 279,
            width: 278.371,
            height: 194.995,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 294,
            y: 280,
            width: 139.015,
            height: 194.5,
            tipo: "bano",
            nombre: "Baño",
        },
        {
            x: 439,
            y: 280,
            width: 129.086,
            height: 194.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 574,
            y: 280,
            width: 138.022,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 718,
            y: 280,
            width: 136.202,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
    ],
    "Edificio B": [
        {
            x: 10,
            y: 10,
            width: 138.02,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 154,
            y: 10,
            width: 139.01,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 299,
            y: 10,
            width: 89.15,
            height: 94.31,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 299,
            y: 110,
            width: 89.15,
            height: 94.06,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 481,
            y: 10,
            width: 89.15,
            height: 194.98,
            tipo: "salon",
            nombre: "Pasillo",
        },
        {
            x: 575,
            y: 10,
            width: 136.2,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 717,
            y: 10,
            width: 140,
            height: 195,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 10,
            y: 280,
            width: 424.49,
            height: 194.5,
            tipo: "taller",
            nombre: "Taller automotriz",
        },
        {
            x: 440,
            y: 280,
            width: 416.54,
            height: 193.51,
            tipo: "taller",
            nombre: "Taller de robótica",
        },
    ],
    "Edificio D": [
        {
            x: 10,
            y: 10,
            width: 138.02,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 154,
            y: 10,
            width: 139.01,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 299,
            y: 10,
            width: 89.15,
            height: 94.31,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 299,
            y: 110,
            width: 89.15,
            height: 94.06,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 481,
            y: 10,
            width: 89.15,
            height: 194.98,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 575,
            y: 10,
            width: 136.2,
            height: 194.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 717,
            y: 10,
            width: 140,
            height: 195,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 10,
            y: 280,
            width: 424.49,
            height: 194.5,
            tipo: "taller",
            nombre: "Taller",
        },
        {
            x: 440,
            y: 280,
            width: 416.54,
            height: 193.51,
            tipo: "taller",
            nombre: "Taller",
        },
    ],
    "Edificio E": [
        {
            x: 6,
            y: 6,
            width: 179,
            height: 468,
            tipo: "vestibulo",
            nombre: "Auditorio",
        },
        {
            x: 191,
            y: 6,
            width: 57.2937,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 254,
            y: 6,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 1",
        },
        {
            x: 380,
            y: 6,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 2",
        },
        {
            x: 507,
            y: 6,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 3",
        },
        {
            x: 633,
            y: 6,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 4",
        },
        {
            x: 191,
            y: 278,
            width: 57.2937,
            height: 196.5,
            tipo: "bano",
            nombre: "Baño",
        },
        {
            x: 254,
            y: 278,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 5",
        },
        {
            x: 380,
            y: 278,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 6",
        },
        {
            x: 507,
            y: 278,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 7",
        },
        {
            x: 633,
            y: 278,
            width: 120.168,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón 8",
        },
        {
            x: 759,
            y: 165,
            width: 103,
            height: 150,
            tipo: "escaleras",
            nombre: "Escaleras",
            fill: "#D9D9D9",
        },
    ],
    Almacén: [
        {
            x: 10,
            y: 10,
            width: 856,
            height: 460,
            tipo: "taller",
            nombre: "Almacén general",
        },
    ],
    Almacen: [
        {
            x: 10,
            y: 10,
            width: 856,
            height: 460,
            tipo: "taller",
            nombre: "Almacén general",
        },
    ],
    "Almacén 2": [
        {
            x: 10,
            y: 10,
            width: 856,
            height: 460,
            tipo: "taller",
            nombre: "Cuarto de vigilancia",
        },
    ],
    "Almacen 2": [
        {
            x: 10,
            y: 10,
            width: 856,
            height: 460,
            tipo: "taller",
            nombre: "Cuarto de vigilancia",
        },
    ],
    Vigilancia: [
        {
            x: 10,
            y: 10,
            width: 856,
            height: 460,
            tipo: "taller",
            nombre: "Cuarto de vigilancia",
        },
    ],
};

export default function PlantaBaja({ edificio, onSeleccionarEspacio }) {
    if (edificio === "Cafetería y SUM" || edificio === "Cafetería") {
        return (
            <div className="w-full flex justify-center items-center">
                <svg
                    width="668"
                    height="539"
                    viewBox="0 0 668 539"
                    fill="none"
                    className="max-h-[460px] object-contain drop-shadow-sm overflow-visible"
                >
                    <g
                        filter="url(#filter0_d_2280_15677)"
                        onClick={() =>
                            onSeleccionarEspacio?.({
                                nombre: "SUM",
                                tipo: "vestibulo",
                            })
                        }
                        className="cursor-pointer transition-all duration-300 hover:brightness-95"
                    >
                        <path
                            d="M625.556 274.526C571.809 560.892 88.7798 580.286 13.5094 275.318C10.8192 264.418 15.3759 252.982 24.4564 246.379L180.322 133.053C187.857 127.575 192.315 118.822 192.315 109.506V41.8496C192.315 25.7711 205.349 12.7368 221.428 12.7368H411.183C427.261 12.7368 440.296 25.771 440.296 41.8496V109.261C440.296 118.713 444.885 127.578 452.604 133.034L614.03 247.142C622.78 253.328 627.533 263.994 625.556 274.526Z"
                            fill="#F9CACB"
                            strokeWidth="25.4737"
                            stroke="#F1F0F0"
                        />
                    </g>
                    <path
                        d="M180.092 34.7368L179.592 110.737H453.092L454.092 39.2368C448.092 9.23682 425.592 0.736816 415.092 0.236816H219.092C193.892 0.636816 182.592 23.4035 180.092 34.7368Z"
                        fill="#FDEDED"
                        onClick={() =>
                            onSeleccionarEspacio?.({
                                nombre: "Cocina",
                                tipo: "oficina",
                            })
                        }
                        className="cursor-pointer transition-all duration-300 hover:brightness-95"
                    />
                    <rect
                        x="179.592"
                        y="144.737"
                        width="34"
                        height="275"
                        rx="8"
                        transform="rotate(-90 179.592 144.737)"
                        fill="#F1F0F0"
                        className="pointer-events-none"
                    />
                    <text
                        x="317"
                        y="75"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold pointer-events-none"
                        fill="#6D6162"
                    >
                        Cocina
                    </text>
                    <text
                        x="317"
                        y="320"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold pointer-events-none"
                        fill="#6D6162"
                    >
                        SUM / Comedor
                    </text>
                    <defs>
                        <filter
                            id="filter0_d_2280_15677"
                            x="0"
                            y="0"
                            width="667.854"
                            height="538.586"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                            />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dx="14.5564" dy="14.5564" />
                            <feGaussianBlur stdDeviation="7.2782" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            />
                            <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_2280_15677"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_2280_15677"
                                result="shape"
                            />
                        </filter>
                    </defs>
                </svg>
            </div>
        );
    }

    const espacios = DISTRIBUCIONES_PB[edificio];

    if (!espacios) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center text-neutro-600 border border-dashed border-neutro-100 rounded-xl">
                Plano general de {edificio}
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center">
            <svg
                className="w-full h-auto max-h-[460px] object-contain select-none drop-shadow-md"
                viewBox="0 0 876 493"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="867" height="484" rx="8" fill="#F1F0F0" />
                <rect
                    x="2"
                    y="2"
                    width="863"
                    height="480"
                    rx="6"
                    stroke="#D7D4D4"
                    strokeWidth="4"
                />

                {espacios.map((espacio, index) => (
                    <Espacio
                        key={`${edificio}_pb_${index}`}
                        {...espacio}
                        nombre={
                            espacio.nombre === "Cuarto de vigilancia"
                                ? "Almacén 2"
                                : espacio.nombre
                        }
                        onClick={() => onSeleccionarEspacio?.(espacio)}
                    />
                ))}
            </svg>
        </div>
    );
}
