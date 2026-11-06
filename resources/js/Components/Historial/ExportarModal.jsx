import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';

const INFORMES = [
    { valor: 'usos', titulo: 'Eventos de uso', detalle: 'Fecha, extintor, ubicación, tipo de descarga y motivo.' },
    { valor: 'extintores', titulo: 'Lista de extintores', detalle: 'Tipos, capacidad, ubicación, estatus y mantenimientos.' },
];

const FORMATOS = [
    { valor: 'pdf', titulo: 'PDF', detalle: 'Listo para imprimir' },
    { valor: 'excel', titulo: 'Excel (.xlsx)', detalle: 'Para filtrar y editar' },
];

// Convierte una fecha a "aaaa-mm-dd" con la fecha LOCAL.
// (toISOString usaría UTC y de noche podría dar el día siguiente.)
const aTexto = (fecha) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

// Primer y último día del mes actual, para prellenar el periodo.
function mesActual() {
    const hoy = new Date();
    return {
        inicio: aTexto(new Date(hoy.getFullYear(), hoy.getMonth(), 1)),
        fin: aTexto(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)),
    };
}

const claseCampo =
    'mt-1 block w-full rounded-md border-neutro-100 text-sm text-neutro-900 focus:border-primario-500 focus:ring-primario-500 disabled:bg-neutro-50 disabled:text-neutro-300';

