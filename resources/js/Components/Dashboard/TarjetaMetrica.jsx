export default function TarjetaMetrica({
    titulo,
    valor,
    detalle,
    colorTexto = "text-neutro-900",
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start mt-1">
            <h2 className="text-titulo-2">{titulo}</h2>
            <p className={`text-titulo-principal mt-2 ${colorTexto}`}>
                {valor}
            </p>
            <p className="text-neutro-300 text-xs">{detalle}</p>
        </div>
    );
}
