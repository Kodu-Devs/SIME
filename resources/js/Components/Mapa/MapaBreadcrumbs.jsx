import { Link } from "@inertiajs/react";
import { MapPin, ChevronRight } from "lucide-react";

export default function MapaBreadcrumbs({ items = [] }) {
    return (
        <nav
            aria-label="Ruta de navegación"
            className="inline-flex flex-wrap items-center gap-1.5 bg-white border border-neutro-100 rounded-xl px-3 py-1.5 shadow-xs mt-2"
        >
            {items.map((item, idx) => {
                const esPrimero = idx === 0;
                const esUltimo = idx === items.length - 1;

                return (
                    <div
                        key={item.label}
                        className="inline-flex items-center gap-1.5"
                    >
                        {idx > 0 && (
                            <ChevronRight className="w-3.5 h-3.5 text-neutro-300 shrink-0" />
                        )}

                        {esUltimo || !item.href ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-primario-100/70 text-primario-700 text-xs font-bold">
                                {esPrimero && (
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>{item.label}</span>
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold text-neutro-600 hover:text-primario-700 hover:bg-neutro-50 transition-colors"
                            >
                                {esPrimero && (
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>{item.label}</span>
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
