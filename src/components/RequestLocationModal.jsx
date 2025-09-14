//ilustrations
import { ArrowUpLeft } from "lucide-react";
import { ilustrations } from "../assets/ilustrations";
import { useEffect, useState } from "react";
import { setEncryptedItem, getDecryptedItem } from "../utils/encryptionUtilities"; // <-- Importa utilidades

const VITE_REQUEST_LOCATION = import.meta.env.VITE_REQUEST_LOCATION;

const RequestLocationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDenied, setIsDenied] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [platform, setPlatform] = useState("");
    const [isGranted, setIsGranted] = useState(false);

    // Detectar tipo de dispositivo/navegador
    const detectPlatform = () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/android/.test(ua)) return "android";
        if (/iphone|ipad|ipod/.test(ua)) return "ios";
        return "desktop";
    };

    // Generar instrucciones específicas
    const getInstructions = (platform) => {
        switch (platform) {
            case "android":
                return (
                    <ul className="list-disc list-inside text-left mt-3 space-y-1 text-base sm:text-lg">
                        <li>Haz clic en el icono que indica la flecha</li>
                        <li>Entra en permisos</li>
                        <li>Permite la ubicación</li>
                        <li>Recarga la página</li>
                    </ul>
                );
            case "ios":
                return (
                    <ul className="list-disc list-inside text-left mt-3 space-y-1 text-base sm:text-lg">
                        <li>Abre la app de <strong>Configuración</strong> en tu iPhone/iPad.</li>
                        <li>Desplázate hasta <strong>Safari</strong> o <strong>Chrome</strong>.</li>
                        <li>Entra en <strong>Ubicación</strong>.</li>
                        <li>Selecciona <strong>“Mientras se usa la app”</strong> o <strong>“Preguntar”</strong>.</li>
                        <li>Regresa al navegador y recarga la página.</li>
                    </ul>
                );
            default: // desktop
                return (
                    <ul className="list-disc list-inside text-left mt-3 space-y-1 text-base sm:text-lg">
                        <li>Haz clic en el <strong>icono de información ℹ️</strong> en la barra de direcciones.</li>
                        <li>Busca la opción <strong>Ubicación</strong>.</li>
                        <li>Cámbala a <strong>Permitir</strong>.</li>
                        <li>Recarga la página.</li>
                    </ul>
                );
        }
    };

    // Verifica el permiso de geolocalización al montar el componente
    useEffect(() => {
        const platform = detectPlatform();
        setPlatform(platform);
        setInstructions(getInstructions(platform));

        // Verifica si ya se mostró el agradecimiento
        const thanked = getDecryptedItem(VITE_REQUEST_LOCATION) === true;
        if (thanked) {
            setIsOpen(false);
            return;
        }

        if (navigator.permissions) {
            navigator.permissions.query({ name: "geolocation" }).then((result) => {
                if (result.state === "granted") {
                    setIsGranted(true);
                    setIsOpen(true);
                } else if (result.state === "denied") {
                    setIsDenied(true);
                    setIsOpen(true);
                } else {
                    setIsOpen(true);
                }

                result.onchange = () => {
                    if (result.state === "granted") {
                        setIsGranted(true);
                        setIsDenied(false);
                        setIsOpen(true);
                    } else if (result.state === "denied") {
                        setIsGranted(false);
                        setIsDenied(true);
                        setIsOpen(true);
                    }
                };
            });
        } else {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        // Si ya se agradeció y permisos concedidos, guarda en localStorage encriptado
        if (isGranted) {
            setEncryptedItem(VITE_REQUEST_LOCATION, true);
        }
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <dialog
            className="fixed inset-0 bg-gray-500 bg-opacity-80 w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4"
            open
        >
            {
                platform === "android" && !isGranted &&
                <ArrowUpLeft className="bg-orange-600 text-white p-2 w-[40px] h-[40px] rounded-full absolute top-2 left-20 animate-slide-in-top-infinite" />
            }
            <section className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-8">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white">
                        ¡Ayúdanos con tu ubicación!
                    </h2>
                </header>

                {/* Contenido */}
                <div className="px-6 pt-6 pb-4 text-center text-gray-700 text-lg sm:text-xl font-medium">
                    {isGranted ? (
                        <div>
                            <p className="mb-2">✅ ¡Gracias por permitir el acceso a tu ubicación!</p>
                            <p className="mb-2">Ya puedes cerrar este mensaje y continuar usando la aplicación.</p>
                        </div>
                    ) : isDenied ? (
                        <div>
                            <p className="mb-2">🚫 Parece que bloqueaste el acceso a tu ubicación.</p>
                            <p className="mb-2">Para continuar, sigue estos pasos:</p>
                            {instructions}
                        </div>
                    ) : (
                        <div>
                            <p>Para ofrecerte un mejor servicio, necesitamos tu ubicación exacta.</p>
                            <p>¡Así los repartidores llegarán sin problemas y más rápido!</p>
                            <img
                                src={ilustrations.Map65}
                                alt="Ubicación"
                                className="size-2/4 sm:size-2/6 mx-auto aspect-3/2"
                            />
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="px-6 pb-6 w-full flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all duration-300 shadow text-base sm:text-lg"
                    >
                        Cerrar
                    </button>
                </div>
            </section>
        </dialog>
    );
};

export default RequestLocationModal;
