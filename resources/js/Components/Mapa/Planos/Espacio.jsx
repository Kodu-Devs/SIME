import React from "react";

const CONFIG_TIPOS = {
    salon: {
        fill: "#FDEDED",
        defaultLabel: "Salón",
        fontSize: 15,
        textColor: "#6D6162",
    },
    oficina: {
        fill: "#1C9691",
        opacity: 0.38,
        defaultLabel: "Oficina",
        fontSize: 13,
        textColor: "#6D6162",
    },
    bano: {
        fill: "#F9CACB",
        defaultLabel: "Baño",
        fontSize: 14,
        textColor: "#6D6162",
    },
    escaleras: {
        fill: "#928586",
        defaultLabel: "Escaleras",
        fontSize: 14,
        textColor: "#6D6162",
    },
    pasillo: {
        fill: "#F1F0F0",
        defaultLabel: "",
        fontSize: 12,
        textColor: "#6D6162",
    },
    taller: {
        fill: "#D7D4D4",
        defaultLabel: "Taller",
        fontSize: 16,
        textColor: "#6D6162",
    },
    vestibulo: {
        fill: "#FDEDED",
        opacity: 0.38,
        defaultLabel: "Vestíbulo",
        fontSize: 15,
        textColor: "#6D6162",
    },
};

export default function Espacio({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    tipo = "salon",
    label,
    nombre,
    matchNombre,
    fill,
    rx = 8,
    customPath,
    textX,
    textY,
    onClick,
}) {
    const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS.salon;
    const texto =
        nombre !== undefined
            ? nombre
            : label !== undefined
              ? label
              : config.defaultLabel;

    // Identificador de zona tanto en <g> como en <rect>/<path>
    const zona = matchNombre || texto || tipo;

    const centerX = textX !== undefined ? textX : x + width / 2;
    const centerY = textY !== undefined ? textY : y + height / 2;

    // 1. Detectar si el cuarto es angosto y alto (ej. Oficina de cómputo, Administración)
    const anchoEstimado = texto.length * (config.fontSize * 0.6);
    const rotarVertical =
        width > 0 &&
        height > 0 &&
        width <= 80 &&
        height >= width * 1.8 &&
        anchoEstimado > width - 8;

    // 2. Dividir en líneas si no rota y el texto excede el ancho del cuarto (ej. Lab. Programación)
    const lineas = (() => {
        if (!texto || rotarVertical || !width || anchoEstimado <= width - 12) {
            return [texto];
        }
        const maxChars = Math.max(
            6,
            Math.floor((width - 12) / (config.fontSize * 0.6)),
        );
        const palabras = texto.split(" ");
        const resultado = [];
        let actual = "";

        palabras.forEach((palabra) => {
            const prueba = actual ? `${actual} ${palabra}` : palabra;
            if (prueba.length <= maxChars || !actual) {
                actual = prueba;
            } else {
                resultado.push(actual);
                actual = palabra;
            }
        });
        if (actual) resultado.push(actual);
        return resultado;
    })();

    const altoLinea = config.fontSize + 3;
    const yInicial =
        centerY - ((lineas.length - 1) * altoLinea) / 2 + config.fontSize / 3;

    return (
        <g
            data-zona={zona}
            onClick={onClick}
            className={onClick ? "group cursor-pointer" : ""}
        >
            {customPath ? (
                <path
                    data-zona={zona}
                    d={customPath}
                    fill={fill || config.fill}
                    opacity={config.opacity || 1}
                />
            ) : (
                <rect
                    data-zona={zona}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={rx}
                    fill={fill || config.fill}
                    opacity={config.opacity || 1}
                />
            )}
            {texto && (
                <text
                    x={centerX}
                    y={rotarVertical ? centerY + config.fontSize / 3 : yInicial}
                    textAnchor="middle"
                    fill={config.textColor}
                    fontSize={
                        rotarVertical
                            ? Math.min(config.fontSize, 12)
                            : config.fontSize
                    }
                    fontWeight="bold"
                    fontFamily="Manrope, sans-serif"
                    transform={
                        rotarVertical
                            ? `rotate(-90 ${centerX} ${centerY})`
                            : undefined
                    }
                    className="select-none pointer-events-none"
                >
                    {lineas.map((linea, idx) => (
                        <tspan
                            key={idx}
                            x={centerX}
                            dy={idx === 0 ? 0 : altoLinea}
                        >
                            {linea}
                        </tspan>
                    ))}
                </text>
            )}
        </g>
    );
}
