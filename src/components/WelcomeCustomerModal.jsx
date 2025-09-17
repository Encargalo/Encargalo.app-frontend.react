//ilustrations
import { ilustrations } from "../assets/ilustrations";
//store/hooks
import useOnLoginStore from "../store/onLoginStore";
//react
import { useNavigate } from "react-router-dom";

const WelcomeCustomerModal = () => {
    const navigate = useNavigate()

    const { isWelcomeModalOpen, isAddress, closeWelcomeModal } = useOnLoginStore()


    const handleClose = (e) => {
        e.preventDefault
        closeWelcomeModal()
        location.reload();
    }

    const handleNavigate = () => {
        closeWelcomeModal()
        navigate("/customer_profile/address")
    }

    if (!isWelcomeModalOpen) return null;

    // El estado inicial de isAddress es un objeto `{}`, y se convierte en un array una vez cargado.
    // Verificamos si es un array para determinar si los datos se han cargado y así evitar un parpadeo.
    const isAddressLoaded = Array.isArray(isAddress);

    return (
        <dialog className="fixed inset-0 bg-transparent w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <section className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-8">
                    <figure className="flex flex-col justify-between gap-1 sm:gap-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">¡Bienvenido!</h2>
                        <p className="text-orange-100 sm:text-xl w-full">
                            Pide lo que quieras, cuando quieras
                        </p>
                    </figure>
                </header>

                {/* Solo renderiza el contenido cuando las direcciones se hayan cargado */}
                {isAddressLoaded && (
                    <>
                        {/* Contenido */}
                        <div className="px-6 pt-6 pb-4 text-center text-gray-700 text-lg sm:text-xl font-medium">
                            {isAddress.length > 0 ? (
                                <div>
                                    <p>Haz tus pedidos de comida rápida de forma fácil y rápida.</p>
                                    <p>¡Disfruta de tus comidas favoritos en minutos!</p>
                                </div>
                            ) : (
                                <div>
                                    <p>Para continuar y realizar pedidos, es necesario que agregues una dirección de entrega.</p>
                                </div>
                            )}
                            {/* Imagen / ilustración opcional */}
                            <img
                                src={isAddress.length > 0 ? ilustrations.fastFood1 : ilustrations.Map65}
                                alt="Welcome Illustration"
                                className="size-2/4 sm:size-2/6 mx-auto"
                            />
                        </div>
                        {/* Botón principal */}
                        <div className="px-6 pb-6 w-full flex justify-center">
                            {isAddress.length > 0 ? (
                                <button
                                    onClick={handleClose}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg sm:text-2xl"
                                >
                                    ¡Seguir comprando!
                                </button>
                            ) : (
                                <button
                                    onClick={handleNavigate}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg sm:size-2/4"
                                >
                                    Agregar Dirección
                                </button>
                            )}
                        </div>
                    </>
                )}
            </section>
        </dialog>
    );
};

export default WelcomeCustomerModal;
