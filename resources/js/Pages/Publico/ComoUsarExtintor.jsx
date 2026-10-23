import React from "react";

export default function ComoUsarExtintores(){
    return(
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                ¿Cómo usar un extintor correctamente?
            </h1>
            <p className="mb-6 text-gray-600">
                En caso de emergencia, siga la regla PASO (Jalar, Apuntar, Apretar, Abanicar):
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li><strong>Jale (PULL):</strong> Quite el pasador de seguridad rompiendo el sello plástico.</li>
                <li><strong>Apunte (AIM):</strong> Apunte la boquilla o manguera hacia la base del fuego, no a las llamas.</li>
                <li><strong>Aprete (SQUEEZE):</strong> Apriete la palanca para liberar el agente extintor.</li>
                <li><strong>Abanique (SWEEP):</strong> Mueva la manguera de lado a lado cubriendo la base del fuego.</li>
            </ol>
        </div>
    );
}