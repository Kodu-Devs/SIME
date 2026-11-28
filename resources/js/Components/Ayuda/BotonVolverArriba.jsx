import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const UMBRAL_SCROLL = 400;

export default function BotonVolverArriba({ alVolverArriba }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const manejarScroll = () => {
            setVisible(window.scrollY > UMBRAL_SCROLL);
        };

        manejarScroll();
        window.addEventListener("scroll", manejarScroll, { passive: true });
        return () => window.removeEventListener("scroll", manejarScroll);
    }, []);

    if (!visible) return null;

    const manejarClick = () => {
        const reducir = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        )?.matches;

        window.scrollTo({
            top: 0,
            behavior: reducir ? "auto" : "smooth",
        });

        if (window.location.hash) {
            window.history.replaceState(
                window.history.state,
                "",
                window.location.pathname + window.location.search,
            );
        }

        if (alVolverArriba) {
            alVolverArriba();
        }
    };

    return (
        <button
            type="button"
            onClick={manejarClick}
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="fixed right-4 md:right-6 bottom-20 md:bottom-6 z-30 w-11 h-11 rounded-full bg-white border border-neutro-100 shadow-lg text-neutro-900 hover:bg-neutro-50 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario-500 focus-visible:ring-offset-2"
        >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
    );
}
