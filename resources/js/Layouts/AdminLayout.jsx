import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import {
    LayoutDashboard,
    Map,
    FireExtinguisher,
    CalendarDays,
    History,
    Bell,
    Search,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
    // Leemos tanto auth como el conteo de notificaciones que manda HandleInertiaRequests
    const { auth, notificacion } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);

    const totalNoLeidas = notificacion?.notificaciones_no_leidas ?? 0;

    const navItems = [
        {
            name: "Resumen",
            route: "dashboard",
            active: "dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Mapa",
            route: "mapa.index",
            active: "mapa.*",
            icon: Map,
        },
        {
            name: "Extintores",
            route: "extintores.index",
            active: "extintores.*",
            icon: FireExtinguisher,
        },
        {
            name: "Agenda",
            route: "agenda.index",
            active: "agenda.*",
            icon: CalendarDays,
        },
        {
            name: "Historial",
            route: "historial.index",
            active: "historial.*",
            icon: History,
        },
    ];

    return (
        <div className="min-h-screen bg-neutro-50 text-neutro-900 flex flex-col md:flex-row pb-16 md:pb-0">
            {/* 1. SIDEBAR DESKTOP Y TABLET */}
            <aside className="hidden md:flex md:w-56 md:flex-col bg-neutro-900 border-r border-neutro-100 shrink-0 min-h-screen">
                {/* Logo en el Sidebar */}
                <div className="h-16 flex items-center px-5 py-3">
                    <Link
                        href={route("dashboard")}
                        className="flex items-center"
                    >
                        <img
                            src="/img/Logo_h.png"
                            alt="Logo SIME"
                            className="w-24 h-12 object-contain"
                        />
                    </Link>
                </div>

                {/* Enlaces del Sidebar con Íconos */}
                <nav className="flex-1 px-3 py-3 space-y-2">
                    {navItems.map((item) => {
                        const isActive = route().current(item.active);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-etiqueta transition ${
                                    isActive
                                        ? "bg-primario-700 text-neutro-50 font-bold"
                                        : "text-neutro-300 hover:bg-primario-700/50 hover:text-neutro-50"
                                }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* 2. CONTENEDOR PRINCIPAL DERECHO */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER SUPERIOR */}
                <header className="h-16 bg-white border-b border-neutro-100 px-4 md:px-8 flex items-center justify-between gap-4">
                    {/* Buscador Global con ícono de Lupa */}
                    <div className="flex-1 max-w-md relative">
                        <Search className="w-4 h-4 text-neutro-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Buscar extintor por código o ubicación"
                            className="w-full rounded-lg border-neutro-100 bg-neutro-50 pl-10 pr-4 py-2 text-etiqueta text-neutro-900 placeholder-neutro-300 focus:border-acento-500 focus:ring-acento-500"
                        />
                    </div>

                    {/* Acciones Derecha: Campana de Notificaciones + Menú Administrador */}
                    <div className="flex items-center gap-3 relative">
                        <button
                            type="button"
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="relative p-2 rounded-full text-neutro-600 hover:bg-neutro-50 hover:text-neutro-900 transition"
                        >
                            <span className="sr-only">Notificaciones</span>
                            <Bell className="w-5 h-5" />
                            {totalNoLeidas > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primario-500 text-white text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold">
                                    {totalNoLeidas}
                                </span>
                            )}
                        </button>

                        {/* Popover de Notificaciones */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-neutro-100 p-4 z-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-etiqueta text-neutro-900 font-bold">
                                        Notificaciones ({totalNoLeidas})
                                    </h3>
                                    <Link
                                        href={route("alertas.index")}
                                        className="text-xs text-primario-500 hover:underline font-semibold"
                                    >
                                        Ver todas
                                    </Link>
                                </div>
                                <div className="text-xs text-neutro-600 py-4 text-center">
                                    {totalNoLeidas > 0
                                        ? `Tienes ${totalNoLeidas} alerta(s) pendiente(s) por revisar.`
                                        : "No tienes notificaciones pendientes."}
                                </div>
                            </div>
                        )}

                        {/* Dropdown de Perfil y Cerrar Sesión */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 hover:bg-neutro-50 transition focus:outline-none border border-neutro-100"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primario-100 text-primario-700 flex items-center justify-center text-xs font-bold">
                                        AD
                                    </div>
                                    <span className="hidden sm:inline text-etiqueta text-neutro-900">
                                        {auth?.user?.name || "Administrador"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-neutro-600" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link
                                    href={route("profile.edit")}
                                    className="flex items-center gap-2"
                                >
                                    <User className="w-4 h-4 text-neutro-600" />
                                    <span>Mi Perfil</span>
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-2 text-primario-700"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Cerrar Sesión</span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* CONTENIDO DE CADA PÁGINA */}
                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>

            {/* 3. BARRA INFERIOR (SOLO MÓVIL) CON ÍCONOS */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-neutro-900 border-t border-white/10 flex justify-around items-center h-16 z-40">
                {navItems.map((item) => {
                    const isActive = route().current(item.active);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full text-[11px] font-semibold transition ${
                                isActive
                                    ? "text-primario-500 border-t-2 border-primario-700"
                                    : "text-neutro-300 hover:text-white border-t-2 border-transparent hover:border-neutro-300"
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
