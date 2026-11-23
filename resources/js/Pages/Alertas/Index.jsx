import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Bell,
    AlertTriangle,
    Clock,
    Info,
    Check,
    CheckCheck,
    MapPin,
    Flame,
    Calendar,
} from "lucide-react";
import FlashBanner from "@/Components/FlashBanner";

const NOMBRES_CATEGORIAS = {
    vencido: "Extintores Vencidos",
    por_vencer: "Extintores Próximos a Vencer",
    estatus: "Equipos Vacíos o Fuera de Servicio",
    mantenimiento: "Mantenimientos Programados / Atrasados",
    capacitacion: "Capacitaciones Próximas",
};

export default function Index({ alertasAgrupadas = {} }) {
    const [filtroTipo, setFiltroTipo] = useState("Todos");

    const tiposOrdenados = ["Urgente", "Próximo", "Informativo"];

    // Aplanamos temporalmente solo para saber si hay alertas en total
    const totalAlertas = Object.values(alertasAgrupadas).reduce(
        (acc, categoriasObj) => {
            const sumaCat = Object.values(categoriasObj || {}).reduce(
                (sum, lista) => sum + (Array.isArray(lista) ? lista.length : 0),
                0,
            );
            return acc + sumaCat;
        },
        0,
    );

    const marcarLeida = (id) => {
        router.patch(route("alertas.leer", id), {}, { preserveScroll: true });
    };

    const marcarTodas = () => {
        router.patch(route("alertas.leerTodas"), {}, { preserveScroll: true });
    };

    const obtenerEstiloTipo = (tipo) => {
        if (tipo === "Urgente") {
            return {
                borde: "border-l-4 border-l-primario-700",
                badge: "bg-primario-100 text-primario-700",
                icono: AlertTriangle,
                colorIcono: "text-primario-700 bg-primario-100",
            };
        }
        if (tipo === "Próximo") {
            return {
                borde: "border-l-4 border-l-amber-500",
                badge: "bg-amber-100 text-amber-800",
                icono: Clock,
                colorIcono: "text-amber-600 bg-amber-100",
            };
        }
        return {
            borde: "border-l-4 border-l-acento-500",
            badge: "bg-acento-500/15 text-acento-500",
            icono: Info,
            colorIcono: "text-acento-500 bg-acento-500/15",
        };
    };

    return (
        <AdminLayout>
            <Head title="Alertas y notificaciones" />

            <div className="w-full max-w-7xl mx-auto space-y-6">
                {/* Encabezado y botón de marcar todas */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-titulo-1 font-bold text-neutro-900">
                            Centro de Alertas y Notificaciones
                        </h1>
                        <p className="text-xs text-neutro-600 mt-0.5">
                            Monitoreo de vencimientos, estados críticos,
                            mantenimientos y capacitaciones
                        </p>
                    </div>

                    {totalAlertas > 0 && (
                        <button
                            type="button"
                            onClick={marcarTodas}
                            className="inline-flex items-center gap-2 bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span>
                                Marcar todas como leídas ({totalAlertas})
                            </span>
                        </button>
                    )}
                </div>
                <FlashBanner />
                {/* Filtros por Tipo de Gravedad */}
                <div className="flex flex-wrap items-center gap-2">
                    {["Todos", ...tiposOrdenados].map((tipo) => (
                        <button
                            key={tipo}
                            type="button"
                            onClick={() => setFiltroTipo(tipo)}
                            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                filtroTipo === tipo
                                    ? "bg-neutro-900 text-white border-neutro-900"
                                    : "bg-white text-neutro-600 border-neutro-100 hover:bg-neutro-50 hover:text-neutro-900"
                            }`}
                        >
                            {tipo}
                        </button>
                    ))}
                </div>

                {/* Listado agrupado por Tipo y Categoría como lo envía AlertaController */}
                {totalAlertas === 0 ? (
                    <div className="bg-white rounded-xl border border-neutro-100 p-12 text-center shadow-sm">
                        <Bell className="w-10 h-10 text-neutro-300 mx-auto mb-3 opacity-60" />
                        <h2 className="text-titulo-2 font-bold text-neutro-900">
                            Sin alertas pendientes
                        </h2>
                        <p className="text-xs text-neutro-600 mt-1">
                            Todas las notificaciones han sido atendidas o
                            marcadas como leídas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {tiposOrdenados
                            .filter(
                                (t) =>
                                    filtroTipo === "Todos" || filtroTipo === t,
                            )
                            .map((tipo) => {
                                const categoriasDelTipo =
                                    alertasAgrupadas[tipo];
                                if (!categoriasDelTipo) return null;

                                const estilo = obtenerEstiloTipo(tipo);
                                const IconoTipo = estilo.icono;

                                return (
                                    <div key={tipo} className="space-y-4">
                                        <div className="flex items-center gap-2 border-b border-neutro-100 pb-2">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${estilo.badge}`}
                                            >
                                                {tipo}
                                            </span>
                                        </div>

                                        {Object.entries(categoriasDelTipo).map(
                                            ([categoriaKey, listaAlertas]) => (
                                                <div
                                                    key={categoriaKey}
                                                    className="space-y-3"
                                                >
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutro-600 pl-1">
                                                        {NOMBRES_CATEGORIAS[
                                                            categoriaKey
                                                        ] || categoriaKey}
                                                    </h3>

                                                    <div className="grid grid-cols-1 gap-3">
                                                        {listaAlertas.map(
                                                            (alerta) => (
                                                                <div
                                                                    key={
                                                                        alerta.id
                                                                    }
                                                                    className={`bg-white rounded-xl p-4 shadow-sm border border-neutro-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${estilo.borde}`}
                                                                >
                                                                    <div className="flex items-start gap-3.5">
                                                                        <div
                                                                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${estilo.colorIcono}`}
                                                                        >
                                                                            <IconoTipo className="w-5 h-5" />
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-sm font-bold text-neutro-900">
                                                                                {
                                                                                    alerta.mensaje
                                                                                }
                                                                            </p>

                                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutro-600">
                                                                                <span className="inline-flex items-center gap-1 font-semibold text-neutro-900">
                                                                                    <Flame className="w-3.5 h-3.5 text-primario-500" />
                                                                                    {
                                                                                        alerta.referencia
                                                                                    }
                                                                                </span>

                                                                                <span className="inline-flex items-center gap-1">
                                                                                    <MapPin className="w-3.5 h-3.5 text-neutro-300" />
                                                                                    {
                                                                                        alerta.ubicacion
                                                                                    }
                                                                                </span>

                                                                                <span className="inline-flex items-center gap-1 text-neutro-300">
                                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                                    {
                                                                                        alerta.fecha_generada
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            marcarLeida(
                                                                                alerta.id,
                                                                            )
                                                                        }
                                                                        className="self-end sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutro-100 hover:border-acento-500 hover:bg-acento-500/10 text-xs font-semibold text-neutro-600 hover:text-acento-500 transition cursor-pointer shrink-0"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                        <span>
                                                                            Marcar
                                                                            leída
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
