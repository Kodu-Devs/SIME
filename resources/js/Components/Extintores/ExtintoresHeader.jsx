import React from 'react';

export default function ExtintoresHeader({ onAddNew }) {
    return (
        <div className="flex items-center justify-between mb-4 font-['Manrope']">
            <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Extintores</h1>
                <p className="text-xs text-neutral-600 font-medium mt-0.5">Inventario completo</p>
            </div>

            {/* Botón rápido visible solo en móviles */}
            {onAddNew && (
                <div className="block md:hidden">
                    <button
                        type="button"
                        onClick={onAddNew}
                        className="bg-[#8C1823] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-[#73121B] transition-colors"
                    >
                        + Añadir
                    </button>
                </div>
            )}
        </div>
    );
}