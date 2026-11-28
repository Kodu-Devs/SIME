export const manualUsuario = {
    titulo: "Centro de ayuda",
    descripcion: "Guía para consultar los extintores de la institución.",
    pdf: "/manuales/SIME-Guia-de-consulta.pdf",

    secciones: [
        {
            id: "primeros-pasos",
            titulo: "Primeros pasos",
            icono: "Rocket",
            resumen:
                "Entre a la consulta pública sin cuenta y conozca las secciones disponibles.",
            tareas: [
                {
                    id: "publico-acceso",
                    titulo: "¿Cómo entro a la consulta pública de SIME?",
                    introduccion:
                        "Cualquier persona puede consultar los extintores del plantel con el enlace público, sin crear una cuenta ni iniciar sesión.",
                    pasos: [
                        "Abra su navegador web en computadora, tableta o celular.",
                        "Escriba el enlace público de SIME en la barra de direcciones y ábralo.",
                        "SIME abrirá directamente la pantalla principal de **Mapa**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "SIME es una herramienta de consulta pública. En caso de incendio real, evacúe de inmediato y llame al **911**.",
                        },
                        {
                            tipo: "nota",
                            texto: "Si encuentra un extintor dañado, vacío o fuera de su lugar, avise al personal responsable de la institución. Desde la consulta pública no se pueden modificar datos ni registrar reportes.",
                        },
                    ],
                },
                {
                    id: "publico-navegacion",
                    titulo: "¿Cómo me muevo entre Mapa, Agenda y Aprende más?",
                    introduccion:
                        "El menú público siempre está visible y se adapta al tamaño de su pantalla.",
                    pasos: [
                        "En computadora o tableta, seleccione **Mapa**, **Agenda** o **Aprende más** en la barra superior.",
                        "En celular, toque cualquiera de esas tres secciones en la barra inferior de la pantalla.",
                        "Presione el botón de ayuda (**?**) en la esquina superior derecha para abrir esta guía en la sección que está consultando.",
                        "Si necesita llamar en una emergencia, use el botón **Emergencias 911** de la franja roja superior.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "El botón **Acceso Administrador** (o **Admin** en celular) es exclusivo para el personal encargado del inventario.",
                        },
                    ],
                },
            ],
        },

        {
            id: "mapa",
            titulo: "Mapa",
            icono: "Map",
            resumen:
                "Ubique los extintores por edificio y piso y consulte su estado de mantenimiento.",
            tareas: [
                {
                    id: "publico-mapa-consultar",
                    titulo: "¿Cómo encuentro el extintor más cercano?",
                    pasos: [
                        "Entre a la pestaña **Mapa** desde el menú principal.",
                        "Seleccione el edificio en el croquis del campus o elíjalo en la lista **EDIFICIOS**.",
                        "Elija el piso que desea consultar (por ejemplo, **Planta baja**, **Nivel 1**, **Nivel 2** o **Nivel 3**).",
                        "Revise el plano y seleccione un pin o una tarjeta en **Extintores en esta planta** para ver su ubicación exacta, tipo, estatus y próxima revisión.",
                        "Para volver atrás o cambiar de edificio, use la ruta superior (**Institución** › edificio › piso) o el botón **Volver**.",
                    ],
                    avisos: [
                        {
                            tipo: "consejo",
                            texto: "Deslice la lista **EDIFICIOS** hacia abajo para encontrar áreas como **Cafetería y SUM**, **Almacén** y **Almacén 2**.",
                        },
                    ],
                },
                {
                    id: "publico-mapa-colores",
                    titulo: "¿Qué significan Vigentes, Por vencer y Vencidos?",
                    introduccion:
                        "El panel **Toda la institución**, las barras de cada edificio y los pines en los planos muestran la vigencia de los extintores.",
                    definiciones: [
                        {
                            termino: "Turquesa (**Vigente**)",
                            definicion:
                                "El extintor tiene su mantenimiento al día.",
                        },
                        {
                            termino: "Amarillo (**Por vencer**)",
                            definicion:
                                "Falta poco tiempo para su próximo mantenimiento.",
                        },
                        {
                            termino: "Rojo (**Vencido**)",
                            definicion:
                                "El extintor requiere mantenimiento.",
                        },
                        {
                            termino: "Barra gris en un edificio",
                            definicion:
                                "El edificio aún no tiene extintores marcados en sus planos.",
                        },
                    ],
                },
            ],
        },

        {
            id: "agenda",
            titulo: "Agenda",
            icono: "CalendarDays",
            resumen:
                "Consulte en el calendario las fechas y horarios de las capacitaciones programadas.",
            tareas: [
                {
                    id: "publico-agenda-consultar",
                    titulo: "¿Cómo consulto las capacitaciones programadas?",
                    pasos: [
                        "Entre a la pestaña **Agenda** desde el menú principal.",
                        "Revise el texto debajo del título para ver cuántas capacitaciones hay programadas en el mes actual.",
                        "Ubique en el calendario las capacitaciones marcadas en color turquesa en el día correspondiente.",
                        "Si desea revisar otro mes, use las flechas laterales o seleccione el nombre del mes para elegir otro mes y año, o presione **Ir a hoy**.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "La **Agenda** pública es solo informativa; no es posible programar ni modificar eventos desde esta vista.",
                        },
                    ],
                },
                {
                    id: "publico-agenda-detalle",
                    titulo: "¿Cómo veo el detalle de una capacitación?",
                    pasos: [
                        "Seleccione cualquier capacitación directamente sobre el calendario.",
                        "Revise la ventana **Detalles del Evento**, donde verá el nombre, la fecha, la hora y el estado de la actividad.",
                        "Presione **×** para cerrar el recuadro.",
                    ],
                },
            ],
        },

        {
            id: "aprende",
            titulo: "Aprende más",
            icono: "GraduationCap",
            resumen:
                "Conozca las clases de fuego, qué extintor usar en cada caso y los pasos para accionarlo.",
            tareas: [
                {
                    id: "publico-aprende-usar-extintor",
                    titulo: "¿Cómo se usa un extintor en una emergencia?",
                    introduccion:
                        "En el panel **Cómo usar un extintor** encontrará los cuatro pasos básicos para operar un equipo.",
                    pasos: [
                        "Entre a **Aprende más** en el menú principal y ubique el panel **Cómo usar un extintor**.",
                        "**Jale el seguro**: retire el pasador con el extintor en posición vertical.",
                        "**Apunte a la base**: dirija la boquilla hacia la base del fuego, no a las llamas.",
                        "**Apriete la palanca**: mantenga presión continua a una distancia de 2 a 3 metros.",
                        "**Barra de lado a lado**: mueva la descarga en abanico hasta apagar el fuego.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Antes de usar un extintor, evacúe el lugar y llame al **911**. Utilícelo únicamente si el fuego es pequeño y usted cuenta con una salida libre.",
                        },
                    ],
                },
                {
                    id: "publico-aprende-tabla-fuego",
                    titulo: "¿Cómo consulto qué extintor sirve para cada clase de fuego?",
                    pasos: [
                        "Entre a **Aprende más** desde el menú principal.",
                        "En computadora o tableta, ubique el tipo de agente en las filas y la **Clase de fuego** en las columnas (**Clase A**, **Clase B**, **Clase C**, **Clase D** o **Clase K/F**).",
                        "En celular, seleccione uno de los botones superiores (**A**, **B**, **C**, **D** o **K/F**) para comparar los cinco agentes frente a esa clase de fuego.",
                        "Revise la eficacia indicada en cada recuadro antes de elegir un equipo.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Nunca use un extintor marcado como **Peligroso** o **Muy peligroso** para esa clase de fuego. Puede extender el incendio o provocar una descarga eléctrica.",
                        },
                    ],
                },
                {
                    id: "publico-aprende-guia-completa",
                    titulo: "¿Cómo abro la Guía de tipos de fuego y extintores?",
                    introduccion:
                        "La guía detalla qué combustibles producen cada clase de fuego, qué extintores se recomiendan y el método **T-A-P-A**.",
                    pasos: [
                        "En **Aprende más**, presione **Ver guía completa** o seleccione cualquier columna de **Clase de fuego** (en celular, toque **Ver guía →**).",
                        "Consulte la identificación, los combustibles, los extintores recomendados y las recomendaciones de seguridad de cada clase.",
                        "Revise el método **T-A-P-A**: **Tirar** del pasador, **Apuntar** a la base, **Presionar** la palanca y **Abanicar** de lado a lado.",
                        "Presione **Volver a la tabla** para regresar a la vista comparativa.",
                    ],
                },
            ],
        },

        {
            id: "glosario",
            titulo: "Glosario",
            icono: "BookText",
            resumen:
                "Consulte el significado de los estatus, vigencias, tipos de extintor y términos de SIME.",
            tareas: [
                {
                    id: "publico-glosario-estatus",
                    titulo: "¿Qué significan los estatus y vigencias de un extintor?",
                    introduccion:
                        "Cada tarjeta de extintor muestra dos datos distintos: su condición física (**estatus**) y su calendario de revisión (**vigencia**).",
                    definiciones: [
                        {
                            termino: "Estatus: **Disponible**",
                            definicion:
                                "El extintor está lleno, en su lugar y listo para usarse en cualquier emergencia.",
                        },
                        {
                            termino: "Estatus: **Medio uso**",
                            definicion:
                                "Ya fue accionado parcialmente, por lo que no está completamente lleno.",
                        },
                        {
                            termino: "Estatus: **Vacío**",
                            definicion:
                                "No tiene carga porque ya se utilizó por completo.",
                        },
                        {
                            termino: "Estatus: **Fuera de servicio**",
                            definicion:
                                "Está dañado o en mantenimiento y no se puede usar.",
                        },
                        {
                            termino: "Vigencia: **Vigente**",
                            definicion:
                                "Su mantenimiento está al día.",
                        },
                        {
                            termino: "Vigencia: **Por vencer**",
                            definicion:
                                "Falta poco para su próxima revisión.",
                        },
                        {
                            termino: "Vigencia: **Vencido**",
                            definicion:
                                "Su fecha de revisión ya pasó y necesita mantenimiento.",
                        },
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Un extintor puede estar **Vigente** por fecha y **Vacío** o **Medio uso** al mismo tiempo si fue utilizado recientemente.",
                        },
                    ],
                },
                {
                    id: "publico-glosario-extintores",
                    titulo: "¿Qué tipos de extintor y términos usa SIME?",
                    definiciones: [
                        {
                            termino: "**PQS** (Polvo Químico Seco)",
                            definicion:
                                "Es el extintor más común. Sirve para fuegos de sólidos, líquidos y equipos eléctricos.",
                        },
                        {
                            termino: "**CO2** (Dióxido de carbono)",
                            definicion:
                                "Extintor de gas frío que no deja residuos, ideal para aparatos eléctricos y computadoras.",
                        },
                        {
                            termino: "**Agua a presión**",
                            definicion:
                                "Apto únicamente para sólidos como papel, cartón o madera. Nunca debe usarse en cables eléctricos ni aceite.",
                        },
                        {
                            termino: "**Clase K**",
                            definicion:
                                "Extintor especial para apagar aceite o grasa hirviendo en cocinas.",
                        },
                        {
                            termino: "**Planta baja** y **Nivel 1**",
                            definicion:
                                "**Planta baja** es el piso al nivel de la entrada; **Nivel 1** es el primer piso hacia arriba.",
                        },
                        {
                            termino: "**SUM**",
                            definicion:
                                "Salón de Usos Múltiples.",
                        },
                        {
                            termino: "**Visitante** y **Administrador**",
                            definicion:
                                "El **Visitante** consulta información mediante el enlace público sin cuenta; el **Administrador** es el personal autorizado para gestionar el inventario.",
                        },
                    ],
                },
            ],
        },
    ],

    preguntas: [
        {
            id: "faq-publico-cuenta",
            pregunta: "¿Necesito una cuenta para usar SIME?",
            respuesta:
                "No. La consulta pública no requiere cuenta ni contraseña. Solo abra el enlace público en su navegador para consultar **Mapa**, **Agenda** y **Aprende más**.",
        },
        {
            id: "faq-publico-celular",
            pregunta: "¿Puedo usar SIME desde el celular o la tableta?",
            respuesta:
                "Sí. SIME no requiere instalación y se adapta al tamaño de su computadora, tableta o celular. En celular, use la barra inferior para cambiar entre **Mapa**, **Agenda** y **Aprende más**.",
        },
        {
            id: "faq-publico-acceso-admin",
            pregunta: "¿Para qué sirve el botón Acceso Administrador?",
            respuesta:
                "Ese botón es únicamente para el personal que administra el inventario de extintores. Si usted solo desea consultar ubicaciones, capacitaciones o guías, no necesita usarlo.",
        },
        {
            id: "faq-publico-encontrar-extintor",
            pregunta: "¿Cómo encuentro un extintor en un edificio específico?",
            respuesta:
                "Entre a **Mapa**, seleccione el edificio en el croquis o en la lista **EDIFICIOS** y luego elija el piso. En el plano verá los pines de cada extintor y en **Extintores en esta planta** podrá consultar su ubicación, tipo y estatus.",
        },
        {
            id: "faq-publico-extintor-danado",
            pregunta:
                "¿Qué hago si encuentro un extintor vacío, dañado o fuera de su lugar?",
            respuesta:
                "Avise de inmediato al personal responsable de la institución. Desde la vista pública solo se puede consultar la información y no es posible registrar reportes.",
        },
        {
            id: "faq-publico-programar-agenda",
            pregunta:
                "¿Puedo programar o modificar capacitaciones desde la Agenda?",
            respuesta:
                "No. La **Agenda** pública es solo informativa para consultar las capacitaciones programadas del mes, su horario y su estado.",
        },
        {
            id: "faq-publico-emergencia",
            pregunta: "¿Qué debo hacer primero en caso de un incendio real?",
            respuesta:
                "Evacúe de inmediato y llame al **911** (puede usar el botón **Emergencias 911** en la franja superior). Utilice un extintor únicamente si el fuego es pequeño, conoce el agente adecuado y tiene una salida libre.",
        },
    ],
};
