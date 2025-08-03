
import { XMLParser } from "fast-xml-parser";

export async function loadProperties() {
  try {
    const response = await fetch("/data/exampleFeed.xml");
    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xmlText);
    const adverts = result.Adverts?.Advert;
    if (!adverts) return [];

    return Array.isArray(adverts) ? adverts : [adverts];
  } catch (error) {
    console.error("Error al cargar el archivo XML:", error);
    return [];
  }
}
