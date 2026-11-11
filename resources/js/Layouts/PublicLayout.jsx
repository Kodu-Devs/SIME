import { Link } from "@inertiajs/react";
import {
    Map,
    CalendarDays,
    BookOpen,
    Phone,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

export default function PublicLayout({
    children,
    stats = { total: 31, vigentes: 27, edificios: 6 },
}) {
    const publicNav = [
        { name: "Mapa", route: "mapa.index", active: "mapa.*", icon: Map },
        {
            name: "Agenda",
            route: "agenda.index",
            active: "agenda.*",
            icon: CalendarDays,
        },
        {
            name: "Aprende más",
            route: "historial.index",
            active: "historial.*",
            icon: BookOpen,
        },
    ];

    return (
        <div className="min-h-screen bg-neutro-50 text-neutro-900 flex flex-col pb-16 md:pb-0">
            {/* 1. BANNER SUPERIOR DE EMERGENCIA 911 */}
            <div className="bg-primario-900 text-white px-4 md:px-8 py-2 text-xs sm:text-etiqueta flex justify-between items-center gap-2">
                <span>En caso de incendio: Evacúa y llama</span>
                <a
                    href="tel:911"
                    className="inline-flex items-center gap-1.5 font-bold bg-primario-700/80 hover:bg-primario-700 px-3 py-1 rounded-full text-xs transition shrink-0"
                >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergencias 911</span>
                </a>
            </div>

            {/* 2. HEADER DE NAVEGACIÓN PÚBLICA */}
            <header className="bg-white border-b border-neutro-100 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
                {/* Izquierda: Logo + Nombre del Campus */}
                <Link
                    href={route("mapa.index")}
                    className="flex items-center gap-2 min-w-0"
                >
                    <span className="bg-[url('/img/Logo.png')] bg-contain bg-center bg-no-repeat w-10 h-10 shrink-0"></span>
                    <span className="border-l border-neutro-100 pl-3 text-xs text-neutro-600 truncate">
                        TecNM Campus Lagos de Moreno
                    </span>
                </Link>

                {/* Centro: Menú de Navegación (SOLO DESKTOP Y TABLET: hidden md:flex) */}
                <nav className="hidden md:flex items-center gap-6">
                    {publicNav.map((item) => {
                        const isActive = route().current(item.active);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-etiqueta transition duration-300 ${
                                    isActive
                                        ? "rounded-b-sm border-b-2 border-primario-900 bg-gradient-to-t from-primario-500/20 via-primario-100/40 to-white text-neutro-900 font-bold"
                                        : "hover:rounded-b-sm hover:border-b-2 hover:border-primario-900/50 hover:bg-gradient-to-t hover:from-primario-500/5 hover:via-primario-100/20 text-neutro-300 hover:text-neutro-900"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Derecha: Botón Acceso Administrador (Visible en Desktop y adaptado en Móvil) */}
                <Link
                    href={route("login")}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutro-100 px-3 sm:px-4 py-2 text-xs sm:text-etiqueta text-neutro-900 hover:bg-neutro-50 transition shrink-0"
                >
                    <ShieldCheck className="w-4 h-4 text-primario-700 shrink-0" />
                    <span className="hidden sm:inline">
                        Acceso Administrador
                    </span>
                    <span className="sm:hidden font-semibold">Admin</span>
                </Link>
            </header>

            {/* 3. CONTENIDO DE LA VISTA PÚBLICA */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* 4. BARRA DE NAVEGACIÓN INFERIOR (SOLO MÓVIL: md:hidden) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutro-100 flex justify-around items-center h-16 z-40 shadow-sm">
                {publicNav.map((item) => {
                    const isActive = route().current(item.active);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-semibold transition ${
                                isActive
                                    ? "text-primario-700 border-t-2 border-primario-700 bg-primario-100/30"
                                    : "text-neutro-600 hover:text-neutro-900 border-t-2 border-transparent hover:border-neutro-300"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
