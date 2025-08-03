export default function Filtro({
  paso,
  avanzar,
  retroceder,
  tipo,
  ciudad,
  presupuesto,
  tiposUnicos,
  ciudadesFiltradas,
  rangosDePrecio,
  setTipo,
  setCiudad,
  setPresupuesto,
}) {
  if (paso === 0) {
    return (
      <>
        <p className="font-semibold text-2xl text-gray-800 mb-4 border-l-4 pl-3 border-red-400">
          ¿Qué tipo de propiedad buscas?
        </p>
        <div className="flex flex-wrap gap-3">
          {tiposUnicos.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setTipo(t);
                setCiudad("");
                setPresupuesto("");
                avanzar();
              }}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            >
              {t}
            </button>
          ))}
        </div>
      </>
    );
  }

  if (paso === 1) {
    return (
      <>
        <p className="font-semibold text-2xl text-gray-800 mb-4 border-l-4 pl-3 border-blue-400">
          ¿En qué ciudad?
        </p>
        <div className="flex flex-wrap gap-3">
          {ciudadesFiltradas.length > 0 ? (
            ciudadesFiltradas.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setCiudad(c);
                  setPresupuesto("");
                  avanzar();
                }}
                className="bg-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              >
                {c}
              </button>
            ))
          ) : (
            <p className="text-gray-600">No hay ciudades disponibles para este tipo.</p>
          )}
        </div>
        <button
          onClick={retroceder}
          className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
        >
          ← Volver
        </button>
      </>
    );
  }

  if (paso === 2) {
    return (
      <>
        <p className="font-semibold text-2xl text-gray-800 mb-4 border-l-4 pl-3 border-gray-500">
          ¿Cuál es tu presupuesto?
        </p>
        <div className="flex flex-wrap gap-3">
          {rangosDePrecio.length > 0 ? (
            rangosDePrecio.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setPresupuesto(`${r.min}-${r.max}`);
                  avanzar();
                }}
                className="bg-gray-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              >
                {r.etiqueta}
              </button>
            ))
          ) : (
            <p className="text-gray-600">No hay propiedades disponibles en este rango.</p>
          )}
        </div>
        <button
          onClick={retroceder}
          className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
        >
          ← Volver
        </button>
      </>
    );
  }

  return null;
}
