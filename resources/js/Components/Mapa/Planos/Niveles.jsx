import React from "react";
import Espacio from "@/Components/Mapa/Planos/Espacio";

export default function NivelesEdificioE({ piso, onSeleccionarEspacio }) {
    const espacios = [
        // ---- Fila superior ----
        {
            x: 6,
            y: 6,
            width: 179.317,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 191.262,
            y: 6,
            width: 57.2131,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 254,
            y: 6,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 380,
            y: 6,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 506,
            y: 6,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 632,
            y: 6,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },

        // ---- Fila inferior ----
        {
            x: 6,
            y: 278,
            width: 179.317,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 191,
            y: 278,
            width: 57.2131,
            height: 196.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 254,
            y: 278,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 380,
            y: 278,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 506,
            y: 278,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 632,
            y: 278,
            width: 119.999,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },

        // ---- Escaleras (gris claro en este edificio) ----
        {
            x: 758,
            y: 165,
            width: 103,
            height: 150,
            tipo: "escaleras",
            nombre: "Escaleras",
            fill: "#D9D9D9",
        },
    ];

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
                        key={`E_${piso}_${index}`}
                        {...espacio}
                        onClick={() => onSeleccionarEspacio?.(espacio)}
                    />
                ))}
            </svg>
        </div>
    );
}
