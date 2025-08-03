export function agruparPrecios(properties) {
  const precios = properties
    .map((p) => parseInt(p.Price))
    .filter(Boolean)
    .sort((a, b) => a - b);

  const rangos = [];

  for (let i = 0; i < precios.length; i++) {
    const p = precios[i];
    const rangoInferior = Math.floor(p / 1000000) * 1000000;
    const rangoSuperior = rangoInferior + 1000000;
    const etiqueta = `$${rangoInferior / 1000000}M - $${rangoSuperior / 1000000}M`;

    if (!rangos.find((r) => r.etiqueta === etiqueta)) {
      rangos.push({ etiqueta, min: rangoInferior, max: rangoSuperior });
    }
  }

  return rangos;
}

export function detectarNumeroPropiedad(mensaje) {
  const palabrasNumeros = {
    primero: 1,
    primera: 1,
    segundo: 2,
    segunda: 2,
    tercero: 3,
    tercera: 3,
    cuarto: 4,
    cuarta: 4,
    quinto: 5,
    quinta: 5,
    sexto: 6,
    sexta: 6,
    séptimo: 7,
    séptima: 7,
    octavo: 8,
    octava: 8,
    noveno: 9,
    novena: 9,
    décimo: 10,
    décima: 10,
  };

  for (const [palabra, numero] of Object.entries(palabrasNumeros)) {
    if (mensaje.includes(palabra)) return numero;
  }

  const matchNum = mensaje.match(/\b(\d+)\b/);
  if (matchNum) return parseInt(matchNum[1]);

  return null;
}
