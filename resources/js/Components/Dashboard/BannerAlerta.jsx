export default function BannerAlerta({ etiqueta, ubicacion, edificio, piso }) {
    return (
        <div className="bg-red-100 border-l-4 border-primario-500 text-primario-700 p-6 mb-6 rounded shadow-sm flex justify-between items-center">
            <div>
                <p className="text-base mt-0.5">
                    ⚠️ <b>{etiqueta} venció su mantenimiento</b>
                </p>
                <p className="text-sm">
                    {ubicacion} - {edificio}, {piso}
                </p>
            </div>

            <button className="bg-primario-500 hover:bg-primario-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                <p>Programar mantenimiento</p>
            </button>
        </div>
    );
}
