import React from "react";
import Espacio from "@/Components/Mapa/Planos/Espacio";

const ESCALERAS_EMERGENCIA = {
    x: 759,
    y: 165,
    width: 103,
    height: 150,
    tipo: "escaleras",
    nombre: "Escaleras",
    fill: "#D9D9D9",
};

export const DISTRIBUCIONES_NIVELES_E = {
    "Nivel 1": [
        {
            x: 6,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 131.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 257,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 382.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 508,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 633.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 6,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 131.5,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 257,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "pasillo",
            nombre: "Pasillo",
            matchNombre: "Pasillo",
        },
        {
            x: 382.5,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 508,
            y: 278,
            width: 245,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        ESCALERAS_EMERGENCIA,
    ],

    "Nivel 2": [
        {
            x: 6,
            y: 6,
            width: 245,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 257,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 382.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 508,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 633.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 6,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 131.5,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 257,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 382.5,
            y: 278,
            width: 182.25,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 570.75,
            y: 278,
            width: 182.25,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        ESCALERAS_EMERGENCIA,
    ],

    "Nivel 3": [
        {
            x: 6,
            y: 6,
            width: 245,
            height: 468.5,
            tipo: "oficina",
            nombre: "Oficina",
        },
        {
            x: 257,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "escaleras",
            nombre: "Escaleras",
        },
        {
            x: 382.5,
            y: 6,
            width: 119.5,
            height: 196.5,
            tipo: "bano",
            nombre: "Baños",
        },
        {
            x: 508,
            y: 6,
            width: 245,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 257,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 382.5,
            y: 278,
            width: 119.5,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        {
            x: 508,
            y: 278,
            width: 245,
            height: 196.5,
            tipo: "salon",
            nombre: "Salón",
        },
        ESCALERAS_EMERGENCIA,
    ],
};

export default function NivelesEdificioE({ piso, onSeleccionarEspacio }) {
    const espacios =
        DISTRIBUCIONES_NIVELES_E[piso] || DISTRIBUCIONES_NIVELES_E["Nivel 1"];

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
