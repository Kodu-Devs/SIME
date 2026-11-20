export default function TarjetaMetrica({
    titulo,
    valor,
    detalle,
    colorTexto = "text-neutro-900",
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`bg-white rounded-xl border border-neutro-100 shadow-sm p-6 flex flex-col items-start mt-1 transition-all ${
                onClick
                    ? "cursor-pointer hover:border-primario-300 hover:shadow-md"
                    : ""
            }`}
        >
            <h2 className="text-titulo-2 font-bold text-neutro-900">
                {titulo}
            </h2>
            <p className={`text-titulo-principal mt-2 ${colorTexto}`}>
                {valor}
            </p>
            <p className="text-neutro-600 text-xs mt-0.5">{detalle}</p>
        </div>
    );
}
