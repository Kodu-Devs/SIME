export default function PanelRecomendaciones({ recomendaciones = [] }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <h2 className="text-lg font-bold text-gray-800">
                    Recomendaciones
                </h2>
            </div>

            {recomendaciones.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    Todo en orden: no hay recomendaciones por ahora.
                </p>
            ) : (
                <div className="space-y-3">
                    {recomendaciones.map((r, i) => (
                        <div
                            key={i}
                            className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm leading-relaxed"
                        >
                            {r.mensaje}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
