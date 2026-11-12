import React from 'react';

export default function TablaTiposExtintor() {
    const agentes = [
        {
            nombre: 'Polvo ABC',
            clases: [
                { status: 'excelente', texto: 'Excelente' },
                { status: 'excelente', texto: 'Excelente' },
                { status: 'excelente', texto: 'Excelente' },
                { status: 'no', texto: 'No' },
                { status: 'no', texto: 'No' }
            ]
        },
        {
            nombre: 'CO2 (Dióxido de carbono)',
            clases: [
                { status: 'poco-eficaz', texto: 'Poco eficaz' },
                { status: 'bueno', texto: 'Bueno' },
                { status: 'poco-eficaz', texto: 'Poco eficaz' },
                { status: 'no', texto: 'No' },
                { status: 'no', texto: 'No' }
            ]
        },
        {
            nombre: 'Agua + Aditivos',
            clases: [
                { status: 'excelente', texto: 'Excelente' },
                { status: 'solo-espuma', texto: 'Solo espuma' },
                { status: 'peligroso', texto: 'Peligroso' },
                { status: 'muy-peligroso', texto: 'Muy peligroso' },
                { status: 'muy-peligroso', texto: 'Muy peligroso' }
            ]
        },
        {
            nombre: 'Acetato de Potasio',
            clases: [
                { status: 'bueno', texto: 'Bueno' },
                { status: 'limitado', texto: 'Limitado' },
                { status: 'no', texto: 'No' },
                { status: 'no', texto: 'No' },
                { status: 'especifico', texto: 'Específico' }
            ]
        },
        {
            nombre: 'Polvo especial (D)',
            clases: [
                { status: 'no', texto: 'No' },
                { status: 'no', texto: 'No' },
                { status: 'no', texto: 'No' },
                { status: 'especifico', texto: 'Específico' },
                { status: 'no', texto: 'No' }
            ]
        }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'excelente':
                return 'bg-[#a3e2d4] text-[#2c6e49] border-none';
            case 'bueno':
                return 'bg-[#bae5db] text-[#1c644c] border-none';
            case 'especifico':
                return 'bg-[#bae5db] text-[#1c644c] border-none';
            case 'poco-eficaz':
            case 'solo-espuma':
            case 'limitado':
                return 'bg-[#fbeed4] text-[#b36b00] border-none';
            case 'peligroso':
            case 'muy-peligroso':
            case 'no':
                return 'bg-[#fcd2d1] text-[#9b2c2c] border-none';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const getIcon = (status) => {
        if (status === 'excelente' || status === 'bueno' || status === 'especifico') {
            return <span className="text-base mr-1">✓</span>;
        }
        if (status === 'poco-eficaz' || status === 'solo-espuma' || status === 'limitado') {
            return <span className="text-sm mr-1">⚠️</span>;
        }
        return <span className="text-base mr-1">✕</span>;
    };

    return (
        <div className="bg-[#e9e9e9] p-6 rounded-2xl h-full">
            <div className="grid grid-cols-6 gap-2 h-full">
                <div className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col justify-center items-center h-24 shadow-sm">
                    <span className="text-xs font-bold text-gray-500 block leading-tight">Tipo</span>
                    <span className="text-sm font-bold text-gray-800 leading-tight">Agente</span>
                </div>
                {['Clase A (Sólidos)', 'Clase B (Líquidos)', 'Clase C (Gases)', 'Clase D (Metales)', 'Clase K/F (Cocinas)'].map((c, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col justify-center items-center h-24 text-center shadow-sm">
                        <span className="text-sm font-bold text-gray-800 leading-tight">{c.split(' ')[0]} {c.split(' ')[1]}</span>
                        <span className="text-[11px] text-gray-400 mt-1">{c.split(' ').slice(2).join(' ')}</span>
                    </div>
                ))}

                {agentes.map((agente, idx) => (
                    <React.Fragment key={idx}>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col justify-center items-center text-center h-24 shadow-sm">
                            <span className="text-sm font-bold text-gray-800 leading-tight">{agente.nombre.split(' (')[0]}</span>
                            {agente.nombre.includes('(') && (
                                <span className="text-[10px] text-gray-400 block leading-tight mt-1">({agente.nombre.split('(')[1]}</span>
                            )}
                        </div>
                        {agente.clases.map((c, i) => (
                            <div key={i} className={`p-4 rounded-lg flex flex-col justify-center items-center h-24 text-center text-xs font-bold shadow-sm transition-all border ${getStatusStyles(c.status)}`}>
                                <div className="flex items-center justify-center">
                                    {getIcon(c.status)}
                                    <span>{c.texto}</span>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}