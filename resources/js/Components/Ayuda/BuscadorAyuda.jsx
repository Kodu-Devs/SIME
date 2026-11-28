import { Search, X } from "lucide-react";

export default function BuscadorAyuda({
    valor,
    alCambiar,
    totalResultados,
    hayBusqueda,
    alLimpiar,
}) {
    return (
        <div className="space-y-1.5">
            <div className="relative">
                <Search
                    className="w-4 h-4 text-neutro-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                />
                <input
                    type="text"
                    role="searchbox"
                    inputMode="search"
                    value={valor}
                    onChange={(e) => alCambiar(e.target.value)}
                    placeholder="Buscar en la ayuda (ej. registrar uso, alertas)"
                    aria-label="Buscar en la ayuda"
                    className="w-full rounded-xl border border-neutro-100 bg-white pl-10 pr-10 py-2.5 text-sm text-neutro-900 placeholder:text-neutro-300 shadow-sm focus:border-primario-500 focus:ring-1 focus:ring-primario-500 focus:outline-none transition"
                />
                {valor && (
                    <button
                        type="button"
                        onClick={alLimpiar}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutro-600 hover:bg-neutro-50 hover:text-neutro-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario-500"
                    >
                        <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                )}
            </div>

            {hayBusqueda && (
                <p
                    className="text-xs text-neutro-600 px-1"
                    aria-live="polite"
                >
                    {totalResultados}{" "}
                    {totalResultados === 1 ? "resultado" : "resultados"}
                </p>
            )}
        </div>
    );
}
