import { useEffect, useState } from "react";
import { loadProperties } from "./utils/loadXML";
import Chatbot from "./components/Chatbot";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [datosCargados, setDatosCargados] = useState(false);

  // Detecta conexión/desconexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Carga propiedades (simula XML)
  useEffect(() => {
    loadProperties()
      .then((data) => {
        setProperties(data);
        setDatosCargados(true);
      })
      .catch((error) => {
        console.error("Error al cargar propiedades:", error);
        setDatosCargados(false);
      });
  }, []);

  if (loading) {
    return (
      <SplashScreen
        isOnline={isOnline}
        datosCargados={datosCargados}
        onReady={() => setLoading(false)}
      />
    );
  }

  return (
    <>
      {/* ... tu header, main y footer igual que antes */}
      <header
        className="fixed top-0 left-0 w-full bg-red-700 text-white p-4 shadow-lg flex justify-center items-center z-50"
        style={{ height: "4rem" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/top.png"
            alt="Top Mexico Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold">
            TopMexico Real Estate
          </h1>
        </div>
      </header>

      <main
        className="flex flex-col"
        style={{ height: "100vh", paddingTop: "4rem", paddingBottom: "7rem" }}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 red-animated-border">
          <div className="max-w-4xl mx-auto h-full">
            <Chatbot properties={properties} />
          </div>
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-0 w-full bg-red-700 text-white p-4 shadow-lg flex flex-wrap md:flex-nowrap justify-between items-center gap-4 text-sm z-50"
        style={{ height: "7rem" }}
      >
        {/* ... footer igual que antes */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1 min-w-[200px]">
          <img
            src="/top.png"
            alt="Top Mexico Logo"
            className="h-8 w-auto object-contain"
          />
          <p className="font-bold text-lg md:text-xl">Top Mexico Real Estate</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1 min-w-[180px] text-center md:text-left">
          <div>
            <p>
              Calle 78, Entre Av. 10 y Av. 15, Mza. 407 Lote 20, Col. Colosio
            </p>
            <p>Playa del Carmen, Q. Roo. C.P. 77728</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-[160px] text-center md:text-left">
          <div>
            <p className="font-bold mb-1">Contact Us</p>
            <p>USA (512) 879-6546</p>
            <p>MX (984) 267-2449</p>
          </div>
          <button
            onClick={() =>
              window.open(
                "https://www.topmexicorealestate.com/LP-contactus.php",
                "_blank"
              )
            }
            className="mt-2 md:mt-0 bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
          >
            Contact Us
          </button>
        </div>

        <div className="flex items-center">
          <a
            href="https://api.whatsapp.com/send?phone=5219848061713&&text=Hello,%20I%20have%20a%20question..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-full font-semibold flex items-center gap-2"
          >
            <img
              src="/ww.png"
              alt="WhatsApp"
              className="h-5 w-5 object-contain"
            />
            WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
