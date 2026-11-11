export const pasosMetodoTapa = [
    { id: 1, accion: "Tirar", descripcion: "Del pasador metálico de seguridad para romper el sello plástico." },
    { id: 2, accion: "Apuntar", descripcion: "La manguera o boquilla hacia la base del fuego desde una distancia segura (2 a 3 metros)." },
    { id: 3, accion: "Presionar", descripcion: "La palanca superior de accionamiento con firmeza." },
    { id: 4, accion: "Abanicar", descripcion: "De lado a lado cubriendo todo el ancho del fuego hasta apagarlo por completo." }
];

export const clasesFuego = [
    {
        id: "A",
        letra: "A",
        titulo: "Fuego Clase A. Sólidos",
        colorClase: "bg-green-200 text-green-800",
        identificacion: "Triángulo verde con la letra \"A\" (o pictograma de bote de basura y leña ardiendo).",
        combustibles: "Madera, papel, cartón, tela y plásticos (materiales que dejan brasas o cenizas y arden en profundidad).",
        extintoresRecomendados: [
            { nombre: "Agua presurizada", desc: "Enfría el material por debajo del punto de ignición." },
            { nombre: "Espuma o polvo químico seco (PQS) ABC", desc: "Añaden efecto de sofocación al aislar el oxígeno." }
        ],
        comoSeUsa: [
            "Aplica el método T-A-P-A apuntando a la base del fuego desde 2 a 3 metros de distancia.",
            "Una vez apagadas las llamas superficiales, remueve las brasas con una herramienta larga y sigue aplicando el extintor para enfriar el núcleo y evitar que vuelva a encenderse."
        ],
        alertas: [
            { tipo: "Restricción crítica:", texto: "nunca dispares un extintor de agua si hay cables, motores o equipos eléctricos energizados cerca debido al alto riesgo de electrocución." }
        ]
    },
    {
        id: "B",
        letra: "B",
        titulo: "Fuego Clase B. Líquidos y gases inflamables",
        colorClase: "bg-red-200 text-red-800",
        identificacion: "Cuadrado rojo con la letra \"B\" (o pictograma de un bidón vertiendo líquido inflamable en llamas).",
        combustibles: "Gasolina, aceite, pinturas, solventes y alcohol.",
        extintoresRecomendados: [
            { nombre: "CO2, polvo químico seco (PQS) o espuma", desc: "Detienen el incendio por sofocación al desplazar o eliminar el oxígeno." },
            { nombre: "Sobre el CO2", desc: "Contiene gas en estado líquido a muy alta presión y es ideal donde hay equipo electrónico porque se disipa sin dejar residuos." }
        ],
        areasComunes: [
            { nombre: "Laboratorios", desc: "Por el uso de alcoholes, solventes, reactivos químicos y gases para mecheros." },
            { nombre: "Talleres de prácticas", desc: "Áreas de maquinado, mecánica, manufactura o cabinas de pintura con aceites y grasas industriales." },
            { nombre: "Estacionamientos y transporte escolar", desc: "Zonas con riesgo de derrames de gasolina o aceite de motor." }
        ],
        comoSeUsa: [
            "Apunta la boquilla a la base de las llamas y realiza un movimiento de barrido de lado a lado."
        ],
        alertas: [
            { tipo: "Regla crítica de seguridad: ¡Nunca uses agua!", texto: "Al ser más densa que los líquidos inflamables, se hunde y provoca que el líquido ardiendo salpique y propague el incendio." },
            { tipo: "Precaución con CO2:", texto: "sujeta siempre el extintor por las asas o empuñaduras de plástico o madera; nunca toques la boquilla ancha (corneta), ya que durante la descarga se enfría bajo cero y causa quemaduras severas por congelación." }
        ]
    },
    {
        id: "C",
        letra: "C",
        titulo: "Fuego Clase C · Equipos eléctricos energizados",
        colorClase: "bg-blue-200 text-blue-800",
        identificacion: "Círculo azul con la letra \"C\" (o pictograma de un enchufe y toma de corriente eléctrica en llamas).",
        combustibles: "Aparatos, motores, equipos e instalaciones eléctricas que continúan conectados a la corriente eléctrica.",
        extintoresRecomendados: [
            { nombre: "1. Dióxido de carbono (CO2)", desc: "Reduce el oxígeno y enfría parcialmente sin dejar residuo; se usa en equipos eléctricos y líquidos inflamables, aunque pierde eficacia con corrientes de aire en exteriores y conlleva riesgo de asfixia en espacios pequeños." },
            { nombre: "2. Polvo químico seco (PQS / ABC)", desc: "Inhibe químicamente la combustión y sirve para protección general en edificios y talleres con varios tipos de riesgo, pero deja abundante residuo que puede dañar circuitos, conectores y ventiladores electrónicos." },
            { nombre: "3. Agente limpio", desc: "Absorbe el calor dejando residuo mínimo o nulo; es ideal para instalaciones electrónicas, telecomunicaciones y centros de datos (sujeto a consideraciones de costo, ventilación y restricciones ambientales según el agente)." }
        ],
        areasComunes: "Centros de datos, cuartos de servidores y telecomunicaciones, subestaciones y tableros eléctricos, laboratorios de cómputo o electrónica, oficinas y talleres con maquinaria eléctrica.",
        ubicacion: "Distancia máxima de recorrido: 23 metros.",
        comoSeUsa: [
            "Si es seguro hacerlo, corta primero el suministro eléctrico desde el interruptor o tablero general; luego aplica el método T-A-P-A dirigiendo las descargas hacia la base de las llamas o las rejillas del equipo desde una distancia segura."
        ],
        alertas: [
            { tipo: "Regla crítica de seguridad:", texto: "¡Jamás uses agua ni espuma conductora mientras el equipo siga conectado a la corriente! El chorro conduce la electricidad con riesgo de electrocución letal. Tras apagar el fuego, vigila que el calor acumulado no reencienda el aislamiento de los cables." }
        ]
    },
    {
        id: "D",
        letra: "D",
        titulo: "Fuego Clase D · Metales combustibles",
        colorClase: "bg-yellow-200 text-yellow-800",
        identificacion: "Estrella amarilla de cinco puntas con la letra \"D\" (o pictograma de un engrane o pieza metálica en llamas).",
        combustibles: "Magnesio, sodio, potasio, titanio y aluminio (especialmente en polvo, virutas, limaduras o fragmentos pequeños).",
        extintoresRecomendados: [
            { nombre: "Extintor Clase D con polvo especial", desc: "Generalmente a base de cloruro de sodio: forma una corteza protectora sobre el metal ardiente para aislar el oxígeno, sofocar el fuego y disipar el calor." }
        ],
        areasComunes: "Industrias metalmecánicas, fundiciones, talleres de maquinado o torno y laboratorios químicos especializados que manipulan metales reactivos.",
        ubicacion: "Se define según el análisis de riesgos, la cantidad de metal y la normativa aplicable (como referencia orientativa, OSHA en EE. UU. indica una distancia máxima de recorrido de 22.9 metros para riesgos Clase D).",
        comoSeUsa: [
            "Identificar el incendio: confirma sin exponerte al peligro que se trata de un metal combustible y que el extintor está aprobado para ese material.",
            "Evaluar el riesgo: si el fuego crece, hay mucho humo, riesgo de explosión o no tienes capacitación, evacúa, activa la alarma y llama a emergencias.",
            "Aplicar el agente: solo si el fuego es incipiente, estás capacitado y tienes vía de escape, aplica el polvo lentamente sin usar un chorro fuerte que disperse el metal ardiendo.",
            "Vigilar y evitar reignición: no remuevas la capa de polvo ni manipules los residuos calientes; deja la supervisión final al personal capacitado."
        ],
        alertas: [
            { tipo: "Regla crítica de seguridad: ¡Jamás uses agua!", texto: "El contacto del agua con metales como el magnesio ardiente provoca una reacción explosiva violenta." }
        ]
    },
    {
        id: "K",
        letra: "K",
        titulo: "Fuego Clase K (Kitchen) / F",
        colorClase: "bg-gray-200 text-gray-800",
        identificacion: "Triángulo verde con la letra \"A\" (o pictograma de bote de basura y leña ardiendo).",
        combustibles: "Aceites y grasas vegetales o animales (muy comunes en cocinas industriales).",
        extintoresRecomendados: [
            { nombre: "Extintor Clase K con agente químico húmedo", desc: "Se mezcla con la grasa ardiendo y forma una capa de espuma que aísla el combustible del aire y apaga el fuego." }
        ],
        alertas: [
            { tipo: "Regla crítica de seguridad:", texto: "nunca uses agua, ya que resulta contraproducente y propaga el fuego de aceite." }
        ]
    }
];