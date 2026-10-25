export default function PanelAgenda({ proximosEventos }) {
    return (
        <div className="agenda">
            <div>
                <h2>Próximo en la agenda</h2>
                <p>Ver agenda</p>
            </div>

            {proximosEventos.map((proximoEvento, index) => (
                <div key={index}>
                    {/* Fecha del evento */}
                    <div>
                        <span>[{proximoEvento.dia}]</span>
                        <span>[{proximoEvento.mes}]</span>
                    </div>

                    {/* Detalles del evento */}
                    <div>
                        <p>
                            <b>{proximoEvento.titulo}</b>
                        </p>
                        <p>{proximoEvento.tipo}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
