import React from 'react';

export default function TarjetaTipoFuego({ letra, titulo, children }) {
    const coloresPorLetra = {
        'A': 'bg-[#b6f0aa] text-[#1c644c]',
        'B': 'bg-[#fcd2d1] text-[#9b2c2c]',
        'C': 'bg-[#d0dbfa] text-[#1a237e]',
        'D': 'bg-[#fce599] text-[#b36b00]',
        'K': 'bg-[#d9d9d9] text-[#4a4a4a]'
    };

    const colorActual = coloresPorLetra[letra] || 'bg-gray-200 text-gray-800';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center mb-6">
                <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg mr-4 ${colorActual}`}>
                    {letra}
                </span>
                <h3 className="text-[24px] font-bold text-[#272222]">{titulo}</h3>
            </div>
            {/* Contenedor principal de las secciones con espacio entre ellas */}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}