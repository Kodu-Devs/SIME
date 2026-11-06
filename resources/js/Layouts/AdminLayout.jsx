import { Link, router, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import Dropdown from "@/Components/Dropdown";
import BarraBusqueda from "@/Components/BarraBusqueda";
import {
    LayoutDashboard,
    MapPin,
    Flame,
    CalendarDays,
    History,
    Bell,
    ChevronDown,
    User,
    LogOut,
    Check,
    CheckCheck,
    AlertTriangle,
    Clock,
    Info,
    ArrowRight,
} from "lucide-react";

export default function AdminLayout({ children }) {
    // Leemos auth y el objeto alertas que envía HandleInertiaRequests.php
    const { auth, alertas } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);
    const popoverRef = useRef(null);

    const totalNoLeidas = alertas?.no_leidas ?? 0;
    const alertasRecientes = alertas?.recientes ?? [];
    const conteoPorTipo = alertas?.por_tipo ?? {};

    // Cerrar el popover de notificaciones al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Marcar una alerta individual como leída (PATCH /alertas/{alerta}/leer)
    const marcarUnaLeida = (id) => {
        router.patch(route("alertas.leer", id), {}, { preserveScroll: true });
    };

    // Marcar todas como leídas (PATCH /alertas/leer-todas)
    const marcarTodasLeidas = () => {
        router.patch(route("alertas.leerTodas"), {}, { preserveScroll: true });
    };

    // Estilos e íconos según el tipo de alerta ('Urgente', 'Próximo', 'Informativo')
    const configTipoAlerta = (tipo) => {
        switch (tipo) {
            case "Urgente":
                return {
                    badge: "bg-primario-100 text-primario-700 border-primario-300",
                    icono: AlertTriangle,
                    colorIcono: "text-primario-700 bg-primario-100",
                };
            case "Próximo":
                return {
                    badge: "bg-amber-100 text-amber-800 border-amber-300",
                    icono: Clock,
                    colorIcono: "text-amber-600 bg-amber-100",
                };
            default:
                return {
                    badge: "bg-acento-500/15 text-acento-500 border-acento-500/30",
                    icono: Info,
                    colorIcono: "text-acento-500 bg-acento-500/15",
                };
        }
    };

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
            icon: MapPin,
        },
        {
            name: "Extintores",
            route: "extintores.index",
            active: "extintores.*",
            icon: Flame,
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
                    {/* Buscador Global de Comandos */}
                    <BarraBusqueda />

                    {/* Acciones Derecha: Campana de Notificaciones + Menú Administrador */}
                    <div className="flex items-center gap-3 relative">
                        <div ref={popoverRef} className="relative">
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
                                        {totalNoLeidas > 99
                                            ? "99+"
                                            : totalNoLeidas}
                                    </span>
                                )}
                            </button>

                            {/* POPOVER DE NOTIFICACIONES CONECTADO A AlertaService::resumenCampana() */}
                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-neutro-100 overflow-hidden z-50">
                                    {/* Cabecera del Popover */}
                                    <div className="px-4 py-3 bg-neutro-50/70 border-b border-neutro-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-etiqueta text-neutro-900 font-bold">
                                                Notificaciones
                                            </h3>
                                            {totalNoLeidas > 0 && (
                                                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-primario-100 text-primario-700">
                                                    {totalNoLeidas} nuevas
                                                </span>
                                            )}
                                        </div>

                                        {totalNoLeidas > 0 && (
                                            <button
                                                type="button"
                                                onClick={marcarTodasLeidas}
                                                className="inline-flex items-center gap-1 text-xs text-primario-500 hover:text-primario-700 font-semibold transition"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" />
                                                <span>Marcar todas</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Resumen rápido por gravedad (si hay alertas) */}
                                    {totalNoLeidas > 0 && (
                                        <div className="px-4 py-2 bg-white border-b border-neutro-50 flex items-center gap-2 text-[11px]">
                                            {conteoPorTipo.Urgente > 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-primario-100 text-primario-700 font-semibold">
                                                    {conteoPorTipo.Urgente}{" "}
                                                    Urgentes
                                                </span>
                                            )}
                                            {conteoPorTipo["Próximo"] > 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                                                    {conteoPorTipo["Próximo"]}{" "}
                                                    Próximas
                                                </span>
                                            )}
                                            {conteoPorTipo.Informativo > 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-acento-500/15 text-acento-500 font-semibold">
                                                    {conteoPorTipo.Informativo}{" "}
                                                    Info
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Lista de las 5 alertas más recientes */}
                                    {alertasRecientes.length > 0 ? (
                                        <ul className="max-h-80 overflow-y-auto divide-y divide-neutro-50">
                                            {alertasRecientes.map((item) => {
                                                const estilo = configTipoAlerta(
                                                    item.tipo,
                                                );
                                                const IconoAlerta =
                                                    estilo.icono;

                                                return (
                                                    <li
                                                        key={item.id}
                                                        className="p-3.5 hover:bg-neutro-50/80 transition flex items-start justify-between gap-3"
                                                    >
                                                        <div className="flex items-start gap-3 min-w-0">
                                                            <div
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${estilo.colorIcono}`}
                                                            >
                                                                <IconoAlerta className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span
                                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${estilo.badge}`}
                                                                    >
                                                                        {
                                                                            item.tipo
                                                                        }
                                                                    </span>
                                                                    <span className="text-[11px] font-semibold text-neutro-900 truncate">
                                                                        {
                                                                            item.mensaje
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-neutro-600 font-medium truncate mt-1">
                                                                    {
                                                                        item.referencia
                                                                    }
                                                                </p>
                                                                <p className="text-[11px] text-neutro-300 truncate">
                                                                    {
                                                                        item.ubicacion
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                marcarUnaLeida(
                                                                    item.id,
                                                                )
                                                            }
                                                            title="Marcar como leída"
                                                            className="p-1.5 rounded-lg text-neutro-300 hover:text-acento-500 hover:bg-acento-500/10 transition shrink-0"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="py-8 px-4 text-center">
                                            <Bell className="w-8 h-8 text-neutro-300 mx-auto mb-2 opacity-60" />
                                            <p className="text-etiqueta font-semibold text-neutro-900">
                                                Todo al día
                                            </p>
                                            <p className="text-xs text-neutro-600 mt-0.5">
                                                No tienes alertas pendientes por
                                                revisar.
                                            </p>
                                        </div>
                                    )}

                                    {/* Pie del Popover para ir a la vista completa Alertas/Index */}
                                    <div className="p-2.5 bg-neutro-50 border-t border-neutro-100">
                                        <Link
                                            href={route("alertas.index")}
                                            onClick={() =>
                                                setShowNotifications(false)
                                            }
                                            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-primario-700 hover:bg-primario-100/60 flex items-center justify-center gap-1.5 transition"
                                        >
                                            <span>
                                                Ver todas las notificaciones
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

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

            {/* 3. BARRA INFERIOR (SOLO MÓVIL) */}
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
                                    ? "text-primario-500"
                                    : "text-neutro-300 hover:text-white"
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
