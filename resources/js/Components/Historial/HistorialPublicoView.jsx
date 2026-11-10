import React, { useState } from 'react';
import TablaTiposExtintor from './TablaTiposExtintor';
import ComoUsarExtintor from './ComoUsarExtintor';
import TarjetaTipoFuego from './TarjetaTipoFuego';
import MetodoTapa from './MetodoTapa';

import { clasesFuego } from '../../data/aprende';

export default function HistorialPublicoView() {
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    return (
        <div className="space-y-10 font-sans">
            
            {!mostrarDetalles ? (
                <>
                    <div className="mb-6">
                        <h1 className="text-[32px] font-bold text-[#272222] mb-1">Aprende</h1>
                        <p className="text-[20px] text-[#6D6162]">Información según el tipo de extintor</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-2/3 flex-shrink-0">
                            <TablaTiposExtintor />
                        </div>
                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
                            <ComoUsarExtintor />
                            
                            <button 
                                onClick={() => setMostrarDetalles(true)}
                                className="w-full bg-[#F24C52] hover:bg-[#C0262D] text-white font-semibold text-[15px] py-4 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                Ver mas información
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <button 
                        onClick={() => setMostrarDetalles(false)}
                        className="text-[#6D6162] hover:text-[#272222] font-semibold text-[15px] flex items-center mb-4 transition-colors"
                    >
                        ← Volver a la vista general
                    </button>

                    <div>
                        <span className="text-[#F24C52] text-[10px] font-bold uppercase tracking-wider mb-1 block">Antes de que lo necesites</span>
                        <h2 className="text-[32px] font-bold text-[#272222] mb-6">Guía de tipos de fuego y extintores</h2>
                        
                        {clasesFuego.map((clase) => (
                            <TarjetaTipoFuego 
                                key={clase.id} 
                                letra={clase.letra} 
                                titulo={clase.titulo} 
                            >
                                {/* Identificación */}
                                <div>
                                    <h4 className="text-[13px] text-[#6D6162] mb-1.5">Identificación</h4>
                                    <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                        {clase.identificacion}
                                    </div>
                                </div>
                                
                                {/* Combustibles */}
                                <div>
                                    <h4 className="text-[13px] text-[#6D6162] mb-1.5">Combustibles</h4>
                                    <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                        {clase.combustibles}
                                    </div>
                                </div>

                                {/* Extintores recomendados (Cajas separadas) */}
                                <div>
                                    <h4 className="text-[13px] text-[#6D6162] mb-1.5">Extintores recomendados</h4>
                                    <div className="flex flex-col gap-2">
                                        {clase.extintoresRecomendados.map((ext, index) => (
                                            <div key={index} className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                                <strong className="font-semibold">{ext.nombre}: </strong> {ext.desc}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Áreas comunes */}
                                {clase.areasComunes && (
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">Áreas comunes</h4>
                                        <div className="flex flex-col gap-2">
                                            {Array.isArray(clase.areasComunes) ? (
                                                clase.areasComunes.map((area, index) => (
                                                    <div key={index} className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                                        <strong className="font-semibold">{area.nombre}</strong><br/>
                                                        <span className="text-[#6D6162]">{area.desc}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                                    {clase.areasComunes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Ubicación */}
                                {clase.ubicacion && (
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">Ubicación</h4>
                                        <div className="text-[15px] text-[#272222] bg-[#EAEAEA] py-3 px-4 rounded-lg">
                                            {clase.ubicacion}
                                        </div>
                                    </div>
                                )}

                                {/* Cómo se usa y seguridad (Cajas separadas) */}
                                {clase.comoSeUsa && clase.comoSeUsa.length > 0 && (
                                    <div>
                                        <h4 className="text-[13px] text-[#6D6162] mb-1.5">Cómo se usa y seguridad</h4>
                                        <div className="flex flex-col gap-2">
                                            {clase.comoSeUsa.map((paso, index) => (
                                                <div key={index} className="flex bg-[#EAEAEA] py-3 px-4 rounded-lg items-start">
                                                    <span className="text-[#F24C52] font-bold text-xl mr-4 leading-none">{index + 1}</span>
                                                    <p className="text-[15px] text-[#272222]">{paso}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Alertas con icono SVG idéntico a Figma */}
                                {clase.alertas && clase.alertas.map((alerta, index) => (
                                    <div key={index} className="mt-2 p-4 bg-[#FDF2F2] rounded-lg flex items-start">
                                        <svg className="w-5 h-5 text-[#F24C52] mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-[15px] text-[#F24C52]">
                                            <strong className="font-bold">{alerta.tipo}: </strong> {alerta.texto}
                                        </p>
                                    </div>
                                ))}
                            </TarjetaTipoFuego>
                        ))}
                    </div>

                    <MetodoTapa />
                    
                </div>
            )}
        </div>
    );
}