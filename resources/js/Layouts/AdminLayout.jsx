import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminLayout({ children, title = "SIME" }) {
    const { auth } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);

    const navItems = [
        { name: "Resumen", route: "dashboard", active: "dashboard" },
        { name: "Mapa", route: "mapa.admin", active: "mapa.admin" },
        {
            name: "Extintores",
            route: "extintores.index",
            active: "extintores.*",
        },
        { name: "Agenda", route: "agenda.index", active: "agenda.*" },
        { name: "Historial", route: "historial.index", active: "historial.*" },
    ];

    return (
        <div className="min-h-screen bg-neutro-50 text-neutro-900 flex flex-col md:flex-row pb-16 md:pb-0">
            {/* SIDEBAR DESKTOP / TABLET */}
            <aside className="hidden md:flex md:w-60 md:flex-col bg-sime-navy text-white shrink-0 min-h-screen">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="text-titulo-2 font-bold tracking-wider">
                        SIME
                    </span>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = route().current(item.active);
                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)}
                                className={`flex items-center px-4 py-3 rounded-lg text-etiqueta transition ${
                                    isActive
                                        ? "bg-primario-500 text-white"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER SUPERIOR */}
                <header className="h-16 bg-white border-b border-neutro-100 px-4 md:px-8 flex items-center justify-between gap-4">
                    {/* Buscador Global */}
                    <div className="flex-1 max-w-md">
                        <input
                            type="search"
                            placeholder="Buscar extintor por código o ubicación..."
                            className="w-full rounded-lg border-neutro-100 bg-neutro-50 px-4 py-2 text-etiqueta text-neutro-900 placeholder-neutro-300 focus:border-acento-500 focus:ring-acento-500"
                        />
                    </div>

                    {/* Acciones Derecha: Notificaciones + Perfil */}
                    <div className="flex items-center gap-4 relative">
                        <button
                            type="button"
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="relative p-2 rounded-full text-neutro-600 hover:bg-neutro-50"
                        >
                            <span className="sr-only">Notificaciones</span>
                            🔔
                            <span className="absolute -top-0.5 -right-0.5 bg-primario-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* Popover de Notificaciones (Esqueleto) */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-neutro-100 p-4 z-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-etiqueta text-neutro-900">
                                        Notificaciones
                                    </h3>
                                    <button className="text-xs text-acento-500 hover:underline">
                                        Marcar todo como leído
                                    </button>
                                </div>
                                <div className="text-xs text-neutro-600 py-4 text-center">
                                    Aquí irá el listado de alertas de
                                    AlertaController
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-sime-navy text-white flex items-center justify-center text-etiqueta">
                                AD
                            </div>
                            <span className="hidden sm:inline text-etiqueta text-neutro-900">
                                {auth?.user?.nombre || "Administrador"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO DE CADA PÁGINA */}
                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>

            {/* BOTTOM NAVIGATION BAR (SOLO MÓVIL) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-sime-navy text-white flex justify-around items-center h-16 z-40 border-t border-white/10">
                {navItems.map((item) => {
                    const isActive = route().current(item.active);
                    return (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`flex flex-col items-center justify-center w-full h-full text-xs font-semibold ${
                                isActive ? "text-primario-500" : "text-white/70"
                            }`}
                        >
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
