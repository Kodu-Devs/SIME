export default function BannerAlerta({ etiqueta, ubicacion, edificio, piso }) {
    // if (!alerta) return null;

    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded shadow-sm flex justify-between items-center">
            <div>
                <p>
                    ⚠️ <b>{etiqueta} venció su mantenimiento</b>
                </p>
                <p className="text-sm">
                    {ubicacion} - {edificio}, {piso}
                </p>
            </div>

            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
                <p>Programar mantenimiento</p>
            </button>
        </div>
    );
}
