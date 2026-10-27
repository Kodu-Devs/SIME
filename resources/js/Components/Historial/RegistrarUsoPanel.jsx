import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function RegistrarUsoPanel({
    evento = null,
    onGuardado,
    rutaGuardar = null,
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            extintor: "",
            fecha: "",
            motivo: "",
        });

    // Cuando cambia la fila seleccionada, rellena o limpia el formulario
    useEffect(() => {
        if (evento) {
            setData({
                extintor: evento.extintor ?? "",
                fecha: evento.fecha ?? "",
                motivo: evento.motivo ?? "",
            });
        } else {
            reset();
        }
        clearErrors();
    }, [evento]);

    const enviar = (e) => {
        e.preventDefault();

        if (!rutaGuardar) {
            console.log("Guardar uso (sin backend aún):", data);
            return;
        }

        post(rutaGuardar, {
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
                <InputLabel htmlFor="extintor" value="Extintor" />
                <TextInput
                    id="extintor"
                    value={data.extintor}
                    onChange={(e) => setData("extintor", e.target.value)}
                    className="mt-1 w-full text-xs"
                />
                <InputError message={errors.extintor} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="fecha" value="Fecha" />
                <TextInput
                    id="fecha"
                    type="date"
                    value={data.fecha}
                    onChange={(e) => setData("fecha", e.target.value)}
                    className="mt-1 w-full text-xs"
                />
                <InputError message={errors.fecha} className="mt-1" />
            </div>

            <div className="mt-3">
                <InputLabel htmlFor="motivo" value="Evento/Motivo" />
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

            <PrimaryButton
                className="mt-3 w-full justify-center"
                disabled={processing}
            >
                Guardar uso
            </PrimaryButton>
        </form>
    );
}
