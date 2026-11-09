import React from 'react';
import { Plus } from 'lucide-react';

export default function ExtintoresHeader({ onAddNew }) {
    return (
        <div className="flex items-center justify-between mb-4 font-['Manrope']">
            <div>
                <h1 className="text-2xl font-black text-[#272222] tracking-tight">Extintores</h1>
                <p className="text-xs text-[#6D6162] font-medium mt-0.5">Inventario completo</p>
            </div>

            {/* Botón rápido visible exclusivamente en móviles */}
            {onAddNew && (
                <div className="block md:hidden">
                    <button
                        type="button"
                        onClick={onAddNew}
                        className="inline-flex items-center gap-1 bg-[#F24C52] hover:bg-[#C0262D] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Añadir
                    </button>
                </div>
            )}
        </div>
    );
}