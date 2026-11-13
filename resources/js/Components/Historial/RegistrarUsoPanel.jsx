import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

// Valores oficiales (el backend los valida tal cual)
const TIPOS_MOTIVO = ["Conato", "Simulacro", "Capacitación", "Otro"];
const TIPOS_DESCARGA = [
    { valor: "total", etiqueta: "Total" },
    { valor: "parcial", etiqueta: "Parcial" },
];

const selectClass =
    "mt-1 w-full rounded-md border-gray-300 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

// yyyy-mm-dd en hora local, para bloquear fechas futuras en el input
const hoy = () => new Date().toLocaleDateString("en-CA");

export default function RegistrarUsoPanel({
    evento = null,
    extintores = [], // [{ id, codigo }]  (TODO: confirmar nombre de prop con Emiliano)
    capacitaciones = [], // [{ id, nombre }] (TODO: confirmar)
    onGuardado,
    rutaGuardar = null, // TODO: ruta (la agregan Diego/Ulises)
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            extintor_id: "",
            tipo_descarga: "",
            fecha: "",
            tipo_motivo: "",
            motivo: "", // descripción del motivo
            capacitacion_id: "",
        });

    // Al seleccionar una fila se precarga solo el extintor; sin selección se limpia
    useEffect(() => {
    if (evento) {
        setData("extintor_id", evento.extintor?.id ?? "");  // antes: evento.extintor_id
    } else {
        reset();
    }
    clearErrors();
    }, [evento]);

    const cambiarTipoMotivo = (valor) => {
        // Si deja de ser Capacitación, se quita la capacitación elegida
        setData({
            ...data,
            tipo_motivo: valor,
            capacitacion_id: valor === "Capacitación" ? data.capacitacion_id : "",
        });
    };

    const cambiarCapacitacion = (valor) => {
        // Elegir una capacitación fuerza el tipo de motivo
        setData({
            ...data,
            capacitacion_id: valor,
            tipo_motivo: valor ? "Capacitación" : data.tipo_motivo,
        });
    };

    const enviar = (e) => {
        e.preventDefault();
        if (!rutaGuardar) return; // TODO: ruta

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
            className="w-64 rounded border bg-white p-4 shadow-sm"
        >
            <h2 className="text-sm font-semibold">Registrar uso</h2>

            <span className="mt-2 inline-block rounded bg-teal-50 px-2 py-1 text-xs text-teal-700">
                Exclusivo del administrador
            </span>

            <div className="mt-3">
                <InputLabel htmlFor="extintor_id" value="Extintor" />
                <select
                    id="extintor_id"
                    value={data.extintor_id}
                    onChange={(e) => setData("extintor_id", e.target.value)}
                    className={selectClass}
                >
                    <option value="">Selecciona un extintor</option>
                    {extintores.map((x) => (
                        <option key={x.id} value={x.id}>
                            {x.etiqueta_inventario}
                        </option>
                    ))}
                </select>
                <InputError message={errors.extintor_id} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel value="Tipo de descarga" />
                <div className="mt-1 flex gap-4">
                    {TIPOS_DESCARGA.map((t) => (
                        <label key={t.valor} className="flex items-center gap-1 text-xs">
                            <input
                                type="radio"
                                name="tipo_descarga"
                                value={t.valor}
                                checked={data.tipo_descarga === t.valor}
                                onChange={(e) => setData("tipo_descarga", e.target.value)}
                            />
                            {t.etiqueta}
                        </label>
                    ))}
                </div>
                <InputError message={errors.tipo_descarga} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="fecha" value="Fecha" />
                <TextInput
                    id="fecha"
                    type="date"
                    max={hoy()}
                    value={data.fecha}
                    onChange={(e) => setData("fecha", e.target.value)}
                    className="mt-1 w-full text-xs"
                />
                <InputError message={errors.fecha} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="tipo_motivo" value="Tipo de motivo" />
                <select
                    id="tipo_motivo"
                    value={data.tipo_motivo}
                    onChange={(e) => cambiarTipoMotivo(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Selecciona un tipo</option>
                    {TIPOS_MOTIVO.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <InputError message={errors.tipo_motivo} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="capacitacion_id" value="Capacitación (opcional)" />
                <select
                    id="capacitacion_id"
                    value={data.capacitacion_id}
                    onChange={(e) => cambiarCapacitacion(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Ninguna</option>
                    {capacitaciones.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
                <InputError message={errors.capacitacion_id} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="motivo" value="Descripción (motivo)" />
                <TextInput
                    id="motivo"
                    value={data.motivo}
                    placeholder="Escribe el motivo"
                    onChange={(e) => setData("motivo", e.target.value)}
                    className="mt-1 w-full text-xs"
                />
                <InputError message={errors.motivo} className="mt-1" />
            </div>

            <p className="mt-3 text-xs text-green-700">
                Este registro alimenta los próximos mantenimientos y las
                recomendaciones.
            </p>

            <div className="mt-3 flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-red-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Guardar uso
                </button>
            </div>
        </form>
    );
}