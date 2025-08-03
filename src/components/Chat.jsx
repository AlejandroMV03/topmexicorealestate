export default function Chat({
  mensajes,
  input,
  setInput,
  enviar,
  enviarTexto,
  modoConfirmacionCita,
}) {
  return (
    <>
      {/* El chat de prueba que aun no acabo de desarrollar */}
      <div className="mt-8 flex flex-col bg-white rounded-xl shadow-md p-4 max-h-[320px] overflow-y-auto">
        {mensajes.map((msg, i) => {
          const isBot = msg.sender === "bot";
          const isUser = msg.sender === "user";

          if (msg.tipo === "propiedades") {
            return (
              <div key={i} className="mb-4">
                <p className="font-semibold text-gray-800 mb-2">{msg.text}</p>
                <div className="flex flex-col gap-4">
                  {msg.propiedades.map((p, idx) => (
                    <div
                      key={idx}
                      className="border rounded-xl p-4 bg-gray-50 cursor-pointer hover:shadow-lg transition"
                      onClick={() => {
                        const respuesta = `Quiero la propiedad número ${idx + 1}`;
                        setInput(respuesta);
                        enviarTexto(respuesta);
                      }}
                    >
                      <p className="font-semibold text-gray-800">{p.titulo}</p>
                      <p className="text-sm text-gray-600">
                        {p.ciudad} — ${p.precio} {p.moneda}
                      </p>
                      {p.foto && (
                        <img
                          src={p.foto}
                          alt="Propiedad"
                          className="w-full max-w-xs mt-2 rounded shadow"
                        />
                      )}
                      <a
                        href={p.urlWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-green-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Contactar por WhatsApp
                      </a>
                    </div>
                  ))}
                  {msg.total > 3 && (
                    <p className="italic text-gray-600">Y más propiedades disponibles...</p>
                  )}
                </div>
              </div>
            );
          }

          if (msg.tipo === "propiedadSeleccionada") {
            const p = msg.propiedad;
            return (
              <div
                key={i}
                className="mb-4 border rounded-xl p-4 bg-yellow-100 shadow-md max-w-md"
                style={{ alignSelf: "flex-start" }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <img src="/top.png" alt="Bot Avatar" className="w-10 h-10 rounded-full" />
                  <p className="font-semibold text-gray-800">Top Mexico Real Estate</p>
                </div>
                <p className="font-semibold text-gray-900 mb-1">{p.titulo}</p>
                <p className="text-sm text-gray-700">
                  {p.ciudad} — ${p.precio} {p.moneda}
                </p>
                {p.foto && (
                  <img
                    src={p.foto}
                    alt="Propiedad"
                    className="w-full max-w-xs mt-2 rounded shadow"
                  />
                )}
                <a
                  href={p.urlWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all duration-300"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            );
          }

          return (
            <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
              {isBot && (
                <img src="/top.png" alt="Bot Avatar" className="w-8 h-8 rounded-full mr-2" />
              )}
              <p
                className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                  isBot ? "bg-gray-200 text-gray-800" : "bg-red-500 text-white text-right"
                }`}
              >
                {msg.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Botones para confirmar */}
      {modoConfirmacionCita && (
        <div className="mt-4 flex gap-3 justify-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => {
              setInput("Agendar cita");
              enviarTexto("Agendar cita");
            }}
          >
            Agendar cita
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => {
              setInput("Contactar por WhatsApp");
              enviarTexto("Contactar por WhatsApp");
            }}
          >
            Contactar WhatsApp
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={() => {
              setInput("No");
              enviarTexto("No");
            }}
          >
            Ninguno
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          placeholder="Escribe aquí..."
          className="flex-grow border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={modoConfirmacionCita}
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-6 rounded hover:bg-red-600 transition"
          disabled={modoConfirmacionCita}
        >
          Enviar
        </button>
      </form>
    </>
  );
}
