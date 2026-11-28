import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function IndiceAyuda({
    elementos = [],
    seccionActiva,
    alSeleccionar,
    obtenerIcono,
}) {
    const [abiertoMovil, setAbiertoMovil] = useState(false);

    useEffect(() => {
        if (!abiertoMovil) return undefined;

        const manejarEscape = (e) => {
            if (e.key === "Escape") {
                setAbiertoMovil(false);
            }
        };

        document.addEventListener("keydown", manejarEscape);
        return () => document.removeEventListener("keydown", manejarEscape);
    }, [abiertoMovil]);

    if (elementos.length === 0) return null;

    const elementoActivo = elementos.find((el) => el.id === seccionActiva);

    const renderLista = (enMovil) => (
        <ul className="space-y-1">
            {elementos.map((item) => {
                const activo = seccionActiva === item.id;
                const Icono = obtenerIcono(item.icono);

                return (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            aria-current={activo ? "true" : undefined}
                            onClick={(e) => {
                                alSeleccionar(e, item.id);
                                if (enMovil) {
                                    setAbiertoMovil(false);
                                }
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento-500 ${
                                activo
                                    ? "bg-acento-500/10 text-acento-500 font-semibold border-acento-500"
                                    : "text-neutro-600 hover:bg-neutro-50 hover:text-neutro-900 border-transparent"
                            }`}
                        >
                            <Icono
                                className="w-4 h-4 shrink-0"
                                aria-hidden="true"
                            />
                            <span className="truncate">{item.titulo}</span>
                        </a>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {/* Desplegable en tableta y móvil */}
            <div className="lg:hidden">
                <div className="bg-white rounded-xl border border-neutro-100 shadow-sm overflow-hidden">
                    <button
                        type="button"
                        aria-expanded={abiertoMovil}
                        aria-controls="indice-ayuda-movil"
                        onClick={() => setAbiertoMovil((prev) => !prev)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-neutro-900 hover:bg-neutro-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primario-500"
                    >
                        <span className="min-w-0 truncate">
                            En esta página
                            {elementoActivo ? (
                                <span className="font-normal text-neutro-600">
                                    {" "}
                                    · {elementoActivo.titulo}
                                </span>
                            ) : null}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-neutro-600 shrink-0 transition-transform duration-200 ${
                                abiertoMovil ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                        />
                    </button>

                    {abiertoMovil && (
                        <nav
                            id="indice-ayuda-movil"
                            aria-label="Contenido de la ayuda"
                            className="px-3 pb-3 pt-1 border-t border-neutro-100"
                        >
                            {renderLista(true)}
                        </nav>
                    )}
                </div>
            </div>

            {/* Índice lateral fijo en escritorio */}
            <aside className="hidden lg:block w-64 shrink-0">
                <nav
                    aria-label="Contenido de la ayuda"
                    className="sticky top-6 bg-white rounded-xl border border-neutro-100 shadow-sm p-4"
                >
                    <p className="text-xs font-bold uppercase tracking-wider text-neutro-600 px-3 mb-2.5">
                        En esta página
                    </p>
                    {renderLista(false)}
                </nav>
            </aside>
        </>
    );
}
