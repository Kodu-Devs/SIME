import { useCallback, useEffect, useMemo, useState } from "react";
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
    History,
    LayoutDashboard,
    Map,
    MapPin,
    Rocket,
    Search,
    User,
} from "lucide-react";
import BuscadorAyuda from "@/Components/Ayuda/BuscadorAyuda";
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
    History,
    LayoutDashboard,
    Map,
    MapPin,
    Rocket,
    User,
};

const obtenerIcono = (nombre) => ICONOS[nombre] || BookOpen;

const normalizarTexto = (texto = "") =>
    String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

const tareaCoincide = (tarea, consulta) => {
    const fragmentos = [tarea.titulo, tarea.introduccion];

    if (Array.isArray(tarea.pasos)) {
        fragmentos.push(...tarea.pasos);
    }

    if (Array.isArray(tarea.avisos)) {
        tarea.avisos.forEach((aviso) => fragmentos.push(aviso.texto));
    }

    if (Array.isArray(tarea.definiciones)) {
        tarea.definiciones.forEach((def) => {
            fragmentos.push(def.termino, def.definicion);
        });
    }

    return fragmentos.some(
        (texto) => texto && normalizarTexto(texto).includes(consulta),
    );
};

const preguntaCoincide = (item, consulta) =>
    normalizarTexto(item.pregunta).includes(consulta) ||
    normalizarTexto(item.respuesta).includes(consulta);

export default function CentroAyuda({ manual }) {
    const { url } = usePage();

    const leerQueryInicial = () => {
        if (typeof window === "undefined") return "";
        return new URLSearchParams(window.location.search).get("q") || "";
    };

    const [busqueda, setBusqueda] = useState(leerQueryInicial);

    // Sincroniza ?q= cuando llega desde el buscador del encabezado vía Inertia
    useEffect(() => {
        const queryString = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
        const q = new URLSearchParams(queryString).get("q");
        if (q !== null) {
            setBusqueda(q);
        }
    }, [url]);

    const consultaLimpia = busqueda.trim();
    const consultaNormalizada = normalizarTexto(consultaLimpia);
    const hayBusqueda = consultaNormalizada.length > 0;

    const seccionesFiltradas = useMemo(() => {
        const secciones = manual?.secciones || [];
        if (!hayBusqueda) return secciones;

        return secciones
            .map((seccion) => ({
                ...seccion,
                tareas: (seccion.tareas || []).filter((tarea) =>
                    tareaCoincide(tarea, consultaNormalizada),
                ),
            }))
            .filter((seccion) => seccion.tareas.length > 0);
    }, [manual, hayBusqueda, consultaNormalizada]);

    const preguntasFiltradas = useMemo(() => {
        const preguntas = manual?.preguntas || [];
        if (!hayBusqueda) return preguntas;

        return preguntas.filter((item) =>
            preguntaCoincide(item, consultaNormalizada),
        );
    }, [manual, hayBusqueda, consultaNormalizada]);

    const totalResultados = useMemo(() => {
        const totalTareas = seccionesFiltradas.reduce(
            (acumulado, sec) => acumulado + sec.tareas.length,
            0,
        );
        return totalTareas + preguntasFiltradas.length;
    }, [seccionesFiltradas, preguntasFiltradas]);

    const elementosIndice = useMemo(() => {
        const lista = seccionesFiltradas.map((sec) => ({
            id: sec.id,
            titulo: sec.titulo,
            icono: sec.icono,
        }));

        if (preguntasFiltradas.length > 0) {
            lista.push({
                id: "preguntas-frecuentes",
                titulo: "Preguntas frecuentes",
                icono: "HelpCircle",
            });
        }

        return lista;
    }, [seccionesFiltradas, preguntasFiltradas]);

    const [seccionActiva, setSeccionActiva] = useState(
        () => elementosIndice[0]?.id || "",
    );

    const obtenerComportamientoScroll = useCallback(() => {
        if (typeof window === "undefined") return "auto";
        const reducir = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        )?.matches;
        return reducir ? "auto" : "smooth";
    }, []);

    const desplazarAId = useCallback(
        (id) => {
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

            if (elementosIndice.some((el) => el.id === id)) {
                setSeccionActiva(id);
            }
        },
        [elementosIndice, obtenerComportamientoScroll],
    );

    // Navegación por ancla al cargar, al navegar con Inertia o al cambiar el hash
    useEffect(() => {
        const aplicarHash = () => {
            const hash = window.location.hash.replace(/^#/, "");
            if (!hash) return;

            requestAnimationFrame(() => {
                desplazarAId(hash);
            });
        };

        aplicarHash();
        window.addEventListener("hashchange", aplicarHash);
        return () => window.removeEventListener("hashchange", aplicarHash);
    }, [url, desplazarAId]);

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

        const visibles = new Map();

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
    };

    const limpiarBusqueda = () => {
        setBusqueda("");
        if (typeof window !== "undefined" && window.location.search.includes("q=")) {
            const params = new URLSearchParams(window.location.search);
            params.delete("q");
            const nuevaQuery = params.toString();
            const nuevaUrl =
                window.location.pathname +
                (nuevaQuery ? `?${nuevaQuery}` : "") +
                window.location.hash;
            window.history.replaceState(window.history.state, "", nuevaUrl);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Encabezado de página */}
            <header className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-titulo-1 font-bold text-neutro-900">
                            {manual.titulo}
                        </h1>
                        <p className="text-xs sm:text-sm text-neutro-600 mt-1 leading-relaxed">
                            {manual.descripcion}
                        </p>
                    </div>

                    {manual.pdf && (
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
                </div>

                <div className="max-w-3xl lg:max-w-none">
                    <BuscadorAyuda
                        valor={busqueda}
                        alCambiar={setBusqueda}
                        totalResultados={totalResultados}
                        hayBusqueda={hayBusqueda}
                        alLimpiar={limpiarBusqueda}
                    />
                </div>
            </header>

            {/* Distribución de dos columnas en escritorio / una en móvil y tableta */}
            {hayBusqueda && totalResultados === 0 ? (
                <div className="bg-white rounded-xl border border-neutro-100 shadow-sm p-8 text-center max-w-3xl space-y-3">
                    <Search
                        className="w-8 h-8 text-neutro-300 mx-auto"
                        aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-neutro-900">
                        No encontramos resultados para &ldquo;{consultaLimpia}
                        &rdquo;.
                    </p>
                    <p className="text-xs text-neutro-600">
                        Pruebe con otra palabra clave o revise las secciones del
                        manual.
                    </p>
                    <button
                        type="button"
                        onClick={limpiarBusqueda}
                        className="inline-flex items-center justify-center rounded-xl border border-neutro-100 bg-neutro-50 px-4 py-2 text-xs font-bold text-neutro-900 hover:bg-neutro-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario-500"
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <IndiceAyuda
                        elementos={elementosIndice}
                        seccionActiva={seccionActiva}
                        alSeleccionar={manejarSeleccionIndice}
                        obtenerIcono={obtenerIcono}
                    />

                    <div className="flex-1 min-w-0 max-w-3xl space-y-6">
                        {seccionesFiltradas.map((seccion) => (
                            <SeccionAyuda
                                key={seccion.id}
                                seccion={seccion}
                                obtenerIcono={obtenerIcono}
                            />
                        ))}

                        <PreguntasFrecuentes preguntas={preguntasFiltradas} />
                    </div>
                </div>
            )}
        </div>
    );
}
