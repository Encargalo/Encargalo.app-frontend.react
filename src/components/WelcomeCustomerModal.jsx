import { X } from "lucide-react";

const WelcomeCustomerModal = ({ show, onClose }) => {

    const handleClose = (e) => {
        e.preventDefault
        onClose()
        location.reload();
    }

    /*   if (!show) return null; */

    return (
        <dialog className="fixed inset-0 bg-transparent w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <section className="bg-white rounded-2xl shadow-2xl w-full  sm:w-2/4 overflow-hidden animate-fadeIn">
                {/* Header */}
                <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-7">
                    <figure className="flex flex-col justify-between gap-2">
                        <h2 className="text-5xl font-bold text-white">¡Bienvenido!</h2>
                        <p className="text-orange-100 mt-1 text-xl">
                            Pide lo que quieras, cuando quieras
                        </p>
                    </figure>
                </header>

                {/* Contenido */}
                <div className="px-6 pt-6 pb-4 text-center space-y-4 text-gray-700 text-xl font-medium">
                    <p>
                        Haz tus pedidos de comida rápida de forma fácil y rápida.
                    </p>
                    <p>¡Disfruta de tus comidas favoritos en minutos!</p>

                    {/* Imagen / ilustración opcional */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png"
                        alt="Welcome Illustration"
                        className="w-32 mx-auto"
                    />
                </div>

                {/* Botón principal */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        ¡Seguir comprando!
                    </button>
                </div>
            </section>
        </dialog>
    );
};

export default WelcomeCustomerModal;
