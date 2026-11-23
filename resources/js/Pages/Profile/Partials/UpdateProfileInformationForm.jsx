import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { CheckCircle2, X } from "lucide-react";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function UpdateProfileInformationForm({ className = "" }) {
    const usuarioActual = usePage().props.auth.user;
    const [guardado, setGuardado] = useState(false);
    const [confirmandoCorreo, setConfirmandoCorreo] = useState(false);

    const formulario = useForm({
        name: usuarioActual?.name || "",
        email: usuarioActual?.email || "",
    });

    useEffect(() => {
        if (!guardado) return;
        const timer = setTimeout(() => setGuardado(false), 4500);
        return () => clearTimeout(timer);
    }, [guardado]);

    const guardar = () => {
        setGuardado(false);
        formulario.patch(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmandoCorreo(false);
                setGuardado(true);
            },
            onError: () => {
                setConfirmandoCorreo(false);
            },
        });
    };

    const guardarPerfil = (e) => {
        e.preventDefault();

        const correoActual = (usuarioActual?.email || "").trim().toLowerCase();
        const correoNuevo = (formulario.data.email || "").trim().toLowerCase();

        if (correoNuevo !== correoActual) {
            setConfirmandoCorreo(true);
            return;
        }

        guardar();
    };

    const cerrarModal = () => {
        if (formulario.processing) return;
        setConfirmandoCorreo(false);
    };

    const correoNuevoVisible = (formulario.data.email || "").trim();

    const inputClass =
        "w-full bg-white rounded-lg border border-neutro-100 px-3 py-2 text-xs font-medium text-neutro-900 focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500 transition";

    return (
        <section className={className}>
            <div className="mb-5">
                <h2 className="text-titulo-2 font-bold text-neutro-900">
                    Perfil
                </h2>
                <p className="mt-1 text-xs text-neutro-600">
                    Actualiza la información de tu cuenta y tu correo
                    electrónico.
                </p>
            </div>

            <form onSubmit={guardarPerfil} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="perfil-nombre"
                            className="block text-xs font-bold text-neutro-900 mb-1.5"
                        >
                            Nombre
                        </label>
                        <input
                            id="perfil-nombre"
                            type="text"
                            value={formulario.data.name}
                            onChange={(e) =>
                                formulario.setData("name", e.target.value)
                            }
                            required
                            className={inputClass}
                        />
                        <InputError
                            message={formulario.errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="perfil-correo"
                            className="block text-xs font-bold text-neutro-900 mb-1.5"
                        >
                            Correo electrónico
                        </label>
                        <input
                            id="perfil-correo"
                            type="email"
                            value={formulario.data.email}
                            onChange={(e) =>
                                formulario.setData("email", e.target.value)
                            }
                            required
                            className={inputClass}
                        />
                        <InputError
                            message={formulario.errors.email}
                            className="mt-2"
                        />
                    </div>
                </div>

                {guardado && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-acento-500/30 bg-acento-500/15 px-4 py-3 text-acento-500">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-acento-500" />
                            <span className="text-xs font-semibold">
                                Información de perfil actualizada correctamente.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setGuardado(false)}
                            aria-label="Cerrar aviso"
                            className="rounded-lg p-1 transition-colors hover:bg-acento-500/15 cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={formulario.processing}
                        className="bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Guardar
                    </button>
                </div>
            </form>

            <Modal
                show={confirmandoCorreo}
                onClose={cerrarModal}
                maxWidth="md"
                closeable={!formulario.processing}
            >
                <div className="p-6 space-y-4">
                    <h3 className="text-titulo-2 font-bold text-neutro-900">
                        Confirmar cambio de correo
                    </h3>

                    <p className="text-sm text-neutro-600 leading-relaxed">
                        ¿Confirma que su nuevo correo es{" "}
                        <strong className="font-semibold text-neutro-900 break-all">
                            {correoNuevoVisible}
                        </strong>
                        ? Ahí llegará el enlace para recuperar su contraseña.
                    </p>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                        <SecondaryButton
                            type="button"
                            onClick={cerrarModal}
                            disabled={formulario.processing}
                            className="w-full sm:w-auto justify-center !rounded-xl !border-neutro-100 !px-4 !py-2.5 !text-xs !font-bold !normal-case !tracking-normal !text-neutro-900 hover:!bg-neutro-50 focus:!ring-primario-500 cursor-pointer"
                        >
                            Cancelar
                        </SecondaryButton>

                        <PrimaryButton
                            type="button"
                            onClick={guardar}
                            disabled={formulario.processing}
                            className="w-full sm:w-auto justify-center !rounded-xl !bg-primario-500 hover:!bg-primario-700 focus:!bg-primario-700 active:!bg-primario-700 !px-4 !py-2.5 !text-xs !font-bold !normal-case !tracking-normal focus:!ring-primario-500 cursor-pointer"
                        >
                            {formulario.processing
                                ? "Guardando..."
                                : "Confirmar"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
