import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // Desactiva el modo oscuro automático del sistema
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Manrope", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Paleta Primaria (H 90, S 90)
                primario: {
                    100: "#FDEDED", // Fondo suave / Salones en el plano
                    300: "#F9CACB", // Baños en el plano / Bordes suaves
                    500: "#F24C52", // Botones principales (Entrar) / Estado Vencido
                    700: "#C0262D", // Banner 911 / Hover de botones primarios
                    900: "#4B090B", // Fondos oscuros de acento / Textos de alerta
                },
                // Paleta de Neutros (H 90, S 90)
                neutro: {
                    50: "#F1F0F0", // Fondo general de la aplicación
                    100: "#D7D4D4", // Escaleras en el plano / Bordes de inputs y tablas
                    300: "#928586", // Texto secundario / Placeholders
                    600: "#6D6162", // Subtítulos / Iconos inactivos
                    900: "#272222", // Texto principal / Títulos
                },
                // Acento Complementario
                acento: {
                    500: "#1C9691", // Estado Vigente / Pines verdes / Oficinas
                },
                // Colores de apoyo del sistema (Sidebar y Por vencer)
                sime: {
                    navy: "#1B365D", // Azul institucional (Sidebar y panel de Login)
                    warning: "#F59E0B", // Naranja / Amarillo para estado "Por vencer"
                },
            },
            fontSize: {
                "titulo-principal": [
                    "40px",
                    { lineHeight: "1.2", fontWeight: "700" },
                ], // 40px Bold
                "titulo-1": ["32px", { lineHeight: "1.25", fontWeight: "700" }], // 32px Bold
                "titulo-2": ["20px", { lineHeight: "1.4", fontWeight: "600" }], // 20px SemiBold
                cuerpo: ["20px", { lineHeight: "1.5", fontWeight: "400" }], // 20px Regular
                etiqueta: ["15px", { lineHeight: "1.4", fontWeight: "600" }], // 15px SemiBold
            },
        },
    },

    plugins: [forms],
};
