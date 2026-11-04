import { useState, useRef, useEffect, useMemo } from "react";
import { router } from "@inertiajs/react";
import {
    Search,
    MapPin,
    Building2,
    FireExtinguisher,
    CalendarDays,
    History,
    Bell,
    LayoutDashboard,
    PlusCircle,
    FileDown,
    User,
    ArrowRight,
    X,
} from "lucide-react";

// Catálogo predefinido basado en las rutas de web.php y los Seeders del proyecto
const OPCIONES_SISTEMA = [
    // --- ACCIONES RÁPIDAS Y MÓDULOS ---
    {
        id: "act-resumen",
        titulo: "Resumen y Estadísticas Generales",
        subtitulo: "Ir al panel principal de monitoreo (Dashboard)",
        keywords:
            "dashboard inicio resumen kpis estadisticas vigentes vencidos",
        icon: LayoutDashboard,
        action: () => router.get(route("dashboard")),
    },
    {
        id: "act-ext-nuevo",
        titulo: "Añadir / Registrar nuevo extintor",
        subtitulo: "Abrir inventario de extintores para dar de alta un equipo",
        keywords: "crear agregar nuevo alta registrar extintor crud inventario",
        icon: PlusCircle,
        action: () =>
            router.get(route("extintores.index"), { accion: "nuevo" }),
    },
    {
        id: "act-ext-lista",
        titulo: "Gestionar Inventario de Extintores",
        subtitulo: "Consultar tabla, editar datos o dar de baja extintores",
        keywords: "extintores lista tabla editar actualizar dar de baja",
        icon: FireExtinguisher,
        action: () => router.get(route("extintores.index")),
    },
    {
        id: "act-mant-nuevo",
        titulo: "Programar Mantenimiento de Extintor",
        subtitulo: "Agendar recarga o revisión en el calendario",
        keywords: "agendar programar mantenimiento recarga servicio calendario",
        icon: CalendarDays,
        action: () =>
            router.get(route("agenda.index"), { tab: "mantenimiento" }),
    },
    {
        id: "act-cap-nueva",
        titulo: "Agendar Nueva Capacitación",
        subtitulo: "Programar práctica o curso en la agenda",
        keywords: "agendar programar capacitacion curso practica brigada",
        icon: CalendarDays,
        action: () =>
            router.get(route("agenda.index"), { tab: "capacitacion" }),
    },
    {
        id: "act-hist-uso",
        titulo: "Registrar Uso de Extintor / Bitácora",
        subtitulo: "Reportar descarga parcial o total en el historial",
        keywords:
            "registrar uso descarga emergencia incidente historial bitacora",
        icon: History,
        action: () =>
            router.get(route("historial.index"), { accion: "registrar-uso" }),
    },
    {
        id: "act-hist-export",
        titulo: "Exportar Informe de Historial",
        subtitulo: "Descargar reporte del historial de usos y mantenimientos",
        keywords: "exportar pdf excel reporte descargar informe historial",
        icon: FileDown,
        action: () => router.get(route("historial.index")),
    },
    {
        id: "act-alertas",
        titulo: "Centro de Alertas y Notificaciones",
        subtitulo:
            "Ver extintores vencidos, por vencer y mantenimientos próximos",
        keywords: "alertas notificaciones campana urgentes avisos",
        icon: Bell,
        action: () => router.get(route("alertas.index")),
    },
    {
        id: "act-perfil",
        titulo: "Configuración de Mi Perfil",
        subtitulo: "Actualizar nombre, correo o contraseña de administrador",
        keywords: "perfil cuenta usuario contrasena configuracion",
        icon: User,
        action: () => router.get(route("profile.edit")),
    },

    // --- MAPA GENERAL Y EDIFICIOS (IDs según InstalacionSeeder.php) ---
    {
        id: "map-general",
        titulo: "Croquis General de la Institución",
        subtitulo: "Vista completa de todos los edificios y áreas del plantel",
        keywords: "mapa croquis campus plantel general institucion",
        icon: MapPin,
        action: () => router.get(route("mapa.index")),
    },
    {
        id: "edif-1",
        titulo: "Edificio A — Ver Pisos y Planos",
        subtitulo:
            "Planta baja (Oficina de cómputo) y Nivel 1 (Administración, Lab. Dibujo)",
        keywords:
            "edificio a planta baja nivel 1 computo administracion dibujo",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Edificio A" }),
    },
    {
        id: "edif-2",
        titulo: "Edificio B — Ver Pisos y Planos",
        subtitulo:
            "Planta baja (Taller automotriz, robótica) y Nivel 1 (Lab. Redes)",
        keywords:
            "edificio b planta baja nivel 1 taller automotriz robotica redes",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Edificio B" }),
    },
    {
        id: "edif-3",
        titulo: "Edificio C — Ver Pisos y Planos",
        subtitulo:
            "Planta baja (Lab. Programación, Auditorio) y Nivel 1 (Biblioteca)",
        keywords:
            "edificio c planta baja nivel 1 programacion auditorio biblioteca",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Edificio C" }),
    },
    {
        id: "edif-4",
        titulo: "Edificio D — Ver Pisos y Planos",
        subtitulo: "Planta baja y Nivel 1",
        keywords: "edificio d planta baja nivel 1",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Edificio D" }),
    },
    {
        id: "edif-5",
        titulo: "Edificio E — Ver Pisos y Planos",
        subtitulo: "Planta baja (Auditorio) y Niveles 1, 2 y 3",
        keywords: "edificio e planta baja nivel 1 2 3 auditorio",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Edificio E" }),
    },
    {
        id: "edif-6",
        titulo: "Cafetería y SUM — Ubicación en Mapa",
        subtitulo: "Nivel único (Cocina y Sala de Usos Múltiples)",
        keywords: "cafeteria sum cocina sala usos multiples",
        icon: Building2,
        action: () =>
            router.get(route("mapa.index"), { edificio: "Cafetería y SUM" }),
    },
];

