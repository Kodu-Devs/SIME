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
    const centerX = textX !== undefined ? textX : x + width / 2;
    const centerY =
        textY !== undefined
            ? textY
            : y + height / 2 + config.fontSize / 3;

    return (
        <g
            onClick={onClick}
            className={
                onClick
                    ? "cursor-pointer hover:opacity-80 transition-opacity"
                    : ""
            }
        >
            {customPath ? (
                <path
                    d={customPath}
                    fill={config.fill}
                    opacity={config.opacity || 1}
                />
            ) : (
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={rx}
                    fill={config.fill}
                    opacity={config.opacity || 1}
                />
            )}
            {texto && (
                <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    fill={config.textColor}
                    fontSize={config.fontSize}
                    fontWeight="bold"
                    fontFamily="Manrope, sans-serif"
                    className="select-none pointer-events-none"
                >
                    {texto}
                </text>
            )}
        </g>
    );
}
