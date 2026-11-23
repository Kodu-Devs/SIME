import { router } from "@inertiajs/react";

export default function BannerAlerta({
    id,
    etiqueta,
    ubicacion,
    edificio,
    piso,
}) {
    const irAProgramarMantenimiento = () => {
        router.get(route("agenda.index"), {
            tab: "mantenimiento",
            extintor: id || etiqueta,
        });
    };

    return (
        <div className="bg-red-100 border-l-4 border-primario-500 text-primario-700 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <p className="text-base mt-0.5">
                    ⚠️ <b>{etiqueta} venció su mantenimiento</b>
                </p>
                <p className="text-sm">
                    {ubicacion} - {edificio}, {piso}
                </p>
            </div>

            <button
                type="button"
                onClick={irAProgramarMantenimiento}
                className="bg-primario-500 hover:bg-primario-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
                Programar mantenimiento
            </button>
        </div>
    );
}
