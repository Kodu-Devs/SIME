import React from 'react';

export default function MetodoTapa() {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pasos generales de uso (Método T-A-P-A)</h2>
            <p className="text-sm text-gray-600 mb-6">Procedimiento universal para operar un extintor (CO2, PQS o espuma) en caso de emergencia.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100/80 p-5 rounded-xl">
                    <h3 className="text-[#8c1c2c] font-bold text-lg mb-1">Tirar</h3>
                    <p className="text-sm text-gray-700 font-medium">Del pasador metálico de seguridad para romper el sello plástico.</p>
                </div>
                
                <div className="bg-gray-100/80 p-5 rounded-xl">
                    <h3 className="text-[#8c1c2c] font-bold text-lg mb-1">Apuntar</h3>
                    <p className="text-sm text-gray-700 font-medium">La manguera o boquilla hacia la base del fuego desde una distancia segura (2 a 3 metros).</p>
                </div>
                
                <div className="bg-gray-100/80 p-5 rounded-xl">
                    <h3 className="text-[#8c1c2c] font-bold text-lg mb-1">Presionar</h3>
                    <p className="text-sm text-gray-700 font-medium">La palanca superior de accionamiento con firmeza.</p>
                </div>
                
                <div className="bg-gray-100/80 p-5 rounded-xl">
                    <h3 className="text-[#8c1c2c] font-bold text-lg mb-1">Abanicar</h3>
                    <p className="text-sm text-gray-700 font-medium">De lado a lado cubriendo todo el ancho del fuego hasta apagarlo por completo.</p>
                </div>
            </div>
        </div>
    );
}