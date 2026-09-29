/* =====================================================================
   CONFIG.JS — TODOS LOS DATOS EDITABLES DEL SITIO
   =====================================================================

   CÓMO EDITAR ESTE ARCHIVO SIN ROMPER NADA
   1. Cambiá solo lo que está entre comillas "..." o los números.
   2. No borres las comas que hay al final de cada línea.
   3. Los textos van entre comillas dobles "...". Si dentro de un texto
      necesitás comillas, usá comillas simples: 'así'.
   4. Los números van SIN comillas y con PUNTO para los decimales:
      escribí 7.25 (no 7,25).
   5. Lo que empieza con // es un comentario: no aparece en la página.
   6. Guardá el archivo y recargá la página para ver los cambios.

   Si después de editar aparece un aviso rojo arriba de la página, hay un
   error de escritura en este archivo (casi siempre una coma o una comilla).

   MARCAS PARA REVISAR ANTES DE PUBLICAR
   [COMPLETAR]           → dato que falta cargar.
   [EJEMPLO]             → contenido inventado de muestra. Reemplazar por uno real.
   [VALIDAR CON DAMIÁN]  → texto o número general que Damián tiene que revisar.
   ===================================================================== */

const CONFIG = {

  /* ─────────────────────────────────────────────────────────────
     1. DATOS DE DAMIÁN Y CONTACTO
     ───────────────────────────────────────────────────────────── */

  nombre: "Damián Peinado",
  cargo: "Asesor hipotecario", // [VALIDAR CON DAMIÁN] Cómo quiere presentarse (ej: "Loan Officer").
  nmls: "2713658",             // Solo el número de licencia, sin la palabra NMLS.

  // Empresa o banco con el que trabaja. Si lo completás, aparece en el pie de página.
  // [COMPLETAR] Las normas de publicidad hipotecaria de EE.UU. suelen exigir este dato.
  empresaNombre: "",
  empresaNmls: "",

  // WhatsApp de Damián: código de país + código de área + número.
  // Solo números: sin +, sin espacios, sin guiones.
  //   Argentina: 54 + 9 + 11 + 12345678  →  "5491112345678"
  //   EE.UU.:    1 + 305 + 1234567       →  "13051234567"
  whatsappNumero: "5491100000000", // [COMPLETAR] Este número es de prueba.

  // Mensaje que aparece escrito cuando alguien toca "Hablar por WhatsApp".
  whatsappMensaje: "Hola Damián, vi tu página y quiero consultarte por un crédito para comprar en Miami.",

  // Link de agenda (Calendly). Si lo dejás vacío (""), el botón "Agendar una llamada"
  // abre WhatsApp pidiendo una llamada.
  calendlyUrl: "", // [COMPLETAR] Ej: "https://calendly.com/damian-peinado/llamada"

  instagramUsuario: "damian.miami",
  instagramUrl: "https://www.instagram.com/damian.miami/",
  seguidores: "+61K",
  aniosEnBanca: 30,


  /* ─────────────────────────────────────────────────────────────
     2. FOTOS
     Subí las fotos a la carpeta assets/img y escribí acá la ruta.
     Recomendado: vertical (4:5), 800 x 1000 px, formato .webp o .jpg,
     menos de 150 KB (podés comprimirlas gratis en squoosh.app).
     ───────────────────────────────────────────────────────────── */
  fotos: {
    hero: "assets/img/damian-placeholder.svg",    // [COMPLETAR] Foto principal, arriba de todo.
    sobreMi: "assets/img/damian-placeholder.svg", // [COMPLETAR] Foto de la sección "Quién soy".
  },


  /* ─────────────────────────────────────────────────────────────
     3. TASAS
     Se usan en la calculadora, en la tarjeta "Tasa estimada hoy"
     y en la tabla "Tasas de referencia".
     Escribí el número con punto: 7.25 significa 7,25 % anual.
     ───────────────────────────────────────────────────────────── */
  tasasPorPlazo: {
    15: 6.75, // [EJEMPLO] Tasa anual a 15 años
    20: 7.0,  // [EJEMPLO] Tasa anual a 20 años
    30: 7.25, // [EJEMPLO] Tasa anual a 30 años
  },

  // Cambiá esta fecha cada vez que actualices las tasas.
  tasasFechaActualizacion: "29 de septiembre de 2026",

  // Texto chico debajo de la tabla de tasas.
  tasasNota: "Tasas orientativas para compradores extranjeros. La tasa final depende de tu perfil, del inicial y de la propiedad.", // [VALIDAR CON DAMIÁN]

  // Filas EXTRA para la tabla de tasas (opcional).
  // Las tasas a 15, 20 y 30 años de arriba ya aparecen solas en la tabla.
  //   producto: nombre que se muestra
  //   tasa:     tasa anual (%)
  //   detalle:  texto chico debajo del nombre (podés dejarlo vacío "")
  //   plazo:    años para calcular la cuota de ejemplo (normalmente 30)
  // Para no mostrar filas extra, dejá los corchetes vacíos:  tablaTasasExtra: [],
  tablaTasasExtra: [
    { producto: "Tasa ajustable 7/6 ARM", tasa: 6.95, detalle: "Fija los primeros 7 años", plazo: 30 }, // [EJEMPLO]
  ],


  /* ─────────────────────────────────────────────────────────────
     4. CALCULADORA
     Valores con los que arranca la calculadora y supuestos de cálculo.
     ───────────────────────────────────────────────────────────── */
  calculadora: {
    precio: 400000,  // Precio de la propiedad con el que arranca (USD)
    inicial: 120000, // Inicial / ahorro con el que arranca (USD)
    plazo: 30,       // Plazo con el que arranca: 15, 20 o 30

    inicialMinimoPorcentaje: 25, // [VALIDAR CON DAMIÁN] % mínimo de inicial. Si el usuario pone menos, se le avisa.
    gastosCierrePorcentaje: 3,   // [VALIDAR CON DAMIÁN] Gastos de cierre estimados, en % del precio.

    impuestoPorcentaje: 1.9, // [VALIDAR CON DAMIÁN] Impuesto a la propiedad anual, en % del precio.
    seguroAnual: 2400,       // [VALIDAR CON DAMIÁN] Seguro anual por defecto (USD).
    expensasMensuales: 450,  // [VALIDAR CON DAMIÁN] Expensas / HOA mensuales por defecto (USD).

    // Mínimo y máximo de la barra deslizable del precio (USD).
    precioMinimo: 100000,
    precioMaximo: 3000000,
  },


  /* ─────────────────────────────────────────────────────────────
     5. INICIO (parte de arriba de la página)
     ───────────────────────────────────────────────────────────── */
  hero: {
    // Hora que se muestra en la tarjeta "Llamada con Damián". Es decorativa.
    llamadaHorario: "Hoy · 18:30 hs", // [EJEMPLO]

    // Ejemplo que se usa para la mini tabla de cuotas a 15, 20 y 30 años.
    ejemploPrecio: 400000,
    ejemploInicialPorcentaje: 30,
  },


  /* ─────────────────────────────────────────────────────────────
     6. QUIÉN SOY
     ───────────────────────────────────────────────────────────── */
  sobreMi: {
    // [VALIDAR CON DAMIÁN] Cada texto entre comillas es un párrafo.
    parrafos: [
      "Soy argentino y trabajé 30 años en banca. Sé cómo analiza un banco un pedido de crédito y sé lo que cuesta juntar cada dólar.",
      "Hoy me dedico a una sola cosa: ayudar a argentinos y latinos a comprar su propiedad en Miami con crédito hipotecario, para que no tengan que poner todo en efectivo.",
      "Te explico cada número en español, sin letra chica, y te acompaño desde la primera consulta hasta el cierre.",
    ],

    // Los 3 números destacados.
    datos: [
      { numero: "30", texto: "años de experiencia en banca" },
      { numero: "+61K", texto: "personas siguen sus consejos en Instagram" },
      { numero: "100%", texto: "de la atención en español" }, // [VALIDAR CON DAMIÁN]
    ],
  },


  /* ─────────────────────────────────────────────────────────────
     7. REELS ("Mirá cómo funciona")
     Hasta 4 videos. Para cada uno podés usar UNA de estas opciones:
       link:    link del reel de Instagram. Al tocarlo se abre en Instagram.
       video:   un archivo .mp4 subido a assets/video (se reproduce en la página).
     portada: imagen vertical 9:16 para mostrar antes de reproducir (opcional).
     Si link y video están vacíos, se muestra una tarjeta con ▶ que abre su Instagram.
     ───────────────────────────────────────────────────────────── */
  reels: [
    { titulo: "Cómo comprar en Miami sin pagar todo en efectivo", link: "", video: "", portada: "" }, // [COMPLETAR]
    { titulo: "¿Cuánto necesitás de inicial?", link: "", video: "", portada: "" },                    // [COMPLETAR]
    { titulo: "Crédito siendo extranjero: lo que tenés que saber", link: "", video: "", portada: "" }, // [COMPLETAR]
    { titulo: "Renta vs. cuota: los números reales", link: "", video: "", portada: "" },              // [COMPLETAR]
  ],


  /* ─────────────────────────────────────────────────────────────
     8. TESTIMONIOS
     [EJEMPLO] TODOS los testimonios de abajo son inventados, de muestra.
     Reemplazalos por testimonios REALES (con permiso del cliente).
     Cuando cargues uno real, cambiá  ejemplo: true  por  ejemplo: false
     (así desaparece la etiqueta "Testimonio de ejemplo").
     foto: ruta a una foto cuadrada (opcional). Si está vacía, se muestran las iniciales.
     ───────────────────────────────────────────────────────────── */
  testimonios: [
    {
      ejemplo: true, // [EJEMPLO]
      nombre: "Martín y Laura G.",
      ciudad: "Córdoba, Argentina",
      compra: "Departamento en Brickell para renta",
      texto: "Pensábamos que había que llevar todo en efectivo. Pusimos una parte, financiamos el resto y seguimos teniendo ahorros para otras inversiones.",
      foto: "",
    },
    {
      ejemplo: true, // [EJEMPLO]
      nombre: "Carolina R.",
      ciudad: "Montevideo, Uruguay",
      compra: "Segunda vivienda en Aventura",
      texto: "Me explicaron cada número antes de firmar. Sabía cuánto iba a pagar por mes desde el primer día, sin sorpresas.",
      foto: "",
    },
    {
      ejemplo: true, // [EJEMPLO]
      nombre: "Diego F.",
      ciudad: "Buenos Aires, Argentina",
      compra: "Preconstrucción en Edgewater",
      texto: "Compré en pozo y cuando se entregó la unidad financié el saldo. El proceso fue mucho más simple de lo que imaginaba.",
      foto: "",
    },
  ],

  // Espacio para un testimonio en video. Misma lógica que los reels (link o video).
  testimonioVideo: {
    ejemplo: true, // [EJEMPLO]
    titulo: "Cómo compramos nuestro departamento en Miami con crédito",
    nombre: "Familia R., Rosario",
    link: "",    // [COMPLETAR]
    video: "",   // [COMPLETAR]
    portada: "",
  },


  /* ─────────────────────────────────────────────────────────────
     9. PREGUNTAS FRECUENTES
     [VALIDAR CON DAMIÁN] Son respuestas generales. Damián tiene que revisarlas
     y ajustarlas a los programas con los que trabaja.
     Podés agregar o sacar preguntas copiando o borrando un bloque { ... },
     ───────────────────────────────────────────────────────────── */
  faq: [
    {
      pregunta: "¿Puedo sacar un crédito siendo extranjero?",
      respuesta: "Sí. Existen programas pensados para compradores que no viven en EE.UU. Se analizan tus ingresos y tus ahorros en tu país, y en general se pide un inicial más alto que a un residente.",
    }, // [VALIDAR CON DAMIÁN]
    {
      pregunta: "¿Cuánto necesito de inicial?",
      respuesta: "Para compradores extranjeros el inicial suele arrancar en el 25% del precio, según el programa y la propiedad. A eso sumale los gastos de cierre, que suelen rondar entre el 2% y el 4% del precio.",
    }, // [VALIDAR CON DAMIÁN]
    {
      pregunta: "¿Necesito número de seguro social o historial en EE.UU.?",
      respuesta: "No necesariamente. Hay programas para extranjeros que no piden número de seguro social ni historial de crédito en EE.UU. En esos casos se usan referencias bancarias y comprobantes de tu país.",
    }, // [VALIDAR CON DAMIÁN]
    {
      pregunta: "¿Qué papeles me piden?",
      respuesta: "En general: pasaporte vigente, extractos bancarios de los últimos meses, comprobantes de ingresos, una carta de referencia bancaria y la documentación que muestre el origen del dinero del inicial. La lista final depende del banco y de tu perfil.",
    }, // [VALIDAR CON DAMIÁN]
    {
      pregunta: "¿Cuánto tarda el proceso?",
      respuesta: "La precalificación puede estar en pocos días. Una vez que elegís la propiedad y tenés la documentación completa, el crédito suele tardar entre 30 y 60 días hasta el cierre.",
    }, // [VALIDAR CON DAMIÁN]
    {
      pregunta: "¿Puedo alquilar la propiedad?",
      respuesta: "Sí. Muchos programas están pensados justamente para inversión y renta. Ojo: cada edificio tiene sus propias reglas de alquiler (por ejemplo, plazos mínimos), así que conviene revisarlas antes de comprar.",
    }, // [VALIDAR CON DAMIÁN]
  ],


  /* ─────────────────────────────────────────────────────────────
     10. FORMULARIO DE PRECALIFICACIÓN
     Opciones de cada pregunta. Para "min" y "max" usá números sin puntos.
     max: null significa "sin límite".
     ───────────────────────────────────────────────────────────── */
  formulario: {
    objetivos: [
      "Invertir",
      "Segunda vivienda",
      "Renta",
    ],

    presupuestos: [
      { texto: "Hasta USD 300.000", min: 0, max: 300000 },
      { texto: "USD 300.000 a 500.000", min: 300000, max: 500000 },
      { texto: "USD 500.000 a 800.000", min: 500000, max: 800000 },
      { texto: "USD 800.000 a 1.500.000", min: 800000, max: 1500000 },
      { texto: "Más de USD 1.500.000", min: 1500000, max: null },
    ],

    iniciales: [
      { texto: "Menos de USD 100.000", min: 0, max: 100000 },
      { texto: "USD 100.000 a 200.000", min: 100000, max: 200000 },
      { texto: "USD 200.000 a 400.000", min: 200000, max: 400000 },
      { texto: "Más de USD 400.000", min: 400000, max: null },
    ],

    // codigo: código telefónico del país (se completa solo en el paso del WhatsApp).
    paises: [
      { nombre: "Argentina", codigo: "54" },
      { nombre: "Uruguay", codigo: "598" },
      { nombre: "Chile", codigo: "56" },
      { nombre: "Paraguay", codigo: "595" },
      { nombre: "México", codigo: "52" },
      { nombre: "Colombia", codigo: "57" },
      { nombre: "Perú", codigo: "51" },
      { nombre: "España", codigo: "34" },
      { nombre: "Estados Unidos", codigo: "1" },
    ],

    cuando: [
      "Ya, estoy listo",
      "En 3 a 6 meses",
      "Más adelante",
    ],
  },
};
