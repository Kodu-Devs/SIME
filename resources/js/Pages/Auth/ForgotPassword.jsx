import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Recuperar contraseña" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-white text-neutro-900">
                {/* =========================================================
                    COLUMNA IZQUIERDA: PANEL INSTITUCIONAL (Guinda / Oscuro)
                   ========================================================= */}
                <div className="lg:w-2/5 bg-primario-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    {/* Encabezado: Logo SIME + Etiqueta Kodu Devs */}
                    <div className="flex items-center justify-between gap-4 z-10">
                        <img
                            src="/img/Logo.png"
                            alt="Logo SIME"
                            className="h-20 w-auto object-contain brightness-150"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                        <span className="px-3 py-1 rounded-full bg-neutro-50/10 text-xs font-semibold tracking-wide text-neutro-50/50 border border-white/15">
                            Kodu Devs
                        </span>
                    </div>

                    {/* Texto Central de Bienvenida */}
                    <div className="my-10 lg:my-0 max-w-lg z-10 space-y-6">
                        <h1 className="text-3xl sm:text-titulo-principal font-bold leading-tight text-white">
                            ¿Necesitas recuperar tu acceso?{" "}
                        </h1>
                        <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                            Te enviaremos un enlace seguro a tu correo
                            registrado para que elijas una nueva contraseña y
                            vuelvas al panel de administrador.
                        </p>
                    </div>

                    {/* Pie discreto para volver al mapa público */}
                    <div className="z-10">
                        <Link
                            href={route("mapa.index")}
                            className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
                        >
                            <span>← Volver a la consulta pública</span>
                        </Link>
                    </div>
                </div>

                {/* =========================================================
                    COLUMNA DERECHA: TARJETA DE RECUPERACIÓN
                   ========================================================= */}
                <div className="lg:w-3/5 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-neutro-50 flex-1">
                    <div className="w-full max-w-lg bg-white border border-neutro-100 rounded-2xl p-8 sm:p-10 shadow-sm">
                        <h2 className="text-titulo-1 font-bold text-neutro-900 mb-3">
                            Recuperar contraseña
                        </h2>

                        <p className="text-sm text-neutro-600 leading-relaxed mb-6">
                            ¿Olvidaste tu contraseña? No hay problema. Ingresa
                            tu correo electrónico registrado y te enviaremos un
                            enlace seguro para que elijas una nueva.
                        </p>

                        {status && (
                            <div className="mb-6 rounded-lg bg-acento-500/15 border border-acento-500/30 p-3 text-xs font-semibold text-acento-500">
                                Hemos enviado el enlace de recuperación a tu
                                correo electrónico.
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-etiqueta font-semibold text-neutro-900 mb-2"
                                >
                                    Correo Electrónico
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="admin@correo.com"
                                    autoFocus
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-neutro-300 px-3.5 py-2.5 text-sm text-neutro-900 placeholder-neutro-300 focus:border-primario-500 focus:ring-1 focus:ring-primario-500 transition"
                                    required
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-primario-500 hover:bg-primario-700 text-white font-semibold py-2.5 px-6 text-etiqueta shadow-sm transition disabled:opacity-50"
                            >
                                {processing
                                    ? "Enviando enlace..."
                                    : "Enviar enlace de recuperación"}
                            </button>

                            <div className="pt-2 text-center">
                                <Link
                                    href={route("login")}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primario-500 hover:text-primario-700 hover:underline transition"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Volver a iniciar sesión</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
