export const manualAdministrador = {
    titulo: "Centro de ayuda",
    descripcion:
        "Guía para administrar los extintores, el mapa, la agenda y las alertas de SIME.",
    pdf: "/manuales/SIME-Manual-del-administrador.pdf",

    secciones: [
        {
            id: "primeros-pasos",
            titulo: "Primeros pasos",
            icono: "Rocket",
            resumen:
                "Inicie sesión, recupere su contraseña y conozca las herramientas principales del panel.",
            tareas: [
                {
                    id: "primeros-pasos-iniciar-sesion",
                    titulo: "¿Cómo inicio sesión en SIME?",
                    introduccion:
                        "El panel de administrador requiere su correo electrónico y contraseña registrados.",
                    pasos: [
                        "Abra SIME en su navegador y seleccione **Acceso Administrador** en la esquina superior derecha.",
                        "Escriba su correo en el campo **Correo electrónico**.",
                        "Escriba su clave en el campo **Contraseña**. Si desea ver los caracteres, presione el ícono del ojo.",
                        "Si utiliza un equipo de confianza, marque **Recordar en este dispositivo**.",
                        "Presione **Entrar** para acceder al panel principal.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "No comparta sus credenciales. Solo el administrador puede registrar, modificar o dar de baja información en SIME.",
                        },
                        {
                            tipo: "nota",
                            texto: "Si realiza 5 intentos fallidos con el mismo correo, el sistema le pedirá esperar unos segundos antes de intentar nuevamente.",
                        },
                    ],
                },
                {
                    id: "primeros-pasos-recuperar-contrasena",
                    titulo: "¿Cómo recupero mi contraseña si la olvidé?",
                    introduccion:
                        "Puede restablecer su acceso desde la pantalla de inicio de sesión.",
                    pasos: [
                        "En la pantalla **Iniciar Sesión**, seleccione **¿Olvidó su contraseña?**.",
                        "Escriba el correo con el que inicia sesión en el campo **Correo Electrónico**.",
                        "Presione **Enviar enlace de recuperación**.",
                        "Abra su bandeja de entrada (o la carpeta de correo no deseado) y siga el enlace recibido.",
                        "Escriba su **Nueva Contraseña**, confírmela y guarde el cambio.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "El enlace de recuperación llega siempre al **correo con el que se inicia sesión**.",
                        },
                    ],
                },
                {
                    id: "primeros-pasos-navegacion",
                    titulo: "¿Cómo me muevo por el sistema en computadora, tableta o móvil?",
                    introduccion:
                        "SIME adapta el menú principal al tamaño de su pantalla para que tenga todos los módulos a la mano.",
                    pasos: [
                        "En computadora o tableta, use el menú lateral oscuro de la izquierda para entrar a **Resumen**, **Mapa**, **Extintores**, **Agenda** o **Historial**.",
                        "En móvil, use la barra fija de la parte inferior con los mismos cinco accesos.",
                        "Para abrir su perfil o salir de su cuenta, seleccione su nombre o iniciales en la esquina superior derecha y elija **Mi Perfil** o **Cerrar Sesión**.",
                    ],
                },
                {
                    id: "primeros-pasos-encabezado",
                    titulo: "¿Para qué sirven el buscador, la campana y el botón de ayuda?",
                    introduccion:
                        "En la barra superior encontrará tres herramientas disponibles desde cualquier módulo.",
                    pasos: [
                        "Use el buscador (**Buscar función, edificio o acción**) para ir directo a un edificio, a una acción rápida o buscar un código de extintor.",
                        "Seleccione la campana de **Notificaciones** para revisar los avisos recientes, marcarlos como leídos o entrar a **Ver todas las notificaciones**.",
                        "Presione el botón de ayuda (**?**) para abrir esta guía directamente en la sección del módulo donde se encuentra.",
                    ],
                    avisos: [
                        {
                            tipo: "consejo",
                            texto: "Desde el buscador superior también puede escribir **ayuda** o **manual** para abrir este **Centro de ayuda**.",
                        },
                    ],
                },
            ],
        },

        {
            id: "resumen",
            titulo: "Resumen",
            icono: "LayoutDashboard",
            resumen:
                "Consulte el panorama general del inventario, los equipos vencidos, la agenda cercana y las recomendaciones.",
            tareas: [
                {
                    id: "resumen-leer-panel",
                    titulo: "¿Qué muestra el panel Resumen?",
                    introduccion:
                        "Al iniciar sesión, SIME abre **Resumen** con el estado actual de todos los extintores del plantel.",
                    pasos: [
                        "Revise las cuatro tarjetas superiores: **Extintores** (total registrado), **Vigentes**, **Por vencer** y **Vencidos**.",
                        "Seleccione **Extintores** o **Vigentes** si desea ir directamente al inventario completo.",
                        "Seleccione **Por vencer** o **Vencidos** para abrir el centro de alertas y revisar los equipos que requieren atención.",
                        "Consulte **Mapa de la institución** para ver de un vistazo el estado por edificio o seleccione un edificio para ver sus niveles.",
                    ],
                },
                {
                    id: "resumen-atender-vencido",
                    titulo: "¿Cómo atiendo una alerta de extintor vencido desde Resumen?",
                    introduccion:
                        "Cuando hay un extintor con mantenimiento vencido, aparece una franja roja debajo de las tarjetas.",
                    pasos: [
                        "Revise el código y la ubicación del extintor mostrados en la franja roja.",
                        "Presione **Programar mantenimiento**.",
                        "SIME abrirá **Agenda** con el extintor seleccionado para que elija el tipo de servicio y la fecha.",
                    ],
                },
                {
                    id: "resumen-agenda-recomendaciones",
                    titulo: "¿Cómo consulto Próximo en la agenda y Recomendaciones?",
                    introduccion:
                        "A la derecha del mapa (o abajo en móvil) verá los próximos eventos y las sugerencias de cobertura.",
                    pasos: [
                        "Revise **Próximo en la agenda** para ver los mantenimientos y capacitaciones más cercanos.",
                        "Seleccione **Ver agenda** para abrir el calendario completo.",
                        "Revise **Recomendaciones** para identificar edificios o pisos sin extintores, ubicaciones sin ningún extintor disponible y el tipo de extintor sugerido para cada área.",
                        "Para atender una recomendación, entre a **Extintores** desde el menú y registre el equipo necesario.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "El panel **Recomendaciones** muestra como máximo 3 recomendaciones a la vez y sugiere el tipo de extintor adecuado para cada área.",
                        },
                    ],
                },
            ],
        },

        {
            id: "mapa",
            titulo: "Mapa",
            icono: "MapPin",
            resumen:
                "Recorra edificios y pisos, consulte el estado de cada equipo y ubique extintores en el plano.",
            tareas: [
                {
                    id: "mapa-navegar",
                    titulo: "¿Cómo navego de la institución al edificio y al piso?",
                    pasos: [
                        "Entre a **Mapa** desde el menú lateral o la barra inferior.",
                        "Seleccione un edificio directamente en el croquis o en la lista **EDIFICIOS** del panel derecho.",
                        "Elija el piso que desea revisar (por ejemplo, **Planta baja** o **Nivel 1**).",
                        "Seleccione el pin de un extintor en el plano para resaltar su tarjeta en **Ubicaciones de la planta** y ver su tipo, capacidad, estatus y próxima revisión.",
                        "Use la ruta superior (**Institución** › edificio › piso) o el botón **Volver** para regresar.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "En instalaciones de un solo nivel puede abrir el plano directamente con el botón **Ver extintores** o seleccionando el plano.",
                        },
                    ],
                },
                {
                    id: "mapa-colores",
                    titulo: "¿Qué significan los colores del mapa y de los pines?",
                    introduccion:
                        "Tanto las barras de cada edificio como los pines en los planos muestran la vigencia de los extintores.",
                    definiciones: [
                        {
                            termino: "Turquesa (**Vigente**)",
                            definicion:
                                "El extintor tiene su revisión al día.",
                        },
                        {
                            termino: "Amarillo (**Por vencer**)",
                            definicion:
                                "Faltan 7 días o menos para su fecha de vencimiento.",
                        },
                        {
                            termino: "Rojo (**Vencido**)",
                            definicion:
                                "La fecha de vencimiento ya pasó y requiere mantenimiento.",
                        },
                        {
                            termino: "Barra gris en un edificio",
                            definicion:
                                "El edificio aún no tiene extintores ubicados en sus planos.",
                        },
                    ],
                },
                {
                    id: "mapa-ubicar-arrastrar",
                    titulo: "¿Cómo ubico un extintor en el plano arrastrándolo?",
                    introduccion:
                        "Los extintores recién registrados o sin posición aparecen en la bandeja **Por ubicar en el plano** del piso correspondiente.",
                    pasos: [
                        "Entre a **Mapa** y abra el edificio y el piso donde está registrado el extintor.",
                        "Ubique la tarjeta del equipo en la sección **Por ubicar en el plano**.",
                        "Revise el nombre del área indicada en la tarjeta.",
                        "Mantenga presionada la tarjeta y arrástrela hasta esa área dentro del plano.",
                        "Suelte la tarjeta en el punto exacto donde está instalado el extintor.",
                        "Verifique que el pin aparezca en el plano y salga de **Por ubicar en el plano**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Solo puede colocar cada extintor dentro de la zona que corresponde a su ubicación registrada. Si lo suelta en otra área, SIME mostrará un aviso y no guardará la posición.",
                        },
                        {
                            tipo: "consejo",
                            texto: "También puede arrastrar la tarjeta de un extintor ya ubicado para corregir su posición dentro de la misma área.",
                        },
                    ],
                },
                {
                    id: "mapa-ubicar-tocar",
                    titulo: "¿Cómo ubico un extintor en el plano desde móvil o tableta?",
                    introduccion:
                        "En pantallas táctiles no necesita arrastrar: puede colocar el equipo con dos toques.",
                    pasos: [
                        "Abra el edificio y el piso donde está registrado el extintor.",
                        "En **Por ubicar en el plano**, toque la tarjeta del extintor que desea colocar.",
                        "Verifique el aviso superior que indica el área permitida para ese equipo.",
                        "Toque el punto exacto dentro de esa área en el plano para colocarlo.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "Si desea cancelar antes de colocarlo, presione **Cancelar** en el aviso sobre el plano.",
                        },
                    ],
                },
                {
                    id: "mapa-quitar-plano",
                    titulo: "¿Cómo quito un extintor del plano sin darlo de baja?",
                    pasos: [
                        "Abra el plano del edificio y piso donde está ubicado el extintor.",
                        "En **Ubicaciones de la planta**, ubique la tarjeta del extintor.",
                        "Presione el botón **✕** en la esquina superior derecha de la tarjeta.",
                        "En la ventana **¿Quitar extintor del plano?**, presione **Sí, quitar del plano**.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "Esta acción solo borra su posición en el mapa y lo devuelve a **Por ubicar en el plano**. El extintor sigue activo en el inventario.",
                        },
                    ],
                },
                {
                    id: "mapa-vista-3d",
                    titulo: "¿Cómo funciona la vista 3D de niveles?",
                    introduccion:
                        "Al entrar a un edificio de varios pisos, SIME muestra sus niveles apilados en perspectiva 3D.",
                    pasos: [
                        "Seleccione un edificio de varios niveles en el croquis (por ejemplo, Edificio A, B, C, D o E).",
                        "Seleccione directamente cualquiera de las plantas en el dibujo 3D o elíjala en la lista del panel derecho.",
                        "Presione **Volver al croquis** si desea regresar a la vista de toda la institución.",
                    ],
                },
            ],
        },

        {
            id: "extintores",
            titulo: "Extintores",
            icono: "FlameKindling",
            resumen:
                "Registre nuevos equipos, actualice sus datos, dé de baja los que se retiran y filtre el inventario.",
            tareas: [
                {
                    id: "extintores-registrar",
                    titulo: "¿Cómo registro un extintor nuevo?",
                    pasos: [
                        "Entre al módulo **Extintores** desde el menú.",
                        "En móvil o tableta, presione **Añadir**. En computadora, verifique que el panel derecho diga **Registrar nuevo extintor** (**Modo creación · Sin selección**).",
                        "Seleccione el **Tipo** de agente y después la **Capacidad**.",
                        "Elija el **Edificio**, el **Piso** y la **Ubicación exacta**.",
                        "Verifique o elija la **Fecha de instalación**.",
                        "Presione **Confirmar registro**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "La **Fecha de vencimiento** se calcula sola a partir de la **Fecha de instalación**; no se puede editar manualmente.",
                        },
                        {
                            tipo: "nota",
                            texto: "Al registrarlo, SIME genera el código automáticamente y el equipo queda listo en **Por ubicar en el plano** dentro del módulo **Mapa**.",
                        },
                    ],
                },
                {
                    id: "extintores-modificar",
                    titulo: "¿Cómo modifico los datos de un extintor?",
                    pasos: [
                        "Entre a **Extintores** y seleccione la fila del equipo que desea actualizar.",
                        "Verifique que el panel muestre **Modificar** junto al código del equipo (**Modo edición · Extintor seleccionado**).",
                        "Actualice los campos necesarios (**Tipo**, **Capacidad**, **Edificio**, **Piso**, **Ubicación exacta** o **Fecha de instalación**).",
                        "Presione **Guardar cambios**.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "Para salir del modo edición sin guardar, presione **Cancelar** en la parte superior del panel (o **Volver a la lista** en móvil y tableta).",
                        },
                    ],
                },
                {
                    id: "extintores-baja",
                    titulo: "¿Cómo doy de baja un extintor?",
                    introduccion:
                        "Use esta opción cuando un equipo se retira de manera definitiva porque está dañado o cumplió su vida útil.",
                    pasos: [
                        "Entre a **Extintores** y seleccione el equipo en la tabla.",
                        "En la parte inferior del panel de edición, presione **Dar de baja**.",
                        "Confirme la acción en el mensaje que aparece en pantalla.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Al dar de baja un extintor, deja de mostrarse en el mapa, sale del inventario activo y se cancelan sus mantenimientos pendientes.",
                        },
                    ],
                },
                {
                    id: "extintores-filtrar-tabla",
                    titulo: "¿Cómo filtro por estatus y consulto la tabla de inventario?",
                    pasos: [
                        "En la parte superior de **Extintores**, seleccione uno de los botones de filtro: **Todos**, **Disponibles**, **Medio uso**, **Vacíos** o **Fuera de servicio**.",
                        "Consulte en la tabla las columnas **Código**, **Tipo**, **Ubicación**, **Próxima revisión** y **Estado**.",
                        "Use los controles de paginación al pie de la tabla para avanzar o retroceder entre páginas.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "Cada botón muestra entre paréntesis cuántos equipos tienen ese estatus. Si no hay extintores en un estatus, ese botón se oculta automáticamente.",
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
                "Programe mantenimientos y capacitaciones, aparte extintores para prácticas y gestione el calendario.",
            tareas: [
                {
                    id: "agenda-filtrar-navegar",
                    titulo: "¿Cómo filtro eventos y cambio de mes en el calendario?",
                    pasos: [
                        "Entre a **Agenda** desde el menú.",
                        "Use los filtros **Todos**, **Mantenimientos** y **Capacitaciones** para elegir qué eventos ver.",
                        "Use las flechas junto al mes para avanzar o retroceder mes por mes.",
                        "Si desea ir rápido a otro mes o año, seleccione el nombre del mes actual y elija la fecha, o presione **Ir a hoy** para volver al mes en curso.",
                    ],
                },
                {
                    id: "agenda-programar-mantenimiento",
                    titulo: "¿Cómo programo un mantenimiento?",
                    pasos: [
                        "Entre a **Agenda**. En móvil o tableta, presione **Añadir**.",
                        "En el panel lateral, seleccione la pestaña **Mantenimiento**.",
                        "Elija el equipo en **Seleccionar extintor** y verifique su ubicación y tipo en **Datos del extintor**.",
                        "En **Tipo de servicio**, seleccione **Revisión**, **Relleno de contenido** u **Otra**.",
                        "Elija la **Fecha** y la **Hora**, y agregue comentarios en **Notas / Observaciones** si lo necesita.",
                        "Presione **Guardar mantenimiento**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Un mantenimiento solo puede programarse **a partir de hoy**; no se permiten fechas pasadas.",
                        },
                    ],
                },
                {
                    id: "agenda-agendar-capacitacion",
                    titulo: "¿Cómo agendo una capacitación y aparto extintores?",
                    pasos: [
                        "Entre a **Agenda**. En móvil o tableta, presione **Añadir**.",
                        "En el panel lateral, seleccione la pestaña **Capacitación**.",
                        "Escriba el título en **Nombre** y defina la **Fecha** y la **Hora**.",
                        "Elija la ubicación de la práctica en **Lugar**.",
                        "En **Extintores para la práctica**, marque las casillas de los equipos que desea apartar.",
                        "Presione **Agendar**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Una capacitación debe programarse en una **fecha y hora futuras**.",
                        },
                        {
                            tipo: "nota",
                            texto: "En **Extintores para la práctica** solo aparecen extintores en estatus **Medio uso** que no hayan recibido mantenimiento en los últimos 7 días. Los equipos marcados quedan apartados para esa capacitación.",
                        },
                    ],
                },
                {
                    id: "agenda-editar-eliminar",
                    titulo: "¿Cómo modifico o elimino un evento programado?",
                    pasos: [
                        "Seleccione en el calendario el mantenimiento o la capacitación que desea cambiar.",
                        "Verifique que el panel muestre **Detalles de Mantenimiento** o **Detalles de Capacitación** (**Modo edición · Evento seleccionado**).",
                        "Para modificar, edite los campos necesarios y presione **Guardar cambios**.",
                        "Para eliminar, presione **Eliminar** y confirme la acción en la ventana emergente.",
                        "Para salir sin hacer cambios, presione **Cancelar** (o **Volver al calendario** en móvil y tableta).",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "No se pueden editar ni eliminar mantenimientos ya realizados ni capacitaciones que ya pasaron o tienen usos registrados.",
                        },
                    ],
                },
            ],
        },

        {
            id: "historial",
            titulo: "Historial",
            icono: "History",
            resumen:
                "Consulte la bitácora de usos y mantenimientos, registre descargas y exporte informes en PDF o Excel.",
            tareas: [
                {
                    id: "historial-consultar-filtrar",
                    titulo: "¿Cómo consulto y filtro el historial?",
                    pasos: [
                        "Entre a **Historial** desde el menú.",
                        "Seleccione **Todos los eventos**, **Usos** o **Mantenimientos** para filtrar el tipo de registro.",
                        "Use el selector **Área: Toda la Institución** si desea ver únicamente los eventos de un edificio o área.",
                        "Revise en la tabla las columnas **Fecha**, **Extintor**, **Ubicación** y **Evento/Motivo**.",
                    ],
                },
                {
                    id: "historial-registrar-uso",
                    titulo: "¿Cómo registro el uso de un extintor?",
                    introduccion:
                        "Registre aquí cada descarga ocurrida en un conato, simulacro, capacitación u otro evento.",
                    pasos: [
                        "Entre a **Historial**. En móvil o tableta, presione **Añadir** para abrir el panel **Registrar uso**.",
                        "En **Extintor**, seleccione el equipo que se utilizó.",
                        "En **Tipo de descarga**, elija **Total** si se vació por completo o **Parcial** si conserva carga.",
                        "Indique la **Fecha** y seleccione el **Tipo de motivo** (**Conato**, **Simulacro**, **Capacitación** u **Otro**).",
                        "Si eligió **Capacitación**, seleccione la sesión correspondiente en **Capacitación (opcional)**.",
                        "Escriba brevemente lo ocurrido en **Descripción (motivo)** y presione **Guardar uso**.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Registrar un uso **Total** cambia el extintor a **Vacío** y genera una alerta **Urgente** de inmediato. Un uso **Parcial** lo cambia a **Medio uso**.",
                        },
                        {
                            tipo: "nota",
                            texto: "Los extintores en estatus **Vacío**, **Fuera de servicio** o **Baja** no aparecen en la lista de **Extintor** porque no se les puede registrar un uso.",
                        },
                    ],
                },
                {
                    id: "historial-exportar",
                    titulo: "¿Cómo exporto un informe en PDF o Excel?",
                    pasos: [
                        "Entre a **Historial** y presione **Exportar informe**.",
                        "En **Tipo de informe**, elija **Eventos de uso** o **Lista de extintores**.",
                        "En **Formato**, seleccione **PDF** o **Excel (.xlsx)**.",
                        "Si eligió **Eventos de uso**, revise el **Periodo**: aparece ya lleno con la fecha de hoy; cambie la **Fecha de inicio** y la **Fecha de fin** si lo necesita.",
                        "Si desea acotar el documento, elija un **Edificio o área (opcional)** y después un **Piso (opcional)**.",
                        "Presione **Exportar** para descargar el archivo en su dispositivo.",
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "La **Lista de extintores** muestra el inventario actual y no usa fechas. Si borra las fechas al exportar **Eventos de uso**, aparecerá el mensaje **Elija la fecha de inicio y la de fin.**",
                        },
                        {
                            tipo: "nota",
                            texto: "El selector **Piso (opcional)** se habilita después de elegir un **Edificio o área (opcional)**. Si no elige ninguno, el informe incluye todo el plantel.",
                        },
                    ],
                },
            ],
        },

        {
            id: "alertas",
            titulo: "Alertas",
            icono: "Bell",
            resumen:
                "Revise los avisos urgentes, próximos e informativos del sistema y márquelos como leídos.",
            tareas: [
                {
                    id: "alertas-tipos",
                    titulo: "¿Qué significan los tipos de alerta?",
                    introduccion:
                        "SIME clasifica las notificaciones en tres niveles para ayudarle a priorizar.",
                    definiciones: [
                        {
                            termino: "**Urgente** (rojo)",
                            definicion:
                                "Requiere atención inmediata. Aparece cuando un extintor está vencido, **Vacío**, **Fuera de servicio** o tiene un mantenimiento atrasado.",
                        },
                        {
                            termino: "**Próximo** (amarillo)",
                            definicion:
                                "Aviso preventivo emitido con 7 días de anticipación cuando un extintor está por vencer o se acerca un mantenimiento programado.",
                        },
                        {
                            termino: "**Informativo** (turquesa)",
                            definicion:
                                "Recordatorio emitido 3 días antes de una capacitación programada.",
                        },
                    ],
                    avisos: [
                        {
                            tipo: "nota",
                            texto: "Las alertas se actualizan automáticamente cada mañana, y además de forma inmediata cuando registra un uso **Total**.",
                        },
                    ],
                },
                {
                    id: "alertas-gestionar",
                    titulo: "¿Cómo filtro y marco alertas como leídas?",
                    pasos: [
                        "Seleccione la campana de **Notificaciones** en la barra superior para ver los avisos recientes.",
                        "Para ver el listado completo, presione **Ver todas las notificaciones** y abrirá **Centro de Alertas y Notificaciones**.",
                        "Use los filtros **Todos**, **Urgente**, **Próximo** e **Informativo** para consultar un nivel específico.",
                        "Presione **Marcar leída** en una alerta individual o **Marcar todas como leídas** para limpiar los avisos pendientes.",
                    ],
                    avisos: [
                        {
                            tipo: "consejo",
                            texto: "Desde la campana también puede marcar un aviso individual con el botón de palomita o seleccionar una alerta para ir directo a **Extintores** o **Agenda**.",
                        },
                    ],
                },
            ],
        },

        {
            id: "perfil",
            titulo: "Perfil",
            icono: "User",
            resumen:
                "Actualice su nombre, el correo de su cuenta y su contraseña de acceso.",
            tareas: [
                {
                    id: "perfil-actualizar-datos",
                    titulo: "¿Cómo cambio mi nombre o mi correo electrónico?",
                    pasos: [
                        "Seleccione su nombre o iniciales en la esquina superior derecha y elija **Mi Perfil**.",
                        "En la sección **Perfil**, actualice los campos **Nombre** o **Correo electrónico**.",
                        "Presione **Guardar**.",
                        "Si modificó el correo electrónico, verifique la nueva dirección en la ventana **Confirmar cambio de correo** y confirme el cambio.",
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "El sistema le pide confirmar el cambio de correo porque esa será su dirección de inicio de sesión y ahí llegará el enlace para recuperar su contraseña.",
                        },
                    ],
                },
                {
                    id: "perfil-cambiar-contrasena",
                    titulo: "¿Cómo cambio mi contraseña?",
                    pasos: [
                        "Entre a **Mi Perfil** desde el menú de su cuenta en la esquina superior derecha.",
                        "Ubique la sección **Actualizar contraseña**.",
                        "Escriba su **Contraseña actual**, luego su **Nueva contraseña** y repítala en **Confirmar contraseña**.",
                        "Si desea verificar lo que escribió, presione el ícono del ojo en cada campo para mostrar u ocultar la contraseña.",
                        "Presione **Guardar**.",
                    ],
                },
            ],
        },

        {
            id: "glosario",
            titulo: "Glosario",
            icono: "BookText",
            resumen:
                "Consulte el significado de los estatus, vigencias, tipos de mantenimiento y conceptos de SIME.",
            tareas: [
                {
                    id: "glosario-estatus-vs-vigencia",
                    titulo: "¿Cuál es la diferencia entre estatus y estado de vigencia?",
                    introduccion:
                        "En SIME existen dos conceptos distintos para describir cada extintor: su condición física (**estatus**) y su calendario de revisión (**estado de vigencia**).",
                    definiciones: [
                        {
                            termino: "Estatus: **Disponible**",
                            definicion:
                                "El extintor está lleno, en su lugar y listo para usarse en una emergencia.",
                        },
                        {
                            termino: "Estatus: **Medio uso**",
                            definicion:
                                "Ya fue accionado parcialmente, por lo que no está completamente lleno y conviene programar su recarga.",
                        },
                        {
                            termino: "Estatus: **Vacío**",
                            definicion:
                                "No tiene carga porque ya se descargó por completo.",
                        },
                        {
                            termino: "Estatus: **Fuera de servicio**",
                            definicion:
                                "Está dañado, en revisión o en taller, por lo que no puede utilizarse.",
                        },
                        {
                            termino: "Estatus: **Baja**",
                            definicion:
                                "Se retiró definitivamente del inventario activo.",
                        },
                        {
                            termino: "Vigencia: **Vigente**",
                            definicion:
                                "Su fecha de vencimiento está a más de 7 días.",
                        },
                        {
                            termino: "Vigencia: **Por vencer**",
                            definicion:
                                "Faltan 7 días o menos para su fecha de vencimiento.",
                        },
                        {
                            termino: "Vigencia: **Vencido**",
                            definicion:
                                "Su fecha de vencimiento ya pasó y requiere mantenimiento.",
                        },
                    ],
                    avisos: [
                        {
                            tipo: "importante",
                            texto: "Estatus y vigencia son independientes: un extintor puede estar **Vigente** por fecha y **Vacío** por haberse usado hoy mismo.",
                        },
                    ],
                },
                {
                    id: "glosario-mantenimiento-alertas",
                    titulo: "¿Qué tipos de mantenimiento y de alerta maneja el sistema?",
                    definiciones: [
                        {
                            termino: "Mantenimiento: **Relleno de contenido**",
                            definicion:
                                "Recarga del agente extintor (polvo, gas o agua) tras un uso o por caducidad.",
                        },
                        {
                            termino: "Mantenimiento: **Revisión**",
                            definicion:
                                "Inspección física periódica de presión, manguera, seguro y etiqueta.",
                        },
                        {
                            termino: "Mantenimiento: **Otra**",
                            definicion:
                                "Reparaciones adicionales, como cambio de válvula, manguera o pintura.",
                        },
                        {
                            termino: "Alerta **Urgente**",
                            definicion:
                                "Extintor vencido, vacío, fuera de servicio o mantenimiento atrasado.",
                        },
                        {
                            termino: "Alerta **Próximo**",
                            definicion:
                                "Extintor por vencer o mantenimiento programado dentro de los próximos 7 días.",
                        },
                        {
                            termino: "Alerta **Informativo**",
                            definicion:
                                "Recordatorio de una capacitación programada con 3 días de anticipación.",
                        },
                    ],
                },
                {
                    id: "glosario-descargas-extintores",
                    titulo: "¿Qué significan los tipos de descarga y de agente extintor?",
                    definiciones: [
                        {
                            termino: "Descarga **Total**",
                            definicion:
                                "Se vació el cilindro por completo. Cambia el estatus del extintor a **Vacío**.",
                        },
                        {
                            termino: "Descarga **Parcial**",
                            definicion:
                                "Se accionó solo una parte de la carga. Cambia el estatus del extintor a **Medio uso**.",
                        },
                        {
                            termino: "**PQS** (Polvo Químico Seco)",
                            definicion:
                                "Extintor multipropósito de polvo, medido en kilogramos (kg).",
                        },
                        {
                            termino: "**CO2** (Dióxido de carbono)",
                            definicion:
                                "Extintor de gas frío sin residuos, ideal para equipos eléctricos y cómputo; se mide en kilogramos (kg).",
                        },
                        {
                            termino: "**Agua**",
                            definicion:
                                "Apto únicamente para sólidos como papel, cartón o madera; nunca debe usarse en electricidad ni aceite. Se mide en litros.",
                        },
                        {
                            termino: "**Clase K**",
                            definicion:
                                "Diseñado específicamente para incendios de aceites y grasas en cocinas; se mide en litros.",
                        },
                    ],
                },
            ],
        },
    ],

    preguntas: [
        {
            id: "faq-extintor-no-aparece-mapa",
            pregunta: "¿Por qué un extintor no aparece en el plano?",
            respuesta:
                "Porque aún no tiene una posición asignada en el plano. Entre a **Mapa**, abra el edificio y el piso registrados para ese equipo y lo encontrará en la bandeja **Por ubicar en el plano**, listo para arrastrarlo o colocarlo con un toque. Si el equipo fue dado de **Baja**, tampoco se muestra en el mapa.",
        },
        {
            id: "faq-extintor-no-aparece-uso",
            pregunta: "¿Por qué no aparece un extintor al registrar un uso?",
            respuesta:
                "En el panel **Registrar uso** solo aparecen extintores en estatus **Disponible** o **Medio uso**. Los equipos en estatus **Vacío**, **Fuera de servicio** o **Baja** no se muestran porque no se les puede registrar una descarga.",
        },
        {
            id: "faq-vigente-y-vacio",
            pregunta: "¿Por qué un extintor Vigente aparece como Vacío?",
            respuesta:
                "Porque la **vigencia** depende de su fecha de vencimiento y el **estatus** refleja su condición física actual. Si un extintor con revisión vigente se descarga por completo hoy, seguirá **Vigente** por fecha pero su estatus cambiará a **Vacío** hasta que reciba un mantenimiento de **Relleno de contenido**.",
        },
        {
            id: "faq-frecuencia-alertas",
            pregunta: "¿Cada cuándo se actualizan las alertas?",
            respuesta:
                "Las alertas de vencimiento, mantenimientos y capacitaciones se actualizan automáticamente **cada mañana**. Además, al registrar un uso **Total** en **Historial**, la alerta **Urgente** se genera de inmediato.",
        },
        {
            id: "faq-correo-recuperacion",
            pregunta: "No me llegó el correo de recuperación, ¿qué hago?",
            respuesta:
                "Revise primero las carpetas de correo no deseado o spam. Asegúrese también de haber escrito el **correo con el que inicia sesión** en SIME, ya que el enlace solo se envía a la dirección registrada en **Mi Perfil**.",
        },
        {
            id: "faq-usar-en-movil",
            pregunta: "¿Puedo usar SIME desde el móvil o la tableta?",
            respuesta:
                "Sí. SIME se adapta automáticamente a computadora, tableta y móvil. En móvil, el menú pasa a la barra inferior, los formularios se abren con el botón **Añadir** y en **Mapa** puede ubicar extintores tocando la tarjeta y luego tocando el área en el plano.",
        },
        {
            id: "faq-extintores-capacitacion",
            pregunta:
                "¿Por qué no aparecen todos los extintores al agendar una capacitación?",
            respuesta:
                "Para aprovechar los equipos que ya fueron utilizados parcialmente, SIME solo permite seleccionar en **Extintores para la práctica** aquellos que están en estatus **Medio uso** y que no recibieron mantenimiento en los últimos 7 días.",
        },
        {
            id: "faq-editar-evento-pasado",
            pregunta:
                "¿Por qué no puedo editar o eliminar un evento pasado en la Agenda?",
            respuesta:
                "Para conservar el registro histórico, SIME solo permite editar o eliminar mantenimientos pendientes y capacitaciones futuras que no tengan usos registrados.",
        },
    ],
};
