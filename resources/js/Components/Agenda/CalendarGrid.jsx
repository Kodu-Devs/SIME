import React from "react";

export default function CalendarGrid(props) 
{
    const eventos = props.eventos;
    const mesActual = props.mesActual;
    //cabecera con los dias de la semana
    const diasSemana = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
    
    //funcion para calcular dias del mes
    const obtenerDiasDelMes = function() {
        let anio = 2026;
        let mes = 10;

        if (mesActual){
            let partes = mesActual.split('-');
            anio = partes[0];
            mes = partes[1];
        }

        let primerDiaDelMes = new Date(anio, mes - 1, 1).getDay();
        let inicioOffset = 0;

        if (primerDiaDelMes === 0) {
            inicioOffset = 6;
        }
        else{
            inicioOffset = primerDiaDelMes - 1;
        }

        let totalDias = new Date(anio, mes, 0).getDate();
        let dias = [];

        //replicacion de los espacios vacios que hay de lun-jue
        for (let i = 0; i < inicioOffset; i++){
            dias.push({
                numero: '',
                fechaCompleta: null,
                esVacio: true
            });
        }

        //los dias del mes del 1 al 31
        for (let dia = 1; dia <= totalDias; dia++) {
            let mesStr = String(mes);
            if (mesStr.length < 2) {
                mesStr = '0' + mesStr;
            }

            let diaStr = String(dia);
            if (diaStr.length < 2) {
                diaStr = '0' + diaStr;
            }

            let fecha = anio + '-' + mesStr + '-' + diaStr;
            dias.push({
                numero: dia,
                fechaCompleta: fecha,
                esVacio: false
            });
        }
        return dias;
    };

    let diasDelMes = obtenerDiasDelMes();

    return (
       <div className="bg-white rounded-lg shadow border border-neutro-100 overflow-hidden w-full">
      
      {/* CABECERA DE LA SEMANA */}
      <div className="grid grid-cols-7 bg-neutro-50 border-b border-neutro-100 text-center font-semibold text-neutro-600 text-sm py-3">
        {diasSemana.map(function(dia, index) {
          return <div key={index}>{dia}</div>;
        })}
      </div>

      {/* CUADRICULA DEL CALENDARIO */}
      <div className="grid grid-cols-7 bg-neutro-100 gap-px">
        {diasDelMes.map(function(diaItem, index) {
          
          // Buscamos si hay eventos en este dia
          let eventosDelDia = [];
          if (diaItem.fechaCompleta) {
            for (let e = 0; e < eventos.length; e++) {
              let eventoActual = eventos[e];
              if (eventoActual.fecha && eventoActual.fecha.startsWith(diaItem.fechaCompleta)) {
                eventosDelDia.push(eventoActual);
              }
            }
          }

          return (
            <div
              key={index}
              className="min-h-[100px] bg-white p-2 flex flex-col justify-between"
            >
              {/* NUMERO DEL DIA */}
              <div className="text-right">
                <span className="text-sm font-medium text-neutro-900">
                  {diaItem.numero}
                </span>
              </div>

              {/* EVENTOS DEL DIA */}
              <div className="space-y-1 mt-1">
                {eventosDelDia.map(function(evento) {
                  let colorFondo = 'bg-acento-500';
                  if (evento.clase === 'mantenimiento') {
                    colorFondo = 'bg-neutro-900 border-l-4 border-primario-500';
                  }

                  return (
                    <div
                      key={evento.id}
                      className={'text-xs px-2 py-1 rounded text-white truncate ' + colorFondo}
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