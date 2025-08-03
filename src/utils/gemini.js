import axios from "axios";

const API_KEY = "AIzaSyB_5JBQNewWlY5_ShHgX43sZuAmsu556q4";

export async function enviarPreguntaGemini(mensaje, contexto = "") {
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  const body = {
    prompt: {
      text: contexto + "\n\n" + mensaje
    }
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY
  };

  try {
    const response = await axios.post(endpoint, body, { headers });
    const textoRespuesta = response.data.candidates?.[0]?.content?.text;
    return textoRespuesta || "No se pudo obtener respuesta.";
  } catch (error) {
    console.error("Error Gemini:", error.response?.data || error.message);
    return "Error al conectar con Gemini.";
  }
}
