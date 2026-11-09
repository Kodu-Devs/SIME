import React from "react";
import Edificio from "@/Components/Mapa/Edificio";

export default function Croquis({
    instalaciones = [],
    porEdificio = {},
    onSelectEdificio,
}) {
    const buscarInstalacion = (...nombresPosibles) =>
        instalaciones.find((inst) => nombresPosibles.includes(inst.nombre));

    const obtenerTotal = (...nombresPosibles) => {
        if (!instalaciones || instalaciones.length === 0) return null;
        const inst = buscarInstalacion(...nombresPosibles);
        if (!inst) return 0;
        return porEdificio[inst.nombre]?.total ?? inst.extintores_count ?? 0;
    };

    const textoConteo = (...nombresPosibles) => {
        const total = obtenerTotal(...nombresPosibles);
        if (total === null) return "Ver planta";
        return `${total} ${total === 1 ? "extintor" : "extintores"}`;
    };

    const manejarClic = (...nombresPosibles) => {
        const inst = buscarInstalacion(...nombresPosibles);
        if (inst && onSelectEdificio) {
            onSelectEdificio(inst);
        } else if (onSelectEdificio && nombresPosibles[0]) {
            onSelectEdificio({ nombre: nombresPosibles[0] });
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-neutro-100">
            <svg
                className="w-full h-auto max-h-[600px] object-contain drop-shadow-sm"
                viewBox="0 0 876 780"
                fill="none"
            >
                <rect width="876" height="779.558" rx="20" fill="#D5FDD2" />

                <path
                    d="M623.281 321.471V128.741V56H480.381H403.445V321.471M623.281 321.471H562.904M623.281 321.471H704.816M792.028 321.471H835.892M792.028 321.471V234.487M792.028 321.471H704.816M562.904 321.471V432.902M562.904 321.471H403.445M562.904 432.902H704.816M562.904 432.902V530.12M704.816 432.902V321.471M704.816 432.902V452.801M403.445 321.471H343.584H150.067V530.12M403.445 321.471V530.12M403.445 530.12V651.785H562.904V530.12M403.445 530.12H562.904M403.445 530.12H259.123M704.816 452.801V549H845.5V517V452.801H704.816ZM150.067 530.12H259.123M150.067 530.12H30M259.123 530.12V743"
                    stroke="#E6D4A3"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Elementos decorativos del campus (no interactivos) */}
                <rect
                    x="420.5"
                    y="185.129"
                    width="186"
                    height="126.536"
                    rx="20"
                    fill="#D0D0D0"
                />
                <rect
                    x="420.5"
                    y="334.883"
                    width="128"
                    height="185.742"
                    rx="20"
                    fill="#A2DB8A"
                />
                <path
                    d="M327.406 357.104C327.406 344.832 336.246 334.883 347.151 334.883H377.755C388.66 334.883 397.5 344.832 397.5 357.104V493.761C397.5 506.033 389.749 515.981 380.187 515.981H347.151C336.246 515.981 327.406 506.033 327.406 493.761V357.104Z"
                    fill="#A2DB8A"
                />
                <path
                    d="M298.813 515.981C289.251 515.981 281.5 506.033 281.5 493.761V472.651C281.5 460.379 289.251 450.43 298.813 450.43H380.187C389.749 450.43 397.5 460.379 397.5 472.651V493.761C397.5 506.033 389.749 515.981 380.187 515.981H298.813Z"
                    fill="#A2DB8A"
                />

                <g>
                    <rect
                        x="655"
                        y="290"
                        width="108"
                        height="22"
                        rx="11"
                        fill="#A2DB8A"
                    />
                    <ellipse cx="667" cy="301" rx="9" ry="8" fill="#5BAA50" />
                    <ellipse cx="695" cy="301" rx="9" ry="8" fill="#416E3B" />
                    <ellipse cx="723" cy="301" rx="9" ry="8" fill="#48A53B" />
                    <ellipse cx="751" cy="301" rx="9" ry="8" fill="#416E3B" />
                </g>

                <g>
                    <rect
                        x="92.5"
                        y="553.221"
                        width="155.333"
                        height="196.006"
                        rx="7"
                        fill="#2FB741"
                    />
                    <line
                        x1="92.5"
                        y1="650.724"
                        x2="247.833"
                        y2="650.724"
                        stroke="white"
                        strokeWidth="1"
                    />
                    <ellipse
                        cx="170.8"
                        cy="650.773"
                        rx="15.266"
                        ry="17.703"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                    <rect
                        x="135.836"
                        y="553.129"
                        width="69.928"
                        height="39.971"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                    />
                    <rect
                        x="135.836"
                        y="709.587"
                        width="69.928"
                        height="39.971"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                    />
                    <rect
                        x="146.67"
                        y="553.129"
                        width="47.275"
                        height="17.131"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                    />
                    <rect
                        x="146.67"
                        y="732.428"
                        width="47.275"
                        height="17.13"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                    />
                </g>

                {/* Los 8 edificios interactivos del croquis */}
                <Edificio
                    x={429}
                    y={26.5}
                    tipo="cafeteria"
                    nombre="Cafetería"
                    totalExtintores={obtenerTotal(
                        "Cafetería y SUM",
                        "Cafetería",
                    )}
                    extintores={textoConteo("Cafetería y SUM", "Cafetería")}
                    onClick={() => manejarClic("Cafetería y SUM", "Cafetería")}
                />

                <Edificio
                    x={180.5}
                    y={347.65}
                    ancho={135}
                    alto={89.39}
                    nombre="C"
                    totalExtintores={obtenerTotal("Edificio C")}
                    extintores={textoConteo("Edificio C")}
                    onClick={() => manejarClic("Edificio C")}
                />

                <Edificio
                    x={579}
                    y={334}
                    ancho={113}
                    alto={85.9}
                    nombre="A"
                    totalExtintores={obtenerTotal("Edificio A")}
                    extintores={textoConteo("Edificio A")}
                    onClick={() => manejarClic("Edificio A")}
                />

                <Edificio
                    x={419.5}
                    y={543.84}
                    ancho={128}
                    alto={95.19}
                    nombre="B"
                    totalExtintores={obtenerTotal("Edificio B")}
                    extintores={textoConteo("Edificio B")}
                    onClick={() => manejarClic("Edificio B")}
                />

                <Edificio
                    x={733}
                    y={142}
                    ancho={113}
                    alto={85.9}
                    nombre="E"
                    totalExtintores={obtenerTotal("Edificio E")}
                    extintores={textoConteo("Edificio E")}
                    onClick={() => manejarClic("Edificio E")}
                />

                <Edificio
                    x={716}
                    y={464}
                    ancho={119}
                    alto={75}
                    nombre="D"
                    totalExtintores={obtenerTotal("Edificio D")}
                    extintores={textoConteo("Edificio D")}
                    onClick={() => manejarClic("Edificio D")}
                />

                <Edificio
                    x={40.5}
                    y={425.43}
                    ancho={95}
                    alto={78.94}
                    nombre="Almacén 2"
                    totalExtintores={obtenerTotal(
                        "Almacén 2",
                        "Almacen 2",
                        "Vigilancia",
                    )}
                    extintores={textoConteo(
                        "Almacén 2",
                        "Almacen 2",
                        "Vigilancia",
                    )}
                    onClick={() =>
                        manejarClic("Almacén 2", "Almacen 2", "Vigilancia")
                    }
                />

                <Edificio
                    x={180.5}
                    y={461.42}
                    ancho={93}
                    alto={54.56}
                    nombre="Almacén"
                    totalExtintores={obtenerTotal("Almacén", "Almacen")}
                    extintores={textoConteo("Almacén", "Almacen")}
                    onClick={() => manejarClic("Almacén", "Almacen")}
                />
            </svg>
        </div>
    );
}
