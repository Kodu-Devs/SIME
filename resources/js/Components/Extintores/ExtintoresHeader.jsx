import React from "react";
import { Plus } from "lucide-react";

export default function ExtintoresHeader({ onAddNew, showAddButton = true }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-titulo-1 font-bold text-neutro-900">
                    Extintores
                </h1>
                <p className="text-xs text-neutro-600 mt-0.5">
                    Inventario completo de equipos registrados
                </p>
            </div>
            {onAddNew && showAddButton && (
                <div className="block lg:hidden shrink-0">
                    <button
                        type="button"
                        onClick={onAddNew}
                        className="inline-flex items-center gap-1.5 bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                    </button>
                </div>
            )}
        </div>
    );
}
