import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import TextoEnriquecido from "@/Components/Ayuda/TextoEnriquecido";

export default function PreguntasFrecuentes({ preguntas = [] }) {
    const [abiertas, setAbiertas] = useState({});

    if (!Array.isArray(preguntas) || preguntas.length === 0) {
        return null;
    }

    const alternar = (id) => {
        setAbiertas((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section
            id="preguntas-frecuentes"
            aria-labelledby="titulo-preguntas-frecuentes"
            className="scroll-mt-6 bg-white rounded-xl border border-neutro-100 shadow-sm p-5 sm:p-6 space-y-4"
        >
            <header className="flex items-start gap-3">
                <div
                    className="w-9 h-9 rounded-lg bg-primario-100 text-primario-700 flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                >
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h2
                        id="titulo-preguntas-frecuentes"
                        className="text-titulo-2 font-bold text-neutro-900"
                    >
                        Preguntas frecuentes
                    </h2>
                    <p className="text-xs text-neutro-600 mt-0.5">
                        Respuestas rápidas a las dudas más comunes sobre SIME.
                    </p>
                </div>
            </header>

            <div className="space-y-2.5">
                {preguntas.map((item) => {
                    const estaAbierta = Boolean(abiertas[item.id]);
                    const panelId = `faq-respuesta-${item.id}`;

                    return (
                        <div
                            key={item.id}
                            id={item.id}
                            className="scroll-mt-6 rounded-lg border border-neutro-100 overflow-hidden"
                        >
                            <h3>
                                <button
                                    type="button"
                                    aria-expanded={estaAbierta}
                                    aria-controls={panelId}
                                    onClick={() => alternar(item.id)}
                                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-neutro-900 hover:bg-neutro-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primario-500"
                                >
                                    <span className="min-w-0 flex-1">
                                        {item.pregunta}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-neutro-600 shrink-0 transition-transform duration-200 ${
                                            estaAbierta ? "rotate-180" : ""
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            </h3>

                            {estaAbierta && (
                                <div
                                    id={panelId}
                                    className="px-4 pb-4 pt-3 text-sm text-neutro-600 leading-relaxed border-t border-neutro-100 bg-neutro-50/40"
                                >
                                    <TextoEnriquecido texto={item.respuesta} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
