//ilustrations
import { ArrowUpLeft } from "lucide-react";
import { ilustrations } from "../assets/ilustrations";
import { useEffect, useState, useCallback } from "react";

const RequestLocationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [instructions, setInstructions] = useState(null);
    const [platform, setPlatform] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState("prompt");

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
                        <li>La página se recargará automáticamente.</li>
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
                        <li>La página se recargará automáticamente.</li>
                    </ul>
                );
        }
    };

    const checkPermissions = useCallback(async () => {
        const currentPlatform = detectPlatform();
        setPlatform(currentPlatform);
        setInstructions(getInstructions(currentPlatform));

        try {
            if (navigator.permissions) {
                const result = await navigator.permissions.query({ name: "geolocation" });
                setPermissionStatus(result.state);

                // Solo mostrar el modal si el permiso no está concedido
                if (result.state !== "granted") {
                    setIsOpen(true);
                }

                result.onchange = () => {
                    setPermissionStatus(result.state);
                    if (result.state === "granted") {
                        window.location.reload();
                    }
                };
            }
        } catch (error) {
            setIsOpen(true);
        }
    }, []);

    // Verifica el permiso de geolocalización al montar el componente
    // y establece un intervalo para re-verificar si la ubicación se activa.
    useEffect(() => {
        checkPermissions();

        const intervalId = setInterval(() => {
            // Solo re-verificamos si el modal está abierto (es decir, si no tenemos permiso)
            if (isOpen) {
                navigator.geolocation.getCurrentPosition(
                    // Éxito: el usuario activó la ubicación. Recargamos.
                    () => {
                        window.location.reload();
                    },
                    // Error: no hacemos nada, simplemente esperamos al siguiente intervalo.
                    () => { },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            }
        }, 1000); // Re-verifica cada 5 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    }, [checkPermissions, isOpen]);

    if (!isOpen) return null;

    return (
        <dialog
            className="fixed inset-0 bg-gray-500 bg-opacity-80 w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4"
            open
        >
            {
                platform === "android" && permissionStatus === "denied" &&
                <ArrowUpLeft className="bg-orange-600 text-white p-2 w-[40px] h-[40px] rounded-full absolute top-2 left-20 animate-slide-in-top-infinite" />
            }
            <section className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-8">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white">¡Ayúdanos con tu ubicación!</h2>
                </header>

                {/* Contenido */}
                <div className="px-6 pt-6 pb-4 text-center text-gray-700 text-lg sm:text-xl font-medium">
                    {permissionStatus === "denied" ? (
                        <div>
                            <p className="mb-2">Parece que bloqueaste el acceso a tu ubicación.</p>
                            <p className="mb-2">Para continuar, sigue estos pasos:</p>
                            {instructions}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/*    <h3 className="text-2xl font-bold text-orange-600">¡Activa tu ubicación!</h3> */}
                            <p>Para mostrarte los restaurantes cercanos, por favor enciende la ubicación en tu dispositivo.</p>
                            <img
                                src={ilustrations.Map65}
                                alt="Ubicación"
                                className="size-2/4 sm:size-2/6 mx-auto aspect-3/2"
                            />
                            <p className="text-base text-gray-500">Una vez que la actives, la página se recargará automáticamente.</p>
                        </div>
                    )}
                </div>
            </section>
        </dialog>
    );
};

export default RequestLocationModal;