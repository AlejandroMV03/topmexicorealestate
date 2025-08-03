import { useEffect, useState } from "react";

export default function SplashScreen({ onReady }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [estadoConexion, setEstadoConexion] = useState("cargando");

  useEffect(() => {
    const handleOnline = () => {
      setEstadoConexion("reconectando");
      setIsOnline(true);
      setTimeout(() => {
        onReady();
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setEstadoConexion("error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setTimeout(() => {
      if (navigator.onLine) {
        onReady();
      } else {
        setEstadoConexion("error");
      }
    }, 2500);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onReady]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden">

      {/* Imagen del logo */}
      <img
        src="/topmexico.png"
        alt="Logo"
        className="w-36 h-36 object-contain mb-10 drop-shadow-xl"
        style={{ imageRendering: "auto" }}
      />

      {/* Barra de carga estética */}
      <div className="w-60 h-3 bg-white/20 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-red-200 to-white animate-[progress_1.5s_linear_infinite]" />
      </div>

      {/* Texto debajo */}
      <p className="mt-5 text-xl font-medium text-center drop-shadow-sm">
        {estadoConexion === "cargando" && "Cargando..."}
        {estadoConexion === "error" && "❌ Error de conexión"}
        {estadoConexion === "reconectando" && "🔄 Reconectando..."}
      </p>

      {/* Animación personalizada en Tailwind */}
      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
