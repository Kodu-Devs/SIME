import TareaAyuda from "@/Components/Ayuda/TareaAyuda";

export default function SeccionAyuda({ seccion, obtenerIcono }) {
    if (!seccion) return null;

    const Icono = obtenerIcono(seccion.icono);
    const tareas = Array.isArray(seccion.tareas) ? seccion.tareas : [];

    return (
        <section
            id={seccion.id}
            aria-labelledby={`titulo-seccion-${seccion.id}`}
            className="scroll-mt-6 bg-white rounded-xl border border-neutro-100 shadow-sm p-5 sm:p-6 space-y-5"
        >
            <header className="flex items-start gap-3">
                <div
                    className="w-9 h-9 rounded-lg bg-primario-100 text-primario-700 flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                >
                    <Icono className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h2
                        id={`titulo-seccion-${seccion.id}`}
                        className="text-titulo-2 font-bold text-neutro-900"
                    >
                        {seccion.titulo}
                    </h2>
                    {seccion.resumen && (
                        <p className="text-xs text-neutro-600 mt-0.5 leading-relaxed">
                            {seccion.resumen}
                        </p>
                    )}
                </div>
            </header>

            <div className="space-y-5">
                {tareas.map((tarea) => (
                    <TareaAyuda key={tarea.id} tarea={tarea} />
                ))}
            </div>
        </section>
    );
}
