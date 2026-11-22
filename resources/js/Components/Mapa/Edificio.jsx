import React from "react";

export default function Edificio({
    x = 0,
    y = 0,
    ancho = 119,
    alto = 75,
    nombre = "Edificio",
    extintores = "0 extintores",
    totalExtintores = null,
    estadisticas = null,
    tipo = "rectangulo",
    onClick,
}) {
    const clipId = `clip-barra-${nombre.replace(/\s+/g, "-")}`;

    const total = Number(estadisticas?.total ?? totalExtintores ?? 0);
    const vigentes = Number(estadisticas?.vigentes ?? 0);
    const porVencer = Number(estadisticas?.por_vencer ?? 0);
    const vencidos = Number(estadisticas?.vencidos ?? 0);
    const tieneEquipos = estadisticas !== null && total > 0;

    const renderSegmentosBarra = (xInicio, yPos, anchoTotal, altoBarra) => {
        if (!tieneEquipos) return null;

        const wVigentes = (vigentes / total) * anchoTotal;
        const wPorVencer = (porVencer / total) * anchoTotal;
        const wVencidos = (vencidos / total) * anchoTotal;

        return (
            <>
                {wVigentes > 0 && (
                    <rect
                        x={xInicio}
                        y={yPos}
                        width={wVigentes}
                        height={altoBarra}
                        fill="#1C9691"
                    />
                )}
                {wPorVencer > 0 && (
                    <rect
                        x={xInicio + wVigentes}
                        y={yPos}
                        width={wPorVencer}
                        height={altoBarra}
                        fill="#F59E0B"
                    />
                )}
                {wVencidos > 0 && (
                    <rect
                        x={xInicio + wVigentes + wPorVencer}
                        y={yPos}
                        width={wVencidos}
                        height={altoBarra}
                        fill="#F24C52"
                    />
                )}
            </>
        );
    };

    if (tipo === "cafeteria") {
        return (
            <g
                transform={`translate(${x}, ${y})`}
                onClick={onClick}
                className="group cursor-pointer select-none transition-all duration-150 hover:drop-shadow-md"
            >
                <path
                    d="M171.899 75.438C157.129 154.129 24.3961 159.459 3.71227 75.6556C2.97301 72.6604 4.22517 69.5177 6.72043 67.7034L49.5514 36.5621C51.6218 35.0567 52.8468 32.6514 52.8468 30.0916V11.5C52.8468 7.08172 56.4286 3.5 60.8468 3.5H112.99C117.409 3.5 120.99 7.08173 120.99 11.5V30.0242C120.99 32.6217 122.251 35.0575 124.372 36.5568L168.731 67.9131C171.136 69.6129 172.442 72.5438 171.899 75.438Z"
                    fill="#F1F0F0"
                    stroke="#D7D4D4"
                    strokeWidth="2"
                    className="transition-colors duration-150 group-hover:stroke-primario-300 group-hover:fill-white"
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
                    fill="#6D6162"
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
                        fill="#D7D4D4"
                    />
                    <g clipPath={`url(#${clipId}-cafeteria)`}>
                        {renderSegmentosBarra(31.6, 86.5, 112, 10)}
                    </g>
                </g>
            </g>
        );
    }

    const esCompacto = alto <= 62;
    const anchoBarra = Math.max(ancho - 20, 20);
    const altoBarra = esCompacto ? 6 : 8;
    const yBarra = esCompacto ? alto - 12 : alto - 18;
    const yTitulo = esCompacto ? 17 : 24;
    const ySubtitulo = esCompacto ? 30 : 40;
    const tamanoTitulo =
        nombre.length > 7 ? "12" : nombre.length > 5 ? "13" : "22";

    return (
        <g
            transform={`translate(${x}, ${y})`}
            onClick={onClick}
            className="group cursor-pointer select-none transition-all duration-150 hover:drop-shadow-md"
        >
            <rect
                x="0"
                y="0"
                width={ancho}
                height={alto}
                rx="8"
                fill="#F1F0F0"
                stroke="#D7D4D4"
                strokeWidth="2"
                className="transition-colors duration-150 group-hover:stroke-primario-300 group-hover:fill-white"
            />

            <text
                x="10"
                y={yTitulo}
                fill="#272222"
                fontSize={tamanoTitulo}
                fontWeight="bold"
                fontFamily="Manrope, sans-serif"
            >
                {nombre}
            </text>

            {alto > 45 && (
                <text
                    x="10"
                    y={ySubtitulo}
                    fill="#6D6162"
                    fontSize={esCompacto ? "9" : "10"}
                    fontWeight="600"
                    fontFamily="Manrope, sans-serif"
                >
                    {extintores}
                </text>
            )}

            <g>
                <defs>
                    <clipPath id={clipId}>
                        <rect
                            x="10"
                            y={yBarra}
                            width={anchoBarra}
                            height={altoBarra}
                            rx={altoBarra / 2}
                        />
                    </clipPath>
                </defs>

                <rect
                    x="10"
                    y={yBarra}
                    width={anchoBarra}
                    height={altoBarra}
                    rx={altoBarra / 2}
                    fill="#D7D4D4"
                />

                <g clipPath={`url(#${clipId})`}>
                    {renderSegmentosBarra(10, yBarra, anchoBarra, altoBarra)}
                </g>
            </g>
        </g>
    );
}
