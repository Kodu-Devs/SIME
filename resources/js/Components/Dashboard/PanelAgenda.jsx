const MESES = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
];

function partesFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return { dia: Number(dia), mes: MESES[Number(mes) - 1] };
}

export default function PanelAgenda({ eventos = [] }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-titulo-2 text-neutro-900 font-bold">
                    Próximo en la agenda
                </h3>
                <p className="text-primario-500 text-sm cursor-pointer font-bold">
                    Ver agenda
                </p>
            </div>

            {eventos.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No hay eventos próximos.
                </p>
            ) : (
                <ul className="space-y-4">
                    {eventos.map((evento) => {
                        const { dia, mes } = partesFecha(evento.fecha);
                        return (
                            <li
                                key={`${evento.clase}-${evento.id}`}
                                className="flex items-center gap-4"
                            >
                                <div className="bg-neutro-50 rounded text-center w-14 py-1">
                                    <span className="block text-xl font-bold text-neutro-600">
                                        {dia}
                                    </span>
                                    <span className="block text-xs text-neutro-600 uppercase">
                                        {mes}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-bold text-sm text-neutro-900">
                                        {evento.titulo}
                                    </p>
                                    <p className="text-xs text-neutro-600">
                                        {evento.categoria}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
