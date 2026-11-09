export default function PanelRecomendaciones({ recomendaciones = [] }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <h2 className="text-titulo-2 text-neutro-900 font-bold">
                    Recomendaciones
                </h2>
            </div>

            {recomendaciones.length === 0 ? (
                <p className="text-neutro-900 text-sm">
                    Todo en orden: no hay recomendaciones por ahora.
                </p>
            ) : (
                <div className="space-y-3">
                    {recomendaciones.map((r, i) => (
                        <div
                            key={i}
                            className="bg-acento-500 bg-opacity-25 text-acento-500 font-semibold p-3 rounded-md text-sm leading-relaxed shadow-md"
                        >
                            {r.mensaje}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