// Tarjeta de selección (tipo de informe y formato).
function OpcionTarjeta({ name, valor, actual, onChange, titulo, detalle, claseActiva, conMarca }) {
    const seleccionada = actual === valor;

    return (
        <label
            className={`relative flex cursor-pointer flex-col rounded-md border p-3 transition focus-within:ring-2 focus-within:ring-primario-300 ${
                seleccionada ? claseActiva : 'border-neutro-100 bg-white hover:bg-neutro-50'
            }`}
        >
            <input
                type="radio"
                name={name}
                value={valor}
                checked={seleccionada}
                onChange={() => onChange(valor)}
                className="sr-only"
            />
            <span className="text-etiqueta text-neutro-900">{titulo}</span>
            <span className="mt-0.5 text-xs text-neutro-600">{detalle}</span>
            {conMarca && seleccionada && (
                <svg
                    className="absolute right-3 top-3 h-5 w-5 text-acento-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </label>
    );
}

export default function ExportarModal({ abierto, onCerrar, edificios = [] }) {
    const [formato, setFormato] = useState('pdf');
    const [informe, setInforme] = useState('usos');
    const [fechaInicio, setFechaInicio] = useState(() => mesActual().inicio);
    const [fechaFin, setFechaFin] = useState(() => mesActual().fin);
    const [instalacionId, setInstalacionId] = useState('');
    const [pisoId, setPisoId] = useState('');

    const esUsos = informe === 'usos';

    // Los pisos salen del mismo arreglo de edificios (sin otra petición).
    const edificioElegido = edificios.find((e) => String(e.id) === instalacionId);
    const pisos = edificioElegido?.pisos ?? [];

    // Validación en el front: así el enlace no se abre con datos que el backend rechazaría.
    let errorFechas = null;
    if (esUsos) {
        if (!fechaInicio || !fechaFin) {
            errorFechas = 'Elige la fecha de inicio y la de fin.';
        } else if (fechaFin < fechaInicio) {
            errorFechas = 'La fecha de fin no puede ser anterior a la de inicio.';
        }
    }

    // Solo se mandan los campos que tienen valor.
    const parametros = { formato, informe };
    if (esUsos) {
        parametros.fecha_inicio = fechaInicio;
        parametros.fecha_fin = fechaFin;
    }
    if (instalacionId) parametros.instalacion_id = instalacionId;
    if (pisoId) parametros.piso_id = pisoId;

    const cambiarEdificio = (e) => {
        setInstalacionId(e.target.value);
        setPisoId(''); // al cambiar de edificio, el piso anterior ya no aplica
    };

    const alExportar = (e) => {
        if (errorFechas) {
            e.preventDefault(); // enlace deshabilitado
            return;
        }
        onCerrar(); // la descarga la maneja el navegador
    };

    return (
        <Modal show={abierto} onClose={onCerrar} maxWidth="lg">
            <div className="p-6">
               <h2 className="text-center text-titulo-2 text-neutro-900">Exportar informe</h2>
                <p className="mt-1 text-center text-sm text-neutro-600">
                    Elige qué informe quieres generar y en qué formato.
                </p>

                <fieldset className="mt-5">
                    <legend className="text-etiqueta text-neutro-900">Tipo de informe</legend>
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        {INFORMES.map((op) => (
                            <OpcionTarjeta
                                key={op.valor}
                                name="informe"
                                actual={informe}
                                onChange={setInforme}
                                claseActiva="border-primario-700 bg-primario-100"
                                {...op}
                            />
                        ))}
                    </div>
                </fieldset>

                <fieldset className="mt-5">
                    <legend className="text-etiqueta text-neutro-900">Formato</legend>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {FORMATOS.map((op) => (
                            <OpcionTarjeta
                                key={op.valor}
                                name="formato"
                                actual={formato}
                                onChange={setFormato}
                                claseActiva="border-acento-500 ring-1 ring-acento-500 bg-white"
                                conMarca
                                {...op}
                            />
                        ))}
                    </div>
                </fieldset>

                {esUsos && (
                    <fieldset className="mt-5">
                        <legend className="text-etiqueta text-neutro-900">Periodo</legend>
                        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="exp-inicio" value="Fecha de inicio" className="!text-neutro-600" />
                                <input
                                    id="exp-inicio"
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className={claseCampo}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="exp-fin" value="Fecha de fin" className="!text-neutro-600" />
                                <input
                                    id="exp-fin"
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className={claseCampo}
                                />
                            </div>
                        </div>
                        {errorFechas && <p className="mt-2 text-sm text-primario-700">{errorFechas}</p>}
                    </fieldset>
                )}

                <fieldset className="mt-5">
                    <legend className="text-etiqueta text-neutro-900">Área</legend>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="exp-edificio" value="Edificio o área (opcional)" className="!text-neutro-600" />
                            <select
                                id="exp-edificio"
                                value={instalacionId}
                                onChange={cambiarEdificio}
                                className={claseCampo}
                            >
                                <option value="">Todo el plantel</option>
                                {edificios.map((e) => (
                                    <option key={e.id} value={e.id}>{e.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="exp-piso" value="Piso (opcional)" className="!text-neutro-600" />
                            <select
                                id="exp-piso"
                                value={pisoId}
                                onChange={(e) => setPisoId(e.target.value)}
                                disabled={!instalacionId}
                                className={claseCampo}
                            >
                                <option value="">Todos los pisos</option>
                                {pisos.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-neutro-600">
                        El selector de piso se habilita al elegir un edificio o área.
                    </p>
                </fieldset>

                <div className="mt-6 flex justify-center gap-4">
                    <SecondaryButton
                        onClick={onCerrar}
                        className="!border-primario-700 !text-primario-700 hover:!bg-primario-100 !normal-case !tracking-normal !text-etiqueta"
                    >
                        Cancelar
                    </SecondaryButton>

                    <a
                        href={errorFechas ? undefined : route('historial.exportar', parametros)}
                        onClick={alExportar}
                        aria-disabled={Boolean(errorFechas)}
                        className={`inline-flex items-center justify-center rounded-md px-6 py-2 text-etiqueta text-white transition ${
                            errorFechas
                                ? 'cursor-not-allowed bg-primario-300'
                                : 'bg-primario-500 hover:bg-primario-700'
                        }`}
                    >
                        Exportar
                    </a>
                </div>
            </div>
        </Modal>
    );
}