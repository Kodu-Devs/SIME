import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function ImagenAyuda({ imagen }) {
    const [error, setError] = useState(false);
    const [abierta, setAbierta] = useState(false);
    const botonMiniaturaRef = useRef(null);
    const botonCerrarRef = useRef(null);

    const cerrar = () => {
        setAbierta(false);
        requestAnimationFrame(() => {
            botonMiniaturaRef.current?.focus();
        });
    };

    useEffect(() => {
        if (!abierta) return undefined;

        document.body.classList.add("overflow-hidden");
        botonCerrarRef.current?.focus();

        const manejarTecla = (e) => {
            if (e.key === "Escape") {
                cerrar();
            }
        };

        document.addEventListener("keydown", manejarTecla);

        return () => {
            document.body.classList.remove("overflow-hidden");
            document.removeEventListener("keydown", manejarTecla);
        };
    }, [abierta]);

    if (!imagen?.src || error) {
        return null;
    }

    return (
        <>
            <figure className="pt-1">
                <button
                    ref={botonMiniaturaRef}
                    type="button"
                    onClick={() => setAbierta(true)}
                    aria-label={`Ampliar imagen: ${imagen.alt}`}
                    className="block w-full text-left rounded-lg overflow-hidden border border-neutro-100 bg-neutro-50/40 hover:border-neutro-300 transition-colors cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario-500 focus-visible:ring-offset-2"
                >
                    <img
                        src={imagen.src}
                        alt={imagen.alt}
                        loading="lazy"
                        decoding="async"
                        onError={() => setError(true)}
                        className="w-full max-w-full h-auto rounded-lg object-contain"
                    />
                </button>
            </figure>

            {abierta && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={imagen.alt}
                    onClick={cerrar}
                    className="fixed inset-0 z-50 bg-neutro-900/80 flex items-center justify-center p-4 sm:p-8"
                >
                    <button
                        ref={botonCerrarRef}
                        type="button"
                        onClick={cerrar}
                        aria-label="Cerrar imagen"
                        className="fixed top-4 right-4 p-2 rounded-full bg-white text-neutro-900 hover:bg-neutro-50 shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutro-900"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-5xl max-h-[88vh] flex flex-col items-center gap-3"
                    >
                        <img
                            src={imagen.src}
                            alt={imagen.alt}
                            className="max-h-[80vh] max-w-full w-auto rounded-lg border border-neutro-100 bg-white shadow-xl object-contain"
                        />
                        {imagen.alt && (
                            <p className="text-xs text-white text-center max-w-2xl px-2">
                                {imagen.alt}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
