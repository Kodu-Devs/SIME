import { Link, router } from "@inertiajs/react";

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
    return {
        anio,
        mesNumero: mes,
        dia: Number(dia),
        mes: MESES[Number(mes) - 1],
    };
}

export default function PanelAgenda({ eventos = [] }) {
    const irAEventoEnAgenda = (evento) => {
        const { anio, mesNumero } = partesFecha(evento.fecha);
        router.get(route("agenda.index"), {
            mes: `${anio}-${mesNumero}`,
            tab:
                evento.clase === "capacitacion"
                    ? "capacitacion"
                    : "mantenimiento",
        });
    };

    return (
        <div className="bg-white rounded-xl border border-neutro-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-titulo-2 text-neutro-900 font-bold">
                    Próximo en la agenda
                </h3>
                <Link
                    href={route("agenda.index")}
                    className="text-primario-500 hover:text-primario-700 text-sm cursor-pointer font-bold transition-colors"
                >
                    Ver agenda
                </Link>
            </div>

            {eventos.length === 0 ? (
                <p className="text-neutro-600 text-sm">
                    No hay eventos próximos.
                </p>
            ) : (
                <ul className="space-y-3">
                    {eventos.map((evento) => {
                        const { dia, mes } = partesFecha(evento.fecha);
                        return (
                            <li
                                key={`${evento.clase}-${evento.id}`}
                                onClick={() => irAEventoEnAgenda(evento)}
                                className="flex items-center justify-between gap-4 p-2 -mx-2 rounded-lg hover:bg-neutro-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="bg-neutro-50 group-hover:bg-white border border-neutro-100 rounded-lg text-center w-14 py-1 shrink-0 transition-colors">
                                        <span className="block text-xl font-bold text-neutro-600">
                                            {dia}
                                        </span>
                                        <span className="block text-xs text-neutro-600 uppercase">
                                            {mes}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-neutro-900 truncate">
                                            {evento.titulo}
                                        </p>
                                        <p className="text-xs text-neutro-600">
                                            {evento.categoria}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-neutro-300 group-hover:text-primario-700 text-sm font-bold pr-1">
                                    ›
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
