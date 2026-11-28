export default function TextoEnriquecido({ texto = "" }) {
    if (!texto) return null;

    const partes = String(texto).split("**");
    if (partes.length === 1) {
        return <>{texto}</>;
    }

    const tieneCierreFinal = partes.length % 2 === 1;

    return (
        <>
            {partes.map((parte, indice) => {
                const esNegrita =
                    indice % 2 === 1 &&
                    (tieneCierreFinal || indice < partes.length - 1);

                if (esNegrita) {
                    return (
                        <strong
                            key={indice}
                            className="font-semibold text-neutro-900"
                        >
                            {parte}
                        </strong>
                    );
                }

                if (!tieneCierreFinal && indice === partes.length - 1) {
                    return <span key={indice}>{`**${parte}`}</span>;
                }

                return <span key={indice}>{parte}</span>;
            })}
        </>
    );
}
