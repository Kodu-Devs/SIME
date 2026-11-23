import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function FlashBanner() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4500);
            return () => clearTimeout(timer);
        }
        setVisible(false);
    }, [flash?.success, flash?.error]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const esExito = Boolean(flash?.success);

    return (
        <div
            className={`flex items-center justify-between p-3.5 rounded-xl border shadow-xs transition-all duration-300 ${
                esExito
                    ? "bg-acento-500/15 border-acento-500/30 text-[#10706B]"
                    : "bg-primario-100 border-primario-300 text-primario-700"
            }`}
        >
            <div className="flex items-center gap-2.5">
                {esExito ? (
                    <CheckCircle2 className="w-4 h-4 text-acento-500 shrink-0" />
                ) : (
                    <AlertCircle className="w-4 h-4 text-primario-700 shrink-0" />
                )}
                <span className="text-xs font-semibold">
                    {flash.success || flash.error}
                </span>
            </div>
            <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Cerrar aviso"
                className="p-1 rounded-lg transition-colors hover:bg-black/5 cursor-pointer"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
