export default function TarjetaMetrica({
    titulo,
    cantidad,
    subtitulo,
    colorCantidad,
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-gray-500 text-sm font-bold">{titulo}</h2>
            <span className={`${colorCantidad} text-5xl font-extrabold my-2`}>
                {cantidad}
            </span>
            <p className="text-gray-400 text-xs">{subtitulo}</p>
        </div>
    );
}
