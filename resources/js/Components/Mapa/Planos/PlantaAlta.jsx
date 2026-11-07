import React from "react";
import Espacio from "@/Components/Mapa/Planos/Espacio";

const DISTRIBUCIONES_PA = {
    "Edificio A": [
        // arriba
        {
            x: 8,
            y: 10,
            width: 138.02,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 152,
            y: 10,
            width: 136.2,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 294,
            y: 10,
            width: 139.02,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 439.09,
            y: 10,
            width: 129.09,
            height: 192.5,
            tipo: "pasillo",
            nombre: "",
        },
        {
            x: 574,
            y: 10,
            width: 280.35,
            height: 192.99,
            tipo: "salon",
            nombre: "Salón ",
        },

        // lo de abajo
        {
            x: 10,
            y: 278,
            width: 207.53,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 223,
            y: 278,
            width: 64.54,
            height: 192.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 294,
            y: 278,
            width: 139.02,
            height: 192.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 439,
            y: 278,
            width: 129.09,
            height: 192.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 574,
            y: 278,
            width: 64.54,
            height: 192.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 644,
            y: 278,
            width: 212.99,
            height: 192.99,
            tipo: "salon",
            nombre: "Salón ",
        },
    ],

    "Edificio B": [
        {
            x: 10,
            y: 10,
            width: 138.02,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 154,
            y: 10,
            width: 139.02,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 300,
            y: 10,
            width: 89.16,
            height: 93.34,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 299,
            y: 109,
            width: 89.16,
            height: 93.1,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 394,
            y: 10,
            width: 184.26,
            height: 192.99,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 584,
            y: 10,
            width: 136.2,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },
        {
            x: 726,
            y: 10,
            width: 136.2,
            height: 192.5,
            tipo: "salon",
            nombre: "Salón ",
        },

        {
            x: 10,
            y: 278,
            width: 847,
            height: 192.99,
            tipo: "taller",
            nombre: "",
        },
    ],
};

DISTRIBUCIONES_PA["Edificio C"] = DISTRIBUCIONES_PA["Edificio B"];
DISTRIBUCIONES_PA["Edificio D"] = DISTRIBUCIONES_PA["Edificio B"];

export default function PlantaAlta({ edificio, onSeleccionarEspacio }) {
    const espacios = DISTRIBUCIONES_PA[edificio] || [];

    if (espacios.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
                Plano no configurado para {edificio} (Planta alta)
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center">
            <svg
                className="w-full h-auto max-h-[460px] object-contain select-none drop-shadow-md"
                viewBox="0 0 876 489"
                fill="none"
            >
                <rect width="867" height="480" rx="8" fill="#F1F0F0" />
                <rect
                    x="2"
                    y="2"
                    width="863"
                    height="476"
                    rx="6"
                    stroke="#D7D4D4"
                    strokeWidth="4"
                />

                {espacios.map((espacio, index) => (
                    <Espacio
                        key={`${edificio}_pa_${index}`}
                        x={espacio.x}
                        y={espacio.y}
                        width={espacio.width}
                        height={espacio.height}
                        tipo={espacio.tipo}
                        nombre={espacio.nombre}
                        onClick={() => onSeleccionarEspacio?.(espacio)}
                    />
                ))}
            </svg>
        </div>
    );
}
