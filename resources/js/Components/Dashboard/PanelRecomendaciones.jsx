import { router } from "@inertiajs/react";

export default function PanelRecomendaciones({ recomendaciones = [] }) {
    return (
        <div className="bg-white rounded-xl border border-neutro-100 shadow-sm p-6">
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
                        <button
                            key={i}
                            type="button"
                            onClick={() =>
                                router.get(route("extintores.index"), {
                                    accion: "nuevo",
                                })
                            }
                            className="w-full text-left bg-acento-500/15 hover:bg-acento-500/25 text-acento-500 font-semibold p-3 rounded-lg text-sm leading-relaxed shadow-xs transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                            <span>{r.mensaje}</span>
                            <span className="text-base font-bold shrink-0">
                                ›
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
