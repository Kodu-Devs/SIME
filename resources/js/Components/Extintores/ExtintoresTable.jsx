import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function ExtintoresTable({ extintores = [], selectedExtintor, onSelectExtintor }) {
    const renderBadge = (status = '') => {
        const s = (status || '').toLowerCase().trim();
        let config = {
            bg: 'bg-[#F1F0F0]',
            text: 'text-[#6D6162]',
            dot: 'bg-[#928586]',
            label: status || 'Disponible'
        };

        if (s.includes('dispon') || s.includes('operativ') || s.includes('vigent')) {
            config = { bg: 'bg-[#D6F4F2]', text: 'text-[#10706B]', dot: 'bg-[#1C9691]', label: 'Disponible' };
        } else if (s.includes('medio') || s.includes('mantenim') || s.includes('vencer') || s.includes('proxim')) {
            config = { bg: 'bg-[#FEEFD9]', text: 'text-[#A05C06]', dot: 'bg-[#F2994A]', label: 'Medio uso' };
        } else if (s.includes('vac') || s.includes('vencid')) {
            config = { bg: 'bg-[#FDEDED]', text: 'text-[#C0262D]', dot: 'bg-[#C0262D]', label: 'Vacío' };
        } else if (s.includes('baja') || s.includes('fuera')) {
            config = { bg: 'bg-[#D7D4D4]', text: 'text-[#272222]', dot: 'bg-[#272222]', label: 'Fuera de servicio' };
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
            </span>
        );
    };

    return (
        <div className="font-['Manrope']">
            {/* ESCRITORIO: TABLA FIGMA */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#D7D4D4] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#D7D4D4]/50 text-[#6D6162] font-bold text-xs tracking-wider">
                            <tr>
                                <th scope="col" className="px-5 py-3.5 font-bold text-[#6D6162]">CÓDIGO</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-[#6D6162]">TIPO</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-[#272222]">
                                    <span className="inline-flex items-center gap-1">
                                        UBICACIÓN
                                        <ArrowUp className="w-3.5 h-3.5 text-[#6D6162]" />
                                    </span>
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-[#6D6162]">PRÓXIMA REVISIÓN</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-[#6D6162] text-center">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D7D4D4] bg-white">
                            {extintores.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-8 text-center text-xs text-[#928586]">
                                        No hay extintores registrados para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                extintores.map((extintor) => {
                                    const isSelected = selectedExtintor?.id === extintor.id;
                                    const fechaDisplay = extintor.proxima_revision && extintor.proxima_revision !== 'Sin programar'
                                        ? extintor.proxima_revision
                                        : (extintor.proximo_mantenimiento || 'Sin programar');

                                    return (
                                        <tr
                                            key={extintor.id}
                                            onClick={() => onSelectExtintor(isSelected ? null : extintor)}
                                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#FDEDED]' : 'hover:bg-[#F1F0F0]'
                                                }`}
                                        >
                                            <td className="px-5 py-3.5 font-mono text-[#6D6162] text-[11px]">
                                                {extintor.codigo}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-[#272222] text-xs">
                                                {extintor.tipo}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="font-bold text-[#272222] text-xs">{extintor.area_nombre}</div>
                                                {(extintor.edificio || extintor.piso) && (
                                                    <div className="text-[11px] text-[#6D6162] mt-0.5">
                                                        {extintor.edificio} {extintor.piso ? `- ${extintor.piso}` : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-[#272222] text-xs">
                                                {fechaDisplay}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {renderBadge(extintor.estado)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MÓVIL: TARJETAS */}
            <div className="block md:hidden space-y-3">
                {extintores.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#928586] bg-white rounded-2xl border border-[#D7D4D4]">
                        No hay extintores registrados para mostrar.
                    </div>
                ) : (
                    extintores.map((extintor) => {
                        const isSelected = selectedExtintor?.id === extintor.id;
                        const fechaDisplay = extintor.proxima_revision && extintor.proxima_revision !== 'Sin programar'
                            ? extintor.proxima_revision
                            : (extintor.proximo_mantenimiento || 'Sin programar');

                        return (
                            <div
                                key={extintor.id}
                                onClick={() => onSelectExtintor(isSelected ? null : extintor)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${isSelected
                                    ? 'bg-[#FDEDED] border-[#F9CACB]'
                                    : 'bg-white border-[#D7D4D4] hover:bg-[#FDEDED]'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-[#6D6162]">
                                        {extintor.codigo}
                                    </span>
                                    {renderBadge(extintor.estado)}
                                </div>

                                <div className="flex items-center gap-5 mt-2 text-xs">
                                    <div>
                                        <span className="font-bold text-[#272222]">Tipo: </span>
                                        <span className="text-[#6D6162] font-semibold">{extintor.tipo}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#272222]">Próxima revisión: </span>
                                        <span className="text-[#6D6162] font-semibold">{fechaDisplay}</span>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="font-bold text-xs text-[#272222]">
                                        {extintor.area_nombre}
                                    </div>
                                    {(extintor.edificio || extintor.piso) && (
                                        <div className="text-[11px] text-[#6D6162] mt-0.5">
                                            {extintor.edificio} {extintor.piso ? `- ${extintor.piso}` : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}