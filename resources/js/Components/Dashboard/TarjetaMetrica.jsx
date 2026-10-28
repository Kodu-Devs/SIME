export default function TarjetaMetrica({ titulo, valor, detalle }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start mt-8">
            <h2>{titulo}</h2>
            <span className="text-5xl font-extrabold my-2">{valor}</span>
            <p className="text-gray-400 text-xs">{detalle}</p>
        </div>
    );
}