// Función auxiliar para quitar acentos y pasar a minúsculas
const normalizarTexto = (texto = "") =>
    texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export default function GlobalCommandSearch() {
    const [query, setQuery] = useState("");
    const [abierto, setAbierto] = useState(false);
    const [indiceActivo, setIndiceActivo] = useState(0);
    const contenedorRef = useRef(null);
    const inputRef = useRef(null);

    // Filtramos las opciones conforme el usuario escribe
    const resultados = useMemo(() => {
        const busqueda = normalizarTexto(query.trim());
        if (!busqueda) {
            // Si el input está vacío pero le dio clic, mostramos las 6 sugerencias principales
            return OPCIONES_SISTEMA.slice(0, 5);
        }

        return OPCIONES_SISTEMA.filter((item) => {
            const textoCompleto = normalizarTexto(
                `${item.titulo} ${item.subtitulo} ${item.keywords}`,
            );
            return textoCompleto.includes(busqueda);
        }).slice(0, 8);
    }, [query]);

    // Cerrar el menú si se hace clic fuera del buscador
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                contenedorRef.current &&
                !contenedorRef.current.contains(e.target)
            ) {
                setAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reiniciar el índice seleccionado cuando cambian los resultados
    useEffect(() => {
        setIndiceActivo(0);
    }, [query]);

    const ejecutarOpcion = (opcion) => {
        setAbierto(false);
        setQuery("");
        opcion.action();
    };

    const manejarTeclado = (e) => {
        if (!abierto) {
            if (e.key === "ArrowDown" || e.key === "Enter") setAbierto(true);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIndiceActivo((prev) =>
                resultados.length > 0 ? (prev + 1) % resultados.length : 0,
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndiceActivo((prev) =>
                resultados.length > 0
                    ? (prev - 1 + resultados.length) % resultados.length
                    : 0,
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (resultados[indiceActivo]) {
                ejecutarOpcion(resultados[indiceActivo]);
            } else if (query.trim()) {
                // Si escribió un folio como "ITJMM-..." que no es comando, busca en Historial
                setAbierto(false);
                router.get(route("historial.index"), { search: query.trim() });
            }
        } else if (e.key === "Escape") {
            setAbierto(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={contenedorRef} className="flex-1 max-w-md relative">
            {/* Input de búsqueda */}
            <div className="relative">
                <Search className="w-4 h-4 text-neutro-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onFocus={() => setAbierto(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setAbierto(true);
                    }}
                    onKeyDown={manejarTeclado}
                    placeholder="Buscar función, edificio o acción (ej. Edificio A, añadir)..."
                    className="w-full rounded-lg border border-neutro-100 bg-neutro-50 pl-10 pr-8 py-2 text-etiqueta text-neutro-900 placeholder-neutro-300 focus:bg-white focus:border-primario-500 focus:ring-1 focus:ring-primario-500 transition"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutro-300 hover:text-neutro-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Menú Desplegable de Sugerencias tipo Google */}
            {abierto && (
                <div className="absolute left-0 right-0 top-12 bg-white rounded-xl shadow-lg border border-neutro-100 overflow-hidden z-50">
                    <div className="px-3 py-2 bg-neutro-50/70 border-b border-neutro-100 flex justify-between items-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutro-600">
                            {query.trim()
                                ? "Resultados sugeridos"
                                : "Accesos rápidos sugeridos"}
                        </span>
                    </div>

                    {resultados.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto divide-y divide-neutro-50">
                            {resultados.map((item, index) => {
                                const Icon = item.icon;
                                const activo = index === indiceActivo;

                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onMouseEnter={() =>
                                                setIndiceActivo(index)
                                            }
                                            onClick={() => ejecutarOpcion(item)}
                                            className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition ${
                                                activo
                                                    ? "bg-primario-100/60"
                                                    : "hover:bg-neutro-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                        activo
                                                            ? "bg-primario-700 text-white"
                                                            : "bg-neutro-50 text-neutro-600"
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-etiqueta text-neutro-900 font-semibold truncate">
                                                        {item.titulo}
                                                    </p>
                                                    <p className="text-xs text-neutro-600 truncate">
                                                        {item.subtitulo}
                                                    </p>
                                                </div>
                                            </div>

                                            <ArrowRight
                                                className={`w-4 h-4 transition ${
                                                    activo
                                                        ? "text-primario-700 translate-x-0.5"
                                                        : "text-neutro-300"
                                                }`}
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        /* Opción de respaldo si escribió el código de un extintor */
                        <div className="p-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setAbierto(false);
                                    router.get(route("historial.index"), {
                                        search: query.trim(),
                                    });
                                }}
                                className="w-full text-left p-2.5 rounded-lg bg-neutro-50 hover:bg-primario-100/50 flex items-center justify-between gap-2 transition"
                            >
                                <div className="text-xs text-neutro-900">
                                    Buscar código{" "}
                                    <span className="font-bold text-primario-700">
                                        "{query}"
                                    </span>{" "}
                                    en Historial de equipos
                                </div>
                                <ArrowRight className="w-4 h-4 text-primario-700 shrink-0" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
