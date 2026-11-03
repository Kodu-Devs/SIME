import { useState } from "react";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    // Estado para el ojito de mostrar/ocultar contraseña del Figma
    const [showPassword, setShowPassword] = useState(false);

    // Lógica original de Laravel Breeze (NO se pierde nada)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-white text-neutro-900">
                {/* =========================================================
                    COLUMNA IZQUIERDA: PANEL DE BIENVENIDA (Oscuro)
                   ========================================================= */}
                <div className="lg:w-2/5 bg-primario-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    {/* Encabezado: Logo SIME + Etiqueta Kodu Devs */}
                    <div className="flex items-center justify-between gap-4 z-10">
                        <img
                            src="/img/Logo.png"
                            alt="Logo SIME"
                            className="h-16 w-auto object-contain"
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
                            Bienvenido al panel de administrador
                        </h1>

                        <p className="text-base sm:text-cuerpo text-white/80 leading-relaxed">
                            Plataforma centralizada para el monitoreo, control y
                            mantenimiento preventivo de extintores en el campus.
                        </p>

                        <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                            Diseñado para garantizar la seguridad operacional,
                            la geolocalización de equipos y el cumplimiento de
                            las normativas.
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
                    COLUMNA DERECHA: FORMULARIO DE INICIO DE SESIÓN
                   ========================================================= */}
                <div className="lg:w-3/5 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-neutro-50 flex-1">
                    <div className="w-full max-w-md bg-white border border-neutro-200 rounded-xl p-8 sm:p-10 shadow-sm">
                        <h2 className="text-titulo-1 font-bold text-neutro-900 mb-8">
                            Iniciar Sesión
                        </h2>

                        {status && (
                            <div className="mb-6 rounded-lg bg-acento-500/10 p-3 text-etiqueta text-acento-500">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo: Usuario (Email) */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-titulo-2 font-semibold text-neutro-900 mb-3"
                                >
                                    Usuario
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="admin@correo.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-neutro-300 px-4 py-3 text-etiqueta  text-neutro-900 placeholder-neutro-300 focus:border-primario-500 focus:ring-primario-500 transition"
                                    required
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Campo: Contraseña con botón de mostrar/ocultar */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-titulo-2 font-semibold text-neutro-900 mb-3"
                                >
                                    Contraseña
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutro-300 pl-4 pr-12 py-3 text-etiqueta text-neutro-900 placeholder-neutro-300 focus:border-primario-500 focus:ring-primario-500 transition"
                                        required
                                    />

                                    {/* Botón del Ojito (SVG sin dependencias externas) */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutro-600 hover:text-neutro-900 focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            /* Ojo abierto */
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.8}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        ) : (
                                            /* Ojo tachado (como en el Figma) */
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.8}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Fila: Checkbox "Recordar en este dispositivo" + Link "¿Olvidaste tu contraseña?" */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="w-4 h-4 rounded border-neutro-300 text-primario-500 focus:ring-primario-500"
                                    />
                                    <span className="ms-2.5 text-etiqueta text-neutro-900">
                                        Recordar en este dispositivo
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-etiqueta text-primario-500 hover:text-primario-700 hover:underline transition"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Botón Principal Rojo: Entrar */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-primario-500 hover:bg-primario-700 text-white font-bold py-3.5 px-6 text-titulo-2 shadow-sm transition disabled:opacity-50"
                            >
                                {processing ? "Entrando..." : "Entrar"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
