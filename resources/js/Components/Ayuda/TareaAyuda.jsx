import AvisoAyuda from "@/Components/Ayuda/AvisoAyuda";
import ImagenAyuda from "@/Components/Ayuda/ImagenAyuda";
import TextoEnriquecido from "@/Components/Ayuda/TextoEnriquecido";

export default function TareaAyuda({ tarea }) {
    return (
        <article
            id={tarea.id}
            className="scroll-mt-6 pt-5 first:pt-0 border-t border-neutro-100 first:border-t-0 space-y-3"
        >
            <h3 className="text-base font-bold text-neutro-900 leading-snug">
                {tarea.titulo}
            </h3>

            {tarea.introduccion && (
                <p className="text-sm text-neutro-600 leading-relaxed">
                    <TextoEnriquecido texto={tarea.introduccion} />
                </p>
            )}

            {Array.isArray(tarea.pasos) && tarea.pasos.length > 0 && (
                <ol className="space-y-2.5">
                    {tarea.pasos.map((paso, indice) => (
                        <li
                            key={indice}
                            className="flex items-start gap-3 text-sm text-neutro-900 leading-relaxed"
                        >
                            <span
                                aria-hidden="true"
                                className="w-6 h-6 rounded-full bg-primario-100 text-primario-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                            >
                                {indice + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                                <TextoEnriquecido texto={paso} />
                            </span>
                        </li>
                    ))}
                </ol>
            )}

            {Array.isArray(tarea.definiciones) &&
                tarea.definiciones.length > 0 && (
                    <dl className="divide-y divide-neutro-100 rounded-lg border border-neutro-100 bg-neutro-50/50 px-4 py-1">
                        {tarea.definiciones.map((item, indice) => (
                            <div key={indice} className="py-3">
                                <dt className="text-sm font-semibold text-neutro-900">
                                    <TextoEnriquecido texto={item.termino} />
                                </dt>
                                <dd className="text-sm text-neutro-600 leading-relaxed mt-0.5">
                                    <TextoEnriquecido texto={item.definicion} />
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}

            {tarea.imagen && <ImagenAyuda imagen={tarea.imagen} />}

            {Array.isArray(tarea.avisos) && tarea.avisos.length > 0 && (
                <div className="space-y-2.5 pt-1">
                    {tarea.avisos.map((aviso, indice) => (
                        <AvisoAyuda
                            key={indice}
                            tipo={aviso.tipo}
                            texto={aviso.texto}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}
