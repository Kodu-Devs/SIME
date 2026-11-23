import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";

const TIPOS_MOTIVO = ["Conato", "Simulacro", "Capacitación", "Otro"];
const TIPOS_DESCARGA = [
    { valor: "total", etiqueta: "Total" },
    { valor: "parcial", etiqueta: "Parcial" },
];

const inputClass =
    "mt-1 w-full bg-white rounded-lg border border-neutro-100 px-3 py-2 text-xs text-neutro-900 font-medium focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500 disabled:bg-neutro-50 disabled:text-neutro-300 disabled:cursor-not-allowed";

const hoy = () => new Date().toLocaleDateString("en-CA");

export default function RegistrarUsoPanel({
    extintores = [],
    capacitaciones = [],
    onGuardado,
    rutaGuardar = null,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        extintor_id: "",
        tipo_descarga: "",
        fecha: "",
        tipo_motivo: "",
        motivo: "",
        capacitacion_id: "",
    });
    const esCapacitacion = data.tipo_motivo === "Capacitación";
    const cambiarTipoMotivo = (valor) => {
        setData({
            ...data,
            tipo_motivo: valor,
            capacitacion_id:
                valor === "Capacitación" ? data.capacitacion_id : "",
        });
    };

    const enviar = (e) => {
        e.preventDefault();
        if (!rutaGuardar) return;

        post(rutaGuardar, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onGuardado?.();
            },
        });
    };

    return (
        <form
            onSubmit={enviar}
            className="w-full bg-white rounded-xl border border-neutro-100 shadow-sm p-5 text-xs space-y-3.5"
        >
            <div>
                <h2 className="text-base font-bold text-neutro-900 leading-tight">
                    Registrar uso
                </h2>
            </div>

            <div>
                <label
                    htmlFor="extintor_id"
                    className="block font-bold text-neutro-900"
                >
                    Extintor
                </label>
                <select
                    id="extintor_id"
                    value={data.extintor_id}
                    onChange={(e) => setData("extintor_id", e.target.value)}
                    className={inputClass}
                >
                    <option value="">Seleccione un extintor</option>
                    {extintores.map((x) => (
                        <option key={x.id} value={x.id}>
                            {x.etiqueta_inventario}
                        </option>
                    ))}
                </select>
                <InputError message={errors.extintor_id} className="mt-1" />
            </div>

            <div>
                <span className="block font-bold text-neutro-900">
                    Tipo de descarga
                </span>
                <div className="mt-1.5 flex gap-4">
                    {TIPOS_DESCARGA.map((t) => (
                        <label
                            key={t.valor}
                            className="flex items-center gap-1.5 text-xs text-neutro-900 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="tipo_descarga"
                                value={t.valor}
                                checked={data.tipo_descarga === t.valor}
                                onChange={(e) =>
                                    setData("tipo_descarga", e.target.value)
                                }
                                className="border-neutro-300 text-primario-500 focus:ring-primario-500 cursor-pointer"
                            />
                            <span>{t.etiqueta}</span>
                        </label>
                    ))}
                </div>
                <InputError message={errors.tipo_descarga} className="mt-1" />
            </div>

            <div>
                <label
                    htmlFor="fecha"
                    className="block font-bold text-neutro-900"
                >
                    Fecha
                </label>
                <input
                    id="fecha"
                    type="date"
                    max={hoy()}
                    value={data.fecha}
                    onChange={(e) => setData("fecha", e.target.value)}
                    className={inputClass}
                />
                <InputError message={errors.fecha} className="mt-1" />
            </div>

            <div>
                <label
                    htmlFor="tipo_motivo"
                    className="block font-bold text-neutro-900"
                >
                    Tipo de motivo
                </label>
                <select
                    id="tipo_motivo"
                    value={data.tipo_motivo}
                    onChange={(e) => cambiarTipoMotivo(e.target.value)}
                    className={inputClass}
                >
                    <option value="">Seleccione un tipo</option>
                    {TIPOS_MOTIVO.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <InputError message={errors.tipo_motivo} className="mt-1" />
            </div>

            <div>
                <label
                    htmlFor="capacitacion_id"
                    className="block font-bold text-neutro-900"
                >
                    Capacitación (opcional)
                </label>
                <select
                    id="capacitacion_id"
                    value={data.capacitacion_id}
                    disabled={!esCapacitacion}
                    onChange={(e) => setData("capacitacion_id", e.target.value)}
                    className={inputClass}
                >
                    <option value="">
                        {esCapacitacion
                            ? "Ninguna"
                            : 'Disponible solo con motivo "Capacitación"'}
                    </option>
                    {capacitaciones.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
                <InputError message={errors.capacitacion_id} className="mt-1" />
            </div>

            <div>
                <label
                    htmlFor="motivo"
                    className="block font-bold text-neutro-900"
                >
                    Descripción (motivo)
                </label>
                <input
                    id="motivo"
                    type="text"
                    value={data.motivo}
                    placeholder="Escriba el motivo"
                    onChange={(e) => setData("motivo", e.target.value)}
                    className={inputClass}
                />
                <InputError message={errors.motivo} className="mt-1" />
            </div>

            <p className="text-[11px] text-acento-500 bg-acento-500/10 rounded-lg px-3 py-2 leading-relaxed">
                Este registro alimenta los próximos mantenimientos y las
                recomendaciones.
            </p>

            <div className="pt-1">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-primario-500 hover:bg-primario-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    Guardar uso
                </button>
            </div>
        </form>
    );
}
