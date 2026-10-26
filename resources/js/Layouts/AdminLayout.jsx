import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Dropdown from "@/Components/Dropdown";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);

    const navItems = [
        { name: "Resumen", route: "dashboard", active: "dashboard" },
        { name: "Mapa", route: "mapa.index", active: "mapa.*" },
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
            {/* 1. SIDEBAR DESKTOP Y TABLET (Blanco con borde gris como en Figma) */}
            <aside className="hidden md:flex md:w-56 md:flex-col bg-neutro-900 border-r border-neutro-100 shrink-0 min-h-screen">
                {/* Logo en el Sidebar */}
                <div className="h-16 flex items-center px-5 py-3">
                    {/* <span className="bg-[url('/img/Logo.png')] bg-contain bg-center bg-no-repeat w-14 h-14 "></span> */}
                    <img
                        src="/img/Logo_h.png"
                        alt="Logo SIME"
                        className="w-20 h-20 object-contain"
                    />
                    {/* <Link
                        href={route("dashboard")}
                        className="text-titulo-2 font-bold text-neutro-300 tracking-wider"
                    >
                        SIMEs
                    </Link> */}
                </div>

                {/* Enlaces del Sidebar */}
                <nav className="flex-1 px-3 py-3 space-y-3">
                    {navItems.map((item) => {
                        const isActive = route().current(item.active);
                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)}
                                className={`flex items-center px-4 py-3 rounded-lg text-etiqueta transition ${
                                    isActive
                                        ? "bg-primario-700 text-neutro-50 font-bold" // Activo en Figma: fondo rosita, texto rojo
                                        : "text-neutro-300 hover:bg-primario-700/50 hover:text-neutro-50" // Inactivo: texto gris
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* 2. CONTENEDOR PRINCIPAL DERECHO */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER SUPERIOR */}
                <header className="h-16 bg-white border-b border-neutro-100 px-4 md:px-8 flex items-center justify-between gap-4">
                    {/* Buscador Global */}
                    <div className="flex-1 max-w-md">
                        <input
                            type="search"
                            placeholder="Buscar extintor por código o ubicación"
                            className="w-full rounded-lg border-neutro-100 bg-neutro-50 px-4 py-2 text-etiqueta text-neutro-900 placeholder-neutro-300 focus:border-acento-500 focus:ring-acento-500"
                        />
                    </div>

                    {/* Acciones Derecha: Campana de Notificaciones + Menú Administrador */}
                    <div className="flex items-center gap-3 relative">
                        <button
                            type="button"
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="relative p-2 rounded-full text-neutro-600 hover:bg-neutro-50 transition"
                        >
                            <span className="sr-only">Notificaciones</span>
                            🔔
                            <span className="absolute -top-1.5 -right-1.5 bg-primario-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                3
                            </span>
                        </button>

                        {/* Popover de Notificaciones */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-neutro-100 p-4 z-50 ">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-etiqueta text-neutro-900 font-bold">
                                        Notificaciones
                                    </h3>
                                    <button className="text-xs text-primario-500 hover:underline">
                                        Marcar todo como leído
                                    </button>
                                </div>
                                <div className="text-xs text-neutro-600 py-4 text-center">
                                    Aquí irá el listado de alertas
                                </div>
                            </div>
                        )}

                        {/* Dropdown de Perfil y Cerrar Sesión */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 hover:bg-neutro-50 transition focus:outline-none"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primario-100 text-primario-700 flex items-center justify-center text-xs font-bold">
                                        AD
                                    </div>
                                    <span className="hidden sm:inline text-etiqueta text-neutro-900 pr-1">
                                        {auth?.user?.name || "Administrador"}
                                    </span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route("profile.edit")}>
                                    Mi Perfil
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Cerrar Sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* CONTENIDO DE CADA PÁGINA */}
                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>

            {/* 3. BARRA INFERIOR (SOLO MÓVIL) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutro-100 flex justify-around items-center h-16 z-40">
                {navItems.map((item) => {
                    const isActive = route().current(item.active);
                    return (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`flex flex-col items-center justify-center w-full h-full text-xs font-semibold ${
                                isActive
                                    ? "text-primario-700 bg-primario-100/50"
                                    : "text-neutro-600"
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
