//ilustrations
import { ArrowUpLeft } from "lucide-react";
import { ilustrations } from "../assets/ilustrations";
import { useEffect, useState } from "react";
import { setEncryptedItem, getDecryptedItem } from "../utils/encryptionUtilities";

const VITE_REQUEST_LOCATION = import.meta.env.VITE_REQUEST_LOCATION;

const RequestLocationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [platform, setPlatform] = useState("");
    const [permissionStatus, setPermissionStatus] = useState("prompt");
    const [showRefreshMessage, setShowRefreshMessage] = useState(false);

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

        const checkPermissions = async () => {
            try {
                if (navigator.permissions) {
                    const result = await navigator.permissions.query({ name: "geolocation" });
                    setPermissionStatus(result.state);

                    // Verificar si los permisos están concedidos
                    if (result.state === "granted") {
                        const hasRefreshed = getDecryptedItem(VITE_REQUEST_LOCATION) === true;
                        if (hasRefreshed) {
                            setIsOpen(false);
                            setShowRefreshMessage(false);
                        } else {
                            setShowRefreshMessage(true);
                        }
                    } else {
                        setIsOpen(true);
                        setShowRefreshMessage(false);
                    }

                    result.onchange = () => {
                        setPermissionStatus(result.state);
                        if (result.state === "granted") {
                            const hasRefreshed = getDecryptedItem(VITE_REQUEST_LOCATION) === true;
                            if (hasRefreshed) {
                                setIsOpen(false);
                                setShowRefreshMessage(false);
                            } else {
                                setShowRefreshMessage(true);
                            }
                        } else {
                            setIsOpen(true);
                            setShowRefreshMessage(false);
                            setEncryptedItem(VITE_REQUEST_LOCATION, false);
                        }
                    };
                }
            } catch (error) {
                setIsOpen(true);
            }
        };

        checkPermissions();
        const intervalId = setInterval(checkPermissions, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = () => {
        setEncryptedItem(VITE_REQUEST_LOCATION, true);
        window.location.reload();
    };

    if (!isOpen && !showRefreshMessage) return null;

    return (
        <dialog
            className="fixed inset-0 bg-gray-500 bg-opacity-80 w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4"
            open
        >
            {
                platform === "android" && permissionStatus !== "granted" &&
                <ArrowUpLeft className="bg-orange-600 text-white p-2 w-[40px] h-[40px] rounded-full absolute top-2 left-20 animate-slide-in-top-infinite" />
            }
            <section className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-8">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white">
                        {showRefreshMessage
                            ? "¡Listo! Ya puedes refrescar la página"
                            : "¡Ayúdanos con tu ubicación!"}
                    </h2>
                </header>

                {/* Contenido */}
                <div className="px-6 pt-6 pb-4 text-center text-gray-700 text-lg sm:text-xl font-medium">
                    {showRefreshMessage ? (
                        <div className="flex flex-col items-center gap-4">
                            <p className="mb-2">¡Gracias por permitir el acceso a tu ubicación!</p>
                            <p className="mb-4">Para que los cambios surtan efecto, necesitas refrescar la página.</p>
                            <button
                                onClick={handleRefresh}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Refrescar página
                            </button>
                        </div>
                    ) : permissionStatus === "denied" ? (
                        <div>
                            <p className="mb-2">Parece que bloqueaste el acceso a tu ubicación.</p>
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
            </section>
        </dialog>
    );
};

export default RequestLocationModal;