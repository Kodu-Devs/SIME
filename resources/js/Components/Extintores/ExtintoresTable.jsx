import React from 'react';

export default function ExtintoresTable({ extintores = [], selectedExtintor, onSelectExtintor }) {
    const renderBadge = (status = '') => {
        const s = status.toLowerCase();
        let config = {
            bg: 'bg-neutral-100',
            text: 'text-neutral-700',
            dot: 'bg-neutral-400',
            label: status || 'Disponible'
        };

        if (s.includes('dispon') || s.includes('operativ') || s.includes('vigent')) {
            config = { bg: 'bg-[#D6F4F2]', text: 'text-[#10706B]', dot: 'bg-[#1C9691]', label: 'Disponible' };
        } else if (s.includes('medio') || s.includes('mantenim')) {
            config = { bg: 'bg-[#FEEFD9]', text: 'text-[#A05C06]', dot: 'bg-[#F2994A]', label: 'Medio uso' };
        } else if (s.includes('vac') || s.includes('vencid')) {
            config = { bg: 'bg-[#FDDEDF]', text: 'text-[#C0262D]', dot: 'bg-[#C0262D]', label: 'Vacío' };
        } else if (s.includes('baja') || s.includes('fuera')) {
            config = { bg: 'bg-neutral-200', text: 'text-neutral-700', dot: 'bg-neutral-800', label: 'Fuera de servicio' };
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
            </span>
        );
    };

    return (
        <div>
            {/* ESCRITORIO: TABLA */}
            <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#EDEDED] text-neutral-600 font-semibold text-xs tracking-wider">
                            <tr>
                                <th scope="col" className="px-5 py-3.5 font-bold text-neutral-600">CÓDIGO</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-neutral-600">TIPO</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-neutral-800">
                                    <span className="inline-flex items-center gap-1">
                                        UBICACIÓN
                                        <span className="text-[10px]">↑</span>
                                    </span>
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-neutral-600">PRÓXIMO MANT.</th>
                                <th scope="col" className="px-5 py-3.5 font-bold text-neutral-600 text-center">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white">
                            {extintores.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-8 text-center text-xs text-neutral-400">
                                        No hay extintores registrados para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                extintores.map((extintor) => {
                                    const isSelected = selectedExtintor?.id === extintor.id;
                                    return (
                                        <tr
                                            key={extintor.id}
                                            onClick={() => onSelectExtintor(isSelected ? null : extintor)}
                                            className={`cursor-pointer transition-colors ${isSelected
                                                ? 'bg-[#FDEDED]'
                                                : 'hover:bg-[#FDEDED]' /* <--- CAMBIO AQUÍ */
                                                }`}
                                        >
                                            <td className="px-5 py-4 font-normal text-neutral-800 text-xs">
                                                {extintor.codigo}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-neutral-800 text-xs">
                                                {extintor.tipo}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-neutral-800 text-xs">{extintor.area_nombre}</div>
                                                {(extintor.edificio || extintor.piso) && (
                                                    <div className="text-[11px] text-neutral-500 mt-0.5">
                                                        {extintor.edificio} {extintor.piso ? `- ${extintor.piso}` : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-neutral-800 text-xs">
                                                {extintor.proximo_mantenimiento}
                                            </td>
                                            <td className="px-5 py-4 text-center">
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

            {/* MÓVIL: TARJETAS (CARDS) */}
            <div className="block md:hidden space-y-3.5">
                {extintores.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400 bg-white rounded-2xl border border-neutral-100">
                        No hay extintores registrados para mostrar.
                    </div>
                ) : (
                    extintores.map((extintor) => {
                        const isSelected = selectedExtintor?.id === extintor.id;
                        return (
                            <div
                                key={extintor.id}
                                onClick={() => onSelectExtintor(isSelected ? null : extintor)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${isSelected
                                    ? 'bg-[#FDEDED] border-[#F9CACB]'
                                    : 'bg-white border-neutral-100 hover:bg-[#FDEDED] hover:border-[#F9CACB]' /* <--- CAMBIO AQUÍ */
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-neutral-500 font-medium">
                                        {extintor.codigo}
                                    </span>
                                    {renderBadge(extintor.estado)}
                                </div>

                                <div className="flex items-center gap-6 mt-2 text-xs">
                                    <div>
                                        <span className="font-bold text-neutral-800">Tipo: </span>
                                        <span className="text-neutral-700 font-semibold">{extintor.tipo}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-neutral-800">Próximo mantenimiento: </span>
                                        <span className="text-neutral-700 font-semibold">{extintor.proximo_mantenimiento}</span>
                                    </div>
                                </div>

                                <div className="mt-2.5">
                                    <div className="font-bold text-xs text-neutral-900">
                                        {extintor.area_nombre}
                                    </div>
                                    {(extintor.edificio || extintor.piso) && (
                                        <div className="text-[11px] text-neutral-500 mt-0.5">
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