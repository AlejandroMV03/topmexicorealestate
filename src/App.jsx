import { useEffect, useState } from "react";
import { loadProperties } from "./utils/loadXML";
import Chatbot from "./components/Chatbot";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties().then((data) => {
      setProperties(data);
      setLoading(false);  
    });
  }, []);

  if (loading) {
    return <SplashScreen onReady={() => setLoading(false)} />;
  }

  return (
    <>
      {/* pequeño header fijo con su foto y nombre de topmexico real estate */}
      <header className="fixed top-0 left-0 w-full bg-red-700 text-white p-4 shadow-lg flex justify-center items-center z-50">
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

      {/* contenedor del scroll para mantener el cambio o el marco y no ser comido por los footers */}
      <div className="h-screen overflow-y-auto overflow-x-hidden pt-20 pb-40 p-4 red-animated-border">
        <div className="max-w-4xl mx-auto">
          <Chatbot properties={properties} />
        </div>
      </div>

      {/* Footer abajo */}
      <footer className="fixed bottom-0 left-0 w-full bg-red-700 text-white p-4 shadow-lg flex flex-col md:flex-row justify-between items-center text-sm z-50">
        <div className="mb-2 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <img
              src="/top.png"
              alt="Top Mexico Logo"
              className="h-8 w-auto object-contain"
            />
            <p className="font-bold text-lg">Top Mexico Real Estate</p>
          </div>
          <div>
            <p>Calle 78, Entre Av. 10 y Av. 15, Mza. 407 Lote 20, Col. Colosio</p>
            <p>Playa del Carmen, Q. Roo. C.P. 77728</p>
          </div>
        </div>

        <div className="mb-2 md:mb-0 text-center md:text-left">
          <p className="font-bold mb-1">Contact Us</p>
          <p>USA (512) 879-6546</p>
          <p>MX (984) 267-2449</p>

          <button
            onClick={() =>
              window.open(
                "https://www.topmexicorealestate.com/LP-contactus.php",
                "_blank"
              )
            }
            className="mt-2 bg-white text-red-700 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition"
          >
            Contact Us
          </button>
        </div>

        <div>
          <a
            href="https://api.whatsapp.com/send?phone=5219848061713&&text=Hello,%20I%20have%20a%20question..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-full font-semibold flex items-center gap-2"
          >
            <img src="/ww.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
            WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
