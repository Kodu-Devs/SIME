import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { CheckCircle2, X } from "lucide-react";
import InputError from "@/Components/InputError";

export default function UpdatePasswordForm({ className = "" }) {
    const [guardado, setGuardado] = useState(false);

    const formClave = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (!guardado) return;
        const timer = setTimeout(() => setGuardado(false), 4500);
        return () => clearTimeout(timer);
    }, [guardado]);

    const enviarCambioClave = (e) => {
        e.preventDefault();
        setGuardado(false);

        formClave.put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                formClave.reset();
                setGuardado(true);
            },
            onError: () => {
                formClave.reset("password", "password_confirmation");
            },
        });
    };

    const inputClass =
        "w-full bg-white rounded-lg border border-neutro-100 px-3 py-2 text-xs font-medium text-neutro-900 focus:outline-none focus:border-primario-500 focus:ring-1 focus:ring-primario-500 transition";

    return (
        <section className={className}>
            <div className="mb-5">
                <h2 className="text-titulo-2 font-bold text-neutro-900">
                    Actualizar contraseña
                </h2>
                <p className="mt-1 text-xs text-neutro-600">
                    Asegúrese de usar una contraseña larga y aleatoria para mantener su cuenta segura.
                </p>
            </div>

            <form onSubmit={enviarCambioClave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label
                            htmlFor="clave-actual"
                            className="block text-xs font-bold text-neutro-900 mb-1.5"
                        >
                            Contraseña actual
                        </label>
                        <input
                            id="clave-actual"
                            type="password"
                            value={formClave.data.current_password}
                            onChange={(e) =>
                                formClave.setData(
                                    "current_password",
                                    e.target.value,
                                )
                            }
                            autoComplete="current-password"
                            className={inputClass}
                        />
                        <InputError
                            message={formClave.errors.current_password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="clave-nueva"
                            className="block text-xs font-bold text-neutro-900 mb-1.5"
                        >
                            Nueva contraseña
                        </label>
                        <input
                            id="clave-nueva"
                            type="password"
                            value={formClave.data.password}
                            onChange={(e) =>
                                formClave.setData("password", e.target.value)
                            }
                            autoComplete="new-password"
                            className={inputClass}
                        />
                        <InputError
                            message={formClave.errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="clave-confirmacion"
                            className="block text-xs font-bold text-neutro-900 mb-1.5"
                        >
                            Confirmar contraseña
                        </label>
                        <input
                            id="clave-confirmacion"
                            type="password"
                            value={formClave.data.password_confirmation}
                            onChange={(e) =>
                                formClave.setData(
                                    "password_confirmation",
                                    e.target.value,
                                )
                            }
                            autoComplete="new-password"
                            className={inputClass}
                        />
                        <InputError
                            message={formClave.errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                {guardado && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-acento-500/30 bg-acento-500/15 px-4 py-3 text-[#10706B]">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-acento-500" />
                            <span className="text-xs font-semibold">
                                Contraseña actualizada correctamente.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setGuardado(false)}
                            aria-label="Cerrar aviso"
                            className="rounded-lg p-1 transition-colors hover:bg-black/5 cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={formClave.processing}
                        className="bg-primario-500 hover:bg-primario-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </section>
    );
}
