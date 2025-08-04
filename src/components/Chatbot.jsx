import { useState } from "react";
import Filtros from "./Filtros";
import Resultados from "./Resultados";
import Chat from "./Chat";
import { agruparPrecios, detectarNumeroPropiedad } from "../utils/utils";
import { enviarPreguntaGemini } from "../utils/gemini";

export default function Chatbot({ properties }) {
  const [paso, setPaso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [presupuesto, setPresupuesto] = useState("");

  const [chatMensajes, setChatMensajes] = useState([
    {
      sender: "bot",
      text: "Hola, soy Top Mexico Real Estate. ¿En qué puedo ayudarte hoy?, Prototipo Beta en desarrollo",
    },
  ]);
  const [inputChat, setInputChat] = useState("");

  const [modoConfirmacionCita, setModoConfirmacionCita] = useState(false);
  const [propiedadParaCita, setPropiedadParaCita] = useState(null);
  const [ultimasPropiedades, setUltimasPropiedades] = useState([]);

  const avanzar = () => setPaso((p) => p + 1);
  const retroceder = () => setPaso((p) => Math.max(p - 1, 0));

  const tiposUnicos = [...new Set(properties.map((p) => p.SubType))];
  const ciudadesUnicas = [...new Set(properties.map((p) => p.City))];

  const sinonimosTipo = {
    "single home": "Single home",
    casa: "Single home",
    house: "Single home",
    departamento: "Condo",
    condo: "Condo",
    penthouse: "Penthouse",
    studio: "Studio",
    lote: "Residential Lot",
  };

  const detectarTipoEnMensaje = (mensaje) => {
    const mensajeLower = mensaje.toLowerCase();
    for (const [sinonimo, tipoReal] of Object.entries(sinonimosTipo)) {
      if (mensajeLower.includes(sinonimo.toLowerCase())) return tipoReal;
    }
    return null;
  };

  const detectarCiudadEnMensaje = (mensaje) => {
    const mensajeLower = mensaje.toLowerCase();
    for (const ciudad of ciudadesUnicas) {
      if (mensajeLower.includes(ciudad.toLowerCase())) return ciudad;
    }
    return null;
  };

  function enviarMensajeChat() {
    if (!inputChat.trim()) return;
    const userMessage = inputChat.trim().toLowerCase();

    setChatMensajes((prev) => [...prev, { sender: "user", text: inputChat.trim() }]);
    setInputChat("");

    setTimeout(() => procesarMensaje(userMessage), 1000);
  }

  function enviarMensajeChatConTexto(texto) {
    if (!texto.trim()) return;
    const userMessage = texto.trim().toLowerCase();

    setChatMensajes((prev) => [...prev, { sender: "user", text: texto.trim() }]);
    setInputChat("");

    setTimeout(() => procesarMensaje(userMessage), 500);
  }

  async function procesarMensaje(userMessage) {
    const mensajeLower = userMessage.toLowerCase();

    // Respuestas especiales para saludos sin llamar a Gemini
    const saludos = ["hola", "buenos días", "buenas tardes", "buenas noches", "buenas", "qué tal"];
    if (saludos.some((saludo) => mensajeLower.includes(saludo))) {
      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "¡Hola! 👋 ¿Te gustaría buscar una propiedad o necesitas ayuda con algo más?",
        },
      ]);
      return;
    }

    // Respuesta rápida para "qué día es hoy" o "fecha actual"
    if (
      mensajeLower.includes("qué día es hoy") ||
      mensajeLower.includes("fecha") ||
      mensajeLower.includes("día actual") ||
      mensajeLower.includes("hoy es")
    ) {
      const fechaActual = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Hoy es ${fechaActual}. Si estás buscando propiedades en México, Top Mexico Real Estate puede ayudarte. ¿En qué parte de México estás interesado y qué tipo de propiedad buscas? (Por cierto, recuerda que estás en el sitio Top Mexico Real Estate, especializado en asesorarte sobre propiedades inmobiliarias.)`,
        },
      ]);
      return;
    }

    // Detectar preguntas matemáticas simples (ejemplo: "5 + 5", "cuánto es 5 por 3", etc.)
    const esPreguntaMatematica = /(\d+\s*[\+\-\*\/]\s*\d+)/.test(userMessage);
    if (esPreguntaMatematica) {
      const contexto = `Eres Top Mexico Real Estate, un asistente virtual experto en bienes raíces en México. Responde claramente.`;

      try {
        const respuestaGemini = await enviarPreguntaGemini(userMessage, contexto);
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              respuestaGemini +
              "\n\n(Por cierto, recuerda que estás en el sitio Top Mexico Real Estate, especializado en asesorarte sobre propiedades inmobiliarias.)",
          },
        ]);
      } catch {
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta nuevamente.",
          },
        ]);
      }
      return;
    }

    // Manejo modo confirmacion cita (tu lógica actual)
    if (modoConfirmacionCita) {
      if (
        mensajeLower.includes("agendar") ||
        mensajeLower.includes("cita") ||
        mensajeLower === "sí" ||
        mensajeLower === "si" ||
        mensajeLower.includes("ayuda")
      ) {
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Perfecto, para agendar una cita necesito saber qué fecha te gustaría. (Por ahora esto es demo)",
          },
        ]);
        setModoConfirmacionCita(false);
        return;
      }

      if (mensajeLower.includes("whatsapp") || mensajeLower.includes("contactar")) {
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Puedes contactar directamente por WhatsApp usando este enlace: ${propiedadParaCita?.urlWhatsapp}`,
          },
        ]);
        setModoConfirmacionCita(false);
        return;
      }

      if (
        mensajeLower.includes("no") ||
        mensajeLower.includes("otra cosa") ||
        mensajeLower.includes("nada")
      ) {
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Entendido. ¿Quieres buscar otra propiedad o necesitas ayuda con algo más?",
          },
        ]);
        setModoConfirmacionCita(false);
        return;
      }

      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "No entendí bien tu respuesta. ¿Quieres que te ayude a agendar una cita o prefieres contactar por WhatsApp?",
        },
      ]);
      return;
    }

    // Detectar si el mensaje contiene datos sobre propiedades
    const tipoDetectado = detectarTipoEnMensaje(userMessage);
    const ciudadDetectada = detectarCiudadEnMensaje(userMessage);
    const regexPrecio = /\d+[ ]*m/gi;
    const preciosDetectados = userMessage.matchAll(regexPrecio);
    const preciosNumeros = Array.from(preciosDetectados, (m) => parseInt(m[0]) * 1_000_000);
    const numeroPedido = detectarNumeroPropiedad(userMessage);

    const contieneDatosPropiedad =
      tipoDetectado || ciudadDetectada || preciosNumeros.length >= 2 || numeroPedido;

    if (contieneDatosPropiedad) {
      // Filtrado de propiedades como tienes
      let filtradas = properties;

      if (tipoDetectado) {
        filtradas = filtradas.filter((p) => p.SubType === tipoDetectado);
        setTipo(tipoDetectado);
      }

      if (ciudadDetectada) {
        filtradas = filtradas.filter((p) => p.City === ciudadDetectada);
        setCiudad(ciudadDetectada);
      }

      if (preciosNumeros.length === 2) {
        const [minP, maxP] = preciosNumeros.sort((a, b) => a - b);
        filtradas = filtradas.filter((p) => {
          const precioNum = parseInt(p.Price);
          return precioNum >= minP && precioNum <= maxP;
        });
        setPresupuesto(`${minP}-${maxP}`);
      }

      setUltimasPropiedades(filtradas);

      if (filtradas.length === 0) {
        setChatMensajes((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Lo siento, no encontré propiedades que coincidan con "${userMessage}". ¿Quieres intentar con otro criterio?`,
          },
        ]);
        return;
      }

      if (numeroPedido && numeroPedido > 0 && numeroPedido <= filtradas.length) {
        const propiedadSeleccionada = filtradas[numeroPedido - 1];
        const propiedad = {
          titulo: propiedadSeleccionada.Titles?.Title?.[0]?._ || "Sin título",
          ciudad: propiedadSeleccionada.City,
          precio: propiedadSeleccionada.Price,
          moneda: propiedadSeleccionada.PriceCurrency,
          foto: propiedadSeleccionada.Photos?.Photo?.[0] || null,
          urlWhatsapp: `https://wa.me/5219842672449?text=Hola,%20me%20interesa%20esta%20propiedad:%20${encodeURIComponent(
            propiedadSeleccionada.Titles?.Title?.[0]?._ || ""
          )}`,
        };

        setChatMensajes((prev) => [
          ...prev,
          { sender: "bot", tipo: "propiedadSeleccionada", propiedad },
          {
            sender: "bot",
            text: "¿Quieres que te ayude a agendar una cita o prefieres contactar por WhatsApp?",
          },
        ]);
        setModoConfirmacionCita(true);
        setPropiedadParaCita(propiedad);
        return;
      }

      // Mostrar primeras 3 propiedades encontradas
      const propsMostrar = filtradas.slice(0, 3).map((p) => ({
        titulo: p.Titles?.Title?.[0]?._ || "Sin título",
        ciudad: p.City,
        precio: p.Price,
        moneda: p.PriceCurrency,
        foto: p.Photos?.Photo?.[0] || null,
        urlWhatsapp: `https://wa.me/5219842672449?text=Hola,%20me%20interesa%20esta%20propiedad:%20${encodeURIComponent(
          p.Titles?.Title?.[0]?._ || ""
        )}`,
      }));

      setUltimasPropiedades(propsMostrar);

      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          tipo: "propiedades",
          propiedades: propsMostrar,
          total: filtradas.length,
          text: `Encontré ${filtradas.length} propiedades que podrían interesarte:`,
        },
      ]);
      return;
    }

    // Si no es mensaje de propiedad ni cita, se pregunta a Gemini y se añade recordatorio al final
    const contexto = `Eres Top Mexico Real Estate, un asistente virtual experto en bienes raíces en México. Contesta claramente y si el usuario pregunta algo fuera de propiedades, responde normalmente pero recuerda siempre que estás en el sitio Top Mexico Real Estate, ayudando con bienes raíces.`;

    try {
      const respuestaGemini = await enviarPreguntaGemini(userMessage, contexto);

      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            respuestaGemini +
            "\n\n(Por cierto, recuerda que estás en el sitio Top Mexico Real Estate, especializado en asesorarte sobre propiedades inmobiliarias.)",
        },
      ]);
    } catch (error) {
      setChatMensajes((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta nuevamente.",
        },
      ]);
    }
  }

  const ciudadesFiltradas = tipo
    ? [...new Set(properties.filter((p) => p.SubType === tipo).map((p) => p.City))]
    : [];

  const rangosDePrecio =
    tipo && ciudad
      ? agruparPrecios(properties.filter((p) => p.SubType === tipo && p.City === ciudad))
      : [];

  const resultadosFiltrados =
    tipo && ciudad && presupuesto
      ? properties.filter((p) => {
          const [min, max] = presupuesto.split("-").map((n) => parseInt(n));
          const precioNum = parseInt(p.Price);
          return p.SubType === tipo && p.City === ciudad && precioNum >= min && precioNum <= max;
        })
      : [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl flex flex-col h-full">
      {paso === 0 && (
        <Filtros
          paso={paso}
          avanzar={avanzar}
          tipo={tipo}
          setTipo={setTipo}
          ciudad={ciudad}
          setCiudad={setCiudad}
          presupuesto={presupuesto}
          setPresupuesto={setPresupuesto}
          tiposUnicos={tiposUnicos}
          ciudadesFiltradas={ciudadesFiltradas}
          rangosDePrecio={rangosDePrecio}
          retroceder={retroceder}
        />
      )}

      {paso === 1 && (
        <Filtros
          paso={paso}
          avanzar={avanzar}
          tipo={tipo}
          setTipo={setTipo}
          ciudad={ciudad}
          setCiudad={setCiudad}
          presupuesto={presupuesto}
          setPresupuesto={setPresupuesto}
          tiposUnicos={tiposUnicos}
          ciudadesFiltradas={ciudadesFiltradas}
          rangosDePrecio={rangosDePrecio}
          retroceder={retroceder}
        />
      )}

      {paso === 2 && (
        <Filtros
          paso={paso}
          avanzar={avanzar}
          tipo={tipo}
          setTipo={setTipo}
          ciudad={ciudad}
          setCiudad={setCiudad}
          presupuesto={presupuesto}
          setPresupuesto={setPresupuesto}
          tiposUnicos={tiposUnicos}
          ciudadesFiltradas={ciudadesFiltradas}
          rangosDePrecio={rangosDePrecio}
          retroceder={retroceder}
        />
      )}

      {paso === 3 && (
        <Resultados
          tipo={tipo}
          ciudad={ciudad}
          presupuesto={presupuesto}
          propiedades={resultadosFiltrados}
          retroceder={retroceder}
        />
      )}

      <Chat
        mensajes={chatMensajes}
        input={inputChat}
        setInput={setInputChat}
        enviar={enviarMensajeChat}
        enviarTexto={enviarMensajeChatConTexto}
        modoConfirmacionCita={modoConfirmacionCita}
      />
    </div>
  );
}
