import React from "react";

export default function Edificio({
    x = 0,
    y = 0,
    ancho = 119,
    alto = 75,
    nombre = "Edificio",
    extintores = "0 extintores",
    tipo = "rectangulo",
    onClick,
}) {
    const clipId = `clip-barra-${nombre.replace(/\s+/g, "-")}`;

    // 1. cafe
    if (tipo === "cafeteria") {
        return (
            <g
                transform={`translate(${x}, ${y})`}
                onClick={onClick}
                className="cursor-pointer transition-opacity duration-150 hover:opacity-85 select-none"
            >
                <path
                    d="M171.899 75.438C157.129 154.129 24.3961 159.459 3.71227 75.6556C2.97301 72.6604 4.22517 69.5177 6.72043 67.7034L49.5514 36.5621C51.6218 35.0567 52.8468 32.6514 52.8468 30.0916V11.5C52.8468 7.08172 56.4286 3.5 60.8468 3.5H112.99C117.409 3.5 120.99 7.08173 120.99 11.5V30.0242C120.99 32.6217 122.251 35.0575 124.372 36.5568L168.731 67.9131C171.136 69.6129 172.442 72.5438 171.899 75.438Z"
                    fill="#F1F0F0"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                />
                <text
                    x="88"
                    y="56"
                    textAnchor="middle"
                    fill="#272222"
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="Manrope, sans-serif"
                >
                    {nombre}
                </text>

                <text
                    x="88"
                    y="74"
                    textAnchor="middle"
                    fill="#272222"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Manrope, sans-serif"
                >
                    {extintores}
                </text>
                <g>
                    <defs>
                        <clipPath id={`${clipId}-cafeteria`}>
                            <rect
                                x="31.6"
                                y="86.5"
                                width="112"
                                height="10"
                                rx="5"
                            />
                        </clipPath>
                    </defs>
                    <rect
                        x="31.6"
                        y="86.5"
                        width="112"
                        height="10"
                        rx="5"
                        fill="#E5E7EB"
                    />

                    <g clipPath={`url(#${clipId}-cafeteria)`}>
                        <rect
                            x="31.6"
                            y="86.5"
                            width="78"
                            height="10"
                            fill="#00B828"
                        />
                        <rect
                            x="109.6"
                            y="86.5"
                            width="22"
                            height="10"
                            fill="#FF7700"
                        />
                        <rect
                            x="131.6"
                            y="86.5"
                            width="12"
                            height="10"
                            fill="#FF0004"
                        />
                    </g>
                </g>
            </g>
        );
    }

    const anchoBarra = Math.max(ancho - 20, 20);
    const yBarra = alto - 18;

    return (
        <g
            transform={`translate(${x}, ${y})`}
            onClick={onClick}
            className="cursor-pointer transition-opacity duration-150 hover:opacity-85 select-none"
        >
            {/* Tarjeta base */}
            <rect
                x="0"
                y="0"
                width={ancho}
                height={alto}
                rx="8"
                fill="#F1F0F0"
                stroke="#E5E7EB"
                strokeWidth="1"
            />

            {/* Nombre del edificio */}
            <text
                x="12"
                y="24"
                fill="#272222"
                fontSize="22"
                fontWeight="bold"
                fontFamily="Manrope, sans-serif"
            >
                {nombre}
            </text>

            {/* Subtítulo de extintores */}
            {alto > 55 && (
                <text
                    x="12"
                    y="42"
                    fill="#272222"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Manrope, sans-serif"
                >
                    {extintores}
                </text>
            )}

            {/* Barra de estado con bordes redondeados limpios */}
            <g>
                <defs>
                    <clipPath id={clipId}>
                        <rect
                            x="10"
                            y={yBarra}
                            width={anchoBarra}
                            height="8"
                            rx="4"
                        />
                    </clipPath>
                </defs>

                {/* Fondo gris base */}
                <rect
                    x="10"
                    y={yBarra}
                    width={anchoBarra}
                    height="8"
                    rx="4"
                    fill="#E5E7EB"
                />

                {/* Segmentos de color dentro de la máscara */}
                <g clipPath={`url(#${clipId})`}>
                    <rect
                        x="10"
                        y={yBarra}
                        width={anchoBarra * 0.7}
                        height="8"
                        fill="#00B828"
                    />
                    <rect
                        x={10 + anchoBarra * 0.7}
                        y={yBarra}
                        width={anchoBarra * 0.2}
                        height="8"
                        fill="#FF7700"
                    />
                    <rect
                        x={10 + anchoBarra * 0.9}
                        y={yBarra}
                        width={anchoBarra * 0.1}
                        height="8"
                        fill="#FF0004"
                    />
                </g>
            </g>
        </g>
    );
}
