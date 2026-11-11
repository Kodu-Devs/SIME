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

    // ---- DISTRIBUCIÓN DE ALMACÉN (Planta alta arriba-izq + 2 Oficinas a la derecha + Área inferior) ----
    Almacén: [
        {
            x: 10,
            y: 10,
            width: 666,
            height: 222,
            tipo: "salon",
            nombre: "Planta alta del almacén",
            matchNombre: "Almacén general",
        },
        {
            x: 10,
            y: 242,
            width: 666,
            height: 232,
            tipo: "taller",
            nombre: "",
            matchNombre: "Almacén general",
        },
        {
            x: 686,
            y: 10,
            width: 171,
            height: 222,
            tipo: "oficina",
            nombre: "Oficina",
            matchNombre: "Almacén general",
        },
        {
            x: 686,
            y: 242,
            width: 171,
            height: 232,
            tipo: "oficina",
            nombre: "Oficina",
            matchNombre: "Almacén general",
        },
    ],

    // ---- DISTRIBUCIÓN DE ALMACÉN 2 (Planta única totalmente plana sin divisiones) ----
    "Almacén 2": [
        {
            x: 10,
            y: 10,
            width: 847,
            height: 464,
            tipo: "taller",
            nombre: "Almacén 2",
            matchNombre: "Cuarto de vigilancia",
        },
    ],
};

// Alias para que funcione con o sin tilde y con el nombre de BD ("Vigilancia")
DISTRIBUCIONES_PB["Almacen"] = DISTRIBUCIONES_PB["Almacén"];
DISTRIBUCIONES_PB["Almacen 2"] = DISTRIBUCIONES_PB["Almacén 2"];
DISTRIBUCIONES_PB["Vigilancia"] = DISTRIBUCIONES_PB["Almacén 2"];

export default function PlantaBaja({ edificio, onSeleccionarEspacio }) {
    // ---- PLANTA DE CAFETERÍA Y SUM CON EL ESTILO HOMOLOGADO DE LAS DEMÁS PLANTAS ----
    if (edificio === "Cafetería y SUM" || edificio === "Cafetería") {
        return (
            <div className="w-full flex justify-center items-center">
                <svg
                    width="100%"
                    height="auto"
                    viewBox="0 0 668 530"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full max-w-[668px] max-h-[460px] block select-none drop-shadow-md"
                >
                    {/* Contorno base estilo edificio (#F1F0F0 con borde #D7D4D4) */}
                    <path
                        d="M625.556 274.526C571.809 560.892 88.7798 580.286 13.5094 275.318C10.8192 264.418 15.3759 252.982 24.4564 246.379L180.322 133.053C187.857 127.575 192.315 118.822 192.315 109.506V41.8496C192.315 25.7711 205.349 12.7368 221.428 12.7368H411.183C427.261 12.7368 440.296 25.771 440.296 41.8496V109.261C440.296 118.713 444.885 127.578 452.604 133.034L614.03 247.142C622.78 253.328 627.533 263.994 625.556 274.526Z"
                        fill="#F1F0F0"
                        stroke="#D7D4D4"
                        strokeWidth="6"
                    />

                    {/* Zona Inferior: SUM */}
                    <g
                        onClick={() =>
                            onSeleccionarEspacio?.({
                                nombre: "SUM",
                                tipo: "taller",
                            })
                        }
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <path
                            d="M606 272C556 536 104 554 32 273C30 264 34 254 42 248L188 142H445L596 249C603 254 607 263 606 272Z"
                            fill="#D7D4D4"
                        />
                        <text
                            x="317"
                            y="315"
                            textAnchor="middle"
                            fill="#6D6162"
                            fontSize="22"
                            fontWeight="bold"
                            fontFamily="Manrope, sans-serif"
                            className="select-none pointer-events-none"
                        >
                            SUM
                        </text>
                    </g>

                    {/* Zona Superior Rectangular: Cafetería (vinculada a "Cocina" en BD) */}
                    <g
                        onClick={() =>
                            onSeleccionarEspacio?.({
                                nombre: "Cocina",
                                tipo: "salon",
                            })
                        }
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <rect
                            x="198"
                            y="20"
                            width="236"
                            height="112"
                            rx="22"
                            fill="#FDEDED"
                        />
                        <text
                            x="316.5"
                            y="82"
                            textAnchor="middle"
                            fill="#6D6162"
                            fontSize="20"
                            fontWeight="bold"
                            fontFamily="Manrope, sans-serif"
                            className="select-none pointer-events-none"
                        >
                            Cafetería
                        </text>
                    </g>
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
                width="100%"
                height="auto"
                viewBox="0 0 876 493"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[876px] max-h-[460px] block select-none drop-shadow-md"
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
                        onClick={() =>
                            onSeleccionarEspacio?.({
                                ...espacio,
                                nombre: espacio.matchNombre || espacio.nombre,
                            })
                        }
                    />
                ))}
            </svg>
        </div>
    );
}
