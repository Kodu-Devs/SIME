export default function BannerAlerta({ alerta, ubicacionExtintor }) {
    if (!alerta) return null;

    return (
        <div className="banner">
            <div>
                <span>⚠️</span>
                <p>
                    <b>{alerta}</b>
                </p>
                <span>{ubicacionExtintor}</span>
            </div>

            {/* Botón de programar mantenimiento */}
        </div>
    );
}
