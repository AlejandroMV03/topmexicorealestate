export default function Resultados({ tipo, ciudad, presupuesto, propiedades, retroceder }) {
  const resumenPresupuesto = (() => {
    if (!presupuesto) return "";
    const [min, max] = presupuesto.split("-").map((n) => parseInt(n));
    return `$${min / 1_000_000}M - $${max / 1_000_000}M`;
  })();

  return (
    <>
      <p className="font-semibold text-2xl text-gray-800 mb-4 border-l-4 pl-3 border-green-500">
        Propiedades encontradas
      </p>

      <div className="mb-4 p-4 bg-green-100 rounded-lg shadow-sm text-green-900">
        <p><strong>Tipo:</strong> {tipo}</p>
        <p><strong>Ciudad:</strong> {ciudad}</p>
        <p><strong>Presupuesto:</strong> {resumenPresupuesto}</p>
      </div>

      {propiedades.length === 0 ? (
        <p className="text-red-600 mt-2">No se encontraron propiedades 😢</p>
      ) : (
        propiedades.map((p, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 mt-4 bg-white shadow hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-800">{p.Titles?.Title?.[0]?._}</p>
            <p className="text-sm text-gray-600">
              Precio: ${p.Price} {p.PriceCurrency}
            </p>
            <p className="text-sm text-gray-600">Ciudad: {p.City}</p>
            {p.Photos?.Photo?.[0] && (
              <img
                src={p.Photos.Photo[0]}
                alt="Propiedad"
                className="w-full max-w-xs mt-2 rounded shadow"
              />
            )}
            <a
              href={`https://wa.me/5219842672449?text=Hola,%20me%20interesa%20esta%20propiedad:%20${encodeURIComponent(
                p.Titles?.Title?.[0]?._ || ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all duration-300"
            >
              Agendar cita por WhatsApp
            </a>
          </div>
        ))
      )}

      <button
        onClick={retroceder}
        className="mt-6 text-sm text-blue-600 underline hover:text-blue-800"
      >
        ← Volver
      </button>
    </>
  );
}
