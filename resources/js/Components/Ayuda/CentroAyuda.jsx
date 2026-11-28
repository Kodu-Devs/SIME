import { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    Bell,
    BookOpen,
    BookText,
    CalendarDays,
    Download,
    FireExtinguisher,
    Flame,
    FlameKindling,
    GraduationCap,
    HelpCircle,
    History as HistoryIcon,
    LayoutDashboard,
    Map as MapIcon,
    MapPin,
    Rocket,
    User,
} from "lucide-react";
import BotonVolverArriba from "@/Components/Ayuda/BotonVolverArriba";
import IndiceAyuda from "@/Components/Ayuda/IndiceAyuda";
import PreguntasFrecuentes from "@/Components/Ayuda/PreguntasFrecuentes";
import SeccionAyuda from "@/Components/Ayuda/SeccionAyuda";

const ICONOS = {
    Bell,
    BookOpen,
    BookText,
    CalendarDays,
    FireExtinguisher,
    Flame,
    FlameKindling,
    GraduationCap,
    HelpCircle,
    History: HistoryIcon,
    LayoutDashboard,
    Map: MapIcon,
    MapPin,
    Rocket,
    User,
};

const obtenerIcono = (nombre) => ICONOS[nombre] || BookOpen;

const obtenerComportamientoScroll = () => {
    if (typeof window === "undefined") return "auto";
    const reducir = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
    )?.matches;
    return reducir ? "auto" : "smooth";
};

const desplazarAId = (id) => {
    if (typeof window === "undefined") return;

    if (!id) {
        window.scrollTo({
            top: 0,
            behavior: obtenerComportamientoScroll(),
        });
        return;
    }

    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.scrollIntoView({
        behavior: obtenerComportamientoScroll(),
        block: "start",
    });
};

export default function CentroAyuda({ manual }) {
    const { url } = usePage();

    const secciones = useMemo(
        () => (Array.isArray(manual?.secciones) ? manual.secciones : []),
        [manual],
    );

    const preguntas = useMemo(
        () => (Array.isArray(manual?.preguntas) ? manual.preguntas : []),
        [manual],
    );

    const elementosIndice = useMemo(() => {
        const lista = secciones.map((sec) => ({
            id: sec.id,
            titulo: sec.titulo,
            icono: sec.icono,
        }));

        if (preguntas.length > 0) {
            lista.push({
                id: "preguntas-frecuentes",
                titulo: "Preguntas frecuentes",
                icono: "HelpCircle",
            });
        }

        return lista;
    }, [secciones, preguntas]);

    const [seccionActiva, setSeccionActiva] = useState(
        () => elementosIndice[0]?.id || "",
    );

    // Navegación por ancla al cargar, al navegar con Inertia o al cambiar el hash
    useEffect(() => {
        const aplicarHash = () => {
            const hashCrudo = window.location.hash.replace(/^#/, "");
            if (!hashCrudo) return;

            let hash = hashCrudo;
            try {
                hash = decodeURIComponent(hashCrudo);
            } catch {
                hash = hashCrudo;
            }

            requestAnimationFrame(() => {
                desplazarAId(hash);
            });
        };

        aplicarHash();
        window.addEventListener("hashchange", aplicarHash);
        return () => window.removeEventListener("hashchange", aplicarHash);
    }, [url]);

    // Scroll-spy con IntersectionObserver
    useEffect(() => {
        if (
            typeof window === "undefined" ||
            typeof IntersectionObserver === "undefined" ||
            elementosIndice.length === 0
        ) {
            return undefined;
        }

        setSeccionActiva((prev) =>
            elementosIndice.some((el) => el.id === prev)
                ? prev
                : elementosIndice[0].id,
        );

        const visibles = new globalThis.Map();

        const observer = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        visibles.set(
                            entrada.target.id,
                            entrada.boundingClientRect.top,
                        );
                    } else {
                        visibles.delete(entrada.target.id);
                    }
                });

                if (visibles.size > 0) {
                    const ordenados = [...visibles.entries()].sort(
                        (a, b) => Math.abs(a[1]) - Math.abs(b[1]),
                    );
                    setSeccionActiva(ordenados[0][0]);
                }
            },
            {
                rootMargin: "-10% 0px -65% 0px",
                threshold: 0,
            },
        );

        elementosIndice.forEach((item) => {
            const nodo = document.getElementById(item.id);
            if (nodo) observer.observe(nodo);
        });

        return () => observer.disconnect();
    }, [elementosIndice]);

    const manejarSeleccionIndice = (e, id) => {
        e.preventDefault();
        window.history.replaceState(window.history.state, "", `#${id}`);
        desplazarAId(id);
        setSeccionActiva(id);
    };

    const manejarVolverArriba = () => {
        if (elementosIndice.length > 0) {
            setSeccionActiva(elementosIndice[0].id);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Encabezado de página */}
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-titulo-1 font-bold text-neutro-900">
                        {manual?.titulo || "Centro de ayuda"}
                    </h1>
                    {manual?.descripcion && (
                        <p className="text-xs sm:text-sm text-neutro-600 mt-1 leading-relaxed">
                            {manual.descripcion}
                        </p>
                    )}
                </div>

                {manual?.pdf && (
                    <a
                        href={manual.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutro-100 bg-white px-4 py-2.5 text-xs font-bold text-neutro-900 shadow-sm hover:bg-neutro-50 hover:border-neutro-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario-500 focus-visible:ring-offset-2 shrink-0 self-start"
                    >
                        <Download
                            className="w-4 h-4 text-neutro-600 shrink-0"
                            aria-hidden="true"
                        />
                        <span>Descargar manual (PDF)</span>
                    </a>
                )}
            </header>

            {/* Distribución de dos columnas en escritorio / una en tableta y móvil */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <IndiceAyuda
                    elementos={elementosIndice}
                    seccionActiva={seccionActiva}
                    alSeleccionar={manejarSeleccionIndice}
                    obtenerIcono={obtenerIcono}
                />

                <div className="flex-1 min-w-0 max-w-3xl space-y-6">
                    {secciones.map((seccion) => (
                        <SeccionAyuda
                            key={seccion.id}
                            seccion={seccion}
                            obtenerIcono={obtenerIcono}
                        />
                    ))}

                    <PreguntasFrecuentes preguntas={preguntas} />
                </div>
            </div>

            <BotonVolverArriba alVolverArriba={manejarVolverArriba} />
        </div>
    );
}
