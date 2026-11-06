import InputError from "@/Components/InputError";
import { useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformationForm({ className = "" }) {
    const usuarioActual = usePage().props.auth.user;

    const formulario = useForm({
        name: usuarioActual?.name || "",
        email: usuarioActual?.email || "",
    });

    const guardarPerfil = (e) => {
        e.preventDefault();
        formulario.patch(route("profile.update"), {
            preserveScroll: true,
        });
    };

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

            <form onSubmit={guardarPerfil} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna 1: Nombre */}
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
                            className="w-full rounded-lg border border-neutro-300 px-3.5 py-2 text-sm text-neutro-900 focus:border-primario-700 focus:ring-primario-700 transition"
                        />
                        <InputError
                            message={formulario.errors.name}
                            className="mt-2"
                        />
                    </div>

                    {/* Columna 2: Correo electrónico */}
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
                            className="w-full rounded-lg border border-neutro-300 px-3.5 py-2 text-sm text-neutro-900 focus:border-primario-700 focus:ring-primario-700 transition"
                        />
                        <InputError
                            message={formulario.errors.email}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={formulario.processing}
                        className="bg-primario-700 hover:bg-primario-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                        Guardar
                    </button>

                    {formulario.recentlySuccessful && (
                        <span className="text-xs font-semibold text-acento-500">
                            Guardado correctamente.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
