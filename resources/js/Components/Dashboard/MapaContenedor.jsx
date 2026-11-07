export default function MapaContenedor() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full min-h-[450px]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-titulo-2 text-neutro-900 font-bold">
                        Mapa de la institución
                    </h2>
                    <p className="text-sm text-neutro-600 mt-1">
                        Elige un edifio
                    </p>
                </div>
                <button
                    type="button"
                    className="text-neutro-300 hover:text-primario-500 hover:bg-primario-50 p-2 rounded-md transition-colors"
                    title="Expandir mapa"
                >
                    <span className="text-2xl leading-none">⛶</span>
                </button>

                <div className="flex-1 bg-neutro-50 border-2 border-dashed border-neutro-100 rounded-lg flex items-center justify-center p-6">
                    <p className="text-neutro-300 font-medium">
                        Cargando mapa interactivo...
                    </p>
                </div>
            </div>
        </div>
    );
}
