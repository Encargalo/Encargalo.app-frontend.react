//ilustrations
import { ilustrations } from "../assets/ilustrations";
//react
import { useNavigate } from "react-router-dom";

const WelcomeCustomerModal = ({ show, onClose, address }) => {

    const navigate = useNavigate()

    const handleClose = (e) => {
        e.preventDefault
        onClose()
        location.reload();
    }

    const handleNavigate = () => {
        navigate("/customer_profile")
    }

    if (!show) return null;

    return (
        <dialog className="fixed inset-0 bg-transparent w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <section className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-8">
                    <figure className="flex flex-col justify-between gap-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">¡Bienvenido!</h2>
                        <p className="text-orange-100 mt-1 text-xl w-full">
                            Pide lo que quieras, cuando quieras
                        </p>
                    </figure>
                </header>

                {/* Contenido */}
                <div className="px-6 pt-6 pb-4 text-center space-y-2 text-gray-700 text-xl sm:text-2xl font-medium">
                    {
                        address ?
                            <div>
                                <p>
                                    Haz tus pedidos de comida rápida de forma fácil y rápida.
                                </p>
                                <p>¡Disfruta de tus comidas favoritos en minutos!</p>

                            </div>
                            : <div>
                                <p>
                                    Para continuar y realizar pedidos, es necesario que agregues una dirección de entrega.
                                </p>

                            </div>
                    }

                    {/* Imagen / ilustración opcional */}
                    <img
                        src={address ? ilustrations.fastFood1 : ilustrations.Map65}
                        alt="Welcome Illustration"
                        className="size-2/6 mx-auto"
                    />
                </div>

                {/* Botón principal */}
                <div className="px-6 pb-6">

                    {
                        address
                            ? <button
                                onClick={handleClose}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-xl sm:text-2xl"
                            >
                                ¡Seguir comprando!
                            </button>
                            :
                            <button
                                onClick={handleNavigate}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-xl sm:text-2xl"
                            >
                                Agregar Dirección
                            </button>
                    }


                </div>
            </section>
        </dialog>
    );
};

export default WelcomeCustomerModal;
