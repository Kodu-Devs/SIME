import { Lightbulb, AlertTriangle, Info } from "lucide-react";
import TextoEnriquecido from "@/Components/Ayuda/TextoEnriquecido";

const CONFIG_AVISO = {
    consejo: {
        titulo: "Consejo",
        Icono: Lightbulb,
        contenedor: "bg-acento-500/10 border-acento-500/30",
        acento: "text-acento-500",
    },
    importante: {
        titulo: "Importante",
        Icono: AlertTriangle,
        contenedor: "bg-primario-100 border-primario-300",
        acento: "text-primario-700",
    },
    nota: {
        titulo: "Nota",
        Icono: Info,
        contenedor: "bg-neutro-50 border-neutro-100",
        acento: "text-neutro-600",
    },
};

export default function AvisoAyuda({ tipo = "nota", texto }) {
    if (!texto) return null;

    const config = CONFIG_AVISO[tipo] || CONFIG_AVISO.nota;
    const Icono = config.Icono;

    return (
        <div
            role="note"
            className={`rounded-lg border p-3.5 flex items-start gap-3 ${config.contenedor}`}
        >
            <Icono
                className={`w-4 h-4 shrink-0 mt-0.5 ${config.acento}`}
                aria-hidden="true"
            />
            <div className="min-w-0 text-sm leading-relaxed text-neutro-900">
                <p className={`text-xs font-bold mb-0.5 ${config.acento}`}>
                    {config.titulo}
                </p>
                <p>
                    <TextoEnriquecido texto={texto} />
                </p>
            </div>
        </div>
    );
}
