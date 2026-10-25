export default function PanelRecomendaciones({ recomendaciones }) {
    return (
        <div className="recomendaciones">
            <div>
                <span>💡</span>
                <h2>Recomendaciones</h2>
            </div>

            {recomendaciones.map((recomendacion, index) => (
                <div key={index}>
                    <p>{recomendacion.mensaje}</p>
                </div>
            ))}
        </div>
    );
}
