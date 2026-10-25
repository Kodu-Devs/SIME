export default function TarjetaMetrica({
    titulo,
    cantidad,
    subtitulo,
    colorCantidad,
}) {
    return (
        <div className="tarjetas">
            <h2>{titulo}</h2>
            <span className={colorCantidad}>{cantidad}</span>
            <p>{subtitulo}</p>
        </div>
    );
}
