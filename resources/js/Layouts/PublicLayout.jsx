import { Link } from "@inertiajs/react";

export default function PublicLayout({
    children,
    stats = { total: 31, vigentes: 27, edificios: 6 },
}) {
    const publicNav = [
        { name: "Mapa", route: "mapa.index", active: "mapa.*" },
        { name: "Agenda", route: "agenda.index", active: "agenda.*" },
        {
            name: "Aprende más",
            route: "historial.index",
            active: "historial.*",
        },
    ];
    return (
        <div className="min-h-screen bg-neutro-50 text-neutro-900 flex flex-col">
            {/* Banner Superior de Emergencia 911 */}
            <div className="bg-primario-900 text-white px-4 py-2 text-xs sm:text-etiqueta flex justify-between items-center">
                <span>En caso de incendio: Evacúa y llama</span>
                <span className="font-bold">Emergencias 911</span>
            </div>

            {/* Header de Navegación Pública */}
            <header className="bg-white border-b border-neutro-100 px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[url('/img/Logo.png')] bg-contain bg-center bg-no-repeat w-10 h-10 "></span>
                    <span className="border-l border-neutro-100 pl-3 text-xs text-neutro-600">
                        TecNM Campus Lagos de Moreno
                    </span>
                </div>

                <nav className="flex items-center gap-2 sm:gap-6">
                    {publicNav.map((item) => (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`px-3 py-1.5 text-etiqueta transition delay-50 duration-400 ${
                                route().current(item.route)
                                    ? "rounded-b-sm border-b-2 border-primario-900 bg-gradient-to-t from-primario-500/20 via-primario-100/40 to-white text-neutro-900 "
                                    : "hover:rounded-b-sm hover:border-b-2 hover:border-primario-900/50 hover:bg-gradient-to-t hover:from-primario-500/5 hover:via-primario-100/20 text-neutro-300 hover:text-neutro-900"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <Link
                    href={route("login")}
                    className="rounded-lg border border-neutro-100 px-4 py-2 text-etiqueta text-neutro-900 hover:bg-neutro-50"
                >
                    Acceso Administrador
                </Link>
            </header>

            {/* Contenido de la Vista Pública */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
