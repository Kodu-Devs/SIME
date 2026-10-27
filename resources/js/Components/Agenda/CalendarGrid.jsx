import React from "react";

export default function CalendarGrid(props) {
    // Recibimos las variables de los eventos y el mes actual desde Index.jsx
    const eventos = props.eventos;
    const mesActual = props.mesActual;

    // Cabecera con los días empezando en lunes
    const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SAB", "DOM"];

    // Función corregida para calcular y alinear los días del mes
    const obtenerDiasDelMes = function () {
        let anio = 2026;
        let mes = 10;

        // Extraer el año y mes real si el controlador lo envía
        if (mesActual) {
            let partes = mesActual.split("-");
            anio = parseInt(partes[0], 10);
            mes = parseInt(partes[1], 10);
        }

        // Obtener qué día de la semana cae el día 1 (0 = Domingo, 1 = Lunes, etc.)
        let primerDiaDelMes = new Date(anio, mes - 1, 1).getDay();

        // Ajuste matemático para que el calendario siempre empiece en Lunes
        let inicioOffset = primerDiaDelMes === 0 ? 6 : primerDiaDelMes - 1;

        let totalDias = new Date(anio, mes, 0).getDate();
        let dias = [];

        // Rellenar las casillas vacías antes del día 1
        for (let i = 0; i < inicioOffset; i++) {
            dias.push({
                numero: "",
                fechaCompleta: null,
                esVacio: true,
            });
        }

        // Generar todos los días reales del mes
        for (let dia = 1; dia <= totalDias; dia++) {
            let mesStr = String(mes).padStart(2, "0");
            let diaStr = String(dia).padStart(2, "0");
            let fecha = `${anio}-${mesStr}-${diaStr}`;

            dias.push({
                numero: dia,
                fechaCompleta: fecha,
                esVacio: false,
            });
        }
        return dias;
    };

    let diasDelMes = obtenerDiasDelMes();

    return (
        // Contenedor principal del calendario con borde y sombra
        <div className="bg-white rounded-lg shadow border border-neutro-100 overflow-hidden w-full">
            {/* Cabecera de la semana (Corregida a fondo blanco y alineada a la izquierda) */}
            <div className="grid grid-cols-7 bg-white border-b border-neutro-200 text-left pl-2 font-semibold text-neutro-600 text-xs py-3">
                {diasSemana.map(function (dia, index) {
                    return <div key={index}>{dia}</div>;
                })}
            </div>

            {/* Cuadrícula de los días */}
            <div className="grid grid-cols-7 bg-neutro-100 gap-px">
                {diasDelMes.map(function (diaItem, index) {
                    // Buscar qué eventos de la base de datos coinciden con la fecha de esta celda
                    let eventosDelDia = [];
                    if (diaItem.fechaCompleta) {
                        for (let e = 0; e < eventos.length; e++) {
                            let eventoActual = eventos[e];
                            if (
                                eventoActual.fecha &&
                                eventoActual.fecha.startsWith(
                                    diaItem.fechaCompleta,
                                )
                            ) {
                                eventosDelDia.push(eventoActual);
                            }
                        }
                    }

                    return (
                        <div
                            key={index}
                            className="min-h-[100px] bg-white p-2 flex flex-col justify-between"
                        >
                            {/* Número del día alineado a la izquierda */}
                            <div className="text-left pl-1">
                                <span className="text-sm font-medium text-neutro-900">
                                    {diaItem.numero}
                                </span>
                            </div>

                            {/* Píldoras de los eventos del día */}
                            <div className="space-y-1 mt-1">
                                {eventosDelDia.map(function (evento) {
                                    // Color por defecto (Capacitación en turquesa)
                                    let colorFondo = "bg-acento-500";

                                    // Si es mantenimiento, cambia a negro con borde verde
                                    if (evento.clase === "mantenimiento") {
                                        colorFondo =
                                            "bg-neutro-900 border-l-4 border-primario-500";
                                    }

                                    return (
                                        <div
                                            key={evento.id}
                                            className={
                                                "text-xs px-2 py-1 rounded text-white truncate " +
                                                colorFondo
                                            }
                                        >
                                            {evento.titulo}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
