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
                <h3 className="text-lg font-bold text-gray-800">
                    Próximo en la agenda
                </h3>
                <p className="text-blue-600 text-sm cursor-pointer">
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
                        return (
                            <li
                                key={`${evento.clase}-${evento.id}`}
                                className="flex items-center gap-4"
                            >
                                <div className="bg-gray-100 rounded text-center w-14 py-1">
                                    <span className="block text-xl font-bold text-gray-700">
                                        {dia}
                                    </span>
                                    <span className="block text-xs text-gray-500 uppercase">
                                        {mes}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-bold text-sm text-gray-800">
                                        {evento.titulo}
                                    </p>
                                    <p className="text-xs text-gray-500">
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
