import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";

export default function UpdatePasswordForm({ className = "" }) {
    const formClave = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const enviarCambioClave = (e) => {
        e.preventDefault();

        formClave.put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => formClave.reset(),
            onError: () => {
                formClave.reset("password", "password_confirmation");
            },
        });
    };

    return (
        <section className={className}>
            <div className="mb-5">
                <h2 className="text-titulo-2 font-bold text-neutro-900">
                    Actualizar contraseña
                </h2>
                <p className="mt-1 text-xs text-neutro-600">
                    Asegúrate de usar una contraseña larga y aleatoria para
                    mantener tu cuenta segura.
                </p>
            </div>

            <form onSubmit={enviarCambioClave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Columna 1: Contraseña actual */}
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
                            className="w-full rounded-lg border border-neutro-300 px-3.5 py-2 text-sm text-neutro-900 focus:border-primario-700 focus:ring-primario-700 transition"
                        />
                    </div>

                    {/* Columna 2: Nueva contraseña */}
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
                            className="w-full rounded-lg border border-neutro-300 px-3.5 py-2 text-sm text-neutro-900 focus:border-primario-700 focus:ring-primario-700 transition"
                        />
                    </div>

                    {/* Columna 3: Confirmar contraseña */}
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
                            className="w-full rounded-lg border border-neutro-300 px-3.5 py-2 text-sm text-neutro-900 focus:border-primario-700 focus:ring-primario-700 transition"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={formClave.processing}
                        className="bg-primario-700 hover:bg-primario-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                        Guardar
                    </button>

                    {formClave.recentlySuccessful && (
                        <span className="text-xs font-semibold text-acento-500">
                            Contraseña actualizada.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
