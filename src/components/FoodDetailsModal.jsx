//lucide-react
import { X, Star, MapPin } from "lucide-react";
//react router dom
import { useNavigate } from "react-router-dom";

const FoodDetailsModal = ({ combo, onClose }) => {
  if (!combo) return null;

  const navigate = useNavigate();

  return (
    <dialog
      className="fixed w-full h-full inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <aside
        className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-2xl mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <header className="relative">
          {/* img */}
          <img
            src={combo.image}
            alt={combo.name}
            className="w-full h-64 object-cover"
          />

          {/* close modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </header>

        {/* combo details */}
        <figure className="p-6">
          <div className="flex flex-col justify-between items-start  mb-4 gap-3">
            <div className="w-full flex justify-between items-center flex-wrap gap-2 lg:gap-9">
              {/* name combo */}
              <h2 className="text-3xl font-bold text-gray-900">{combo.name}</h2>
              {/* price combo */}
              <h4 className="text-4xl font-extrabold text-orange-600">
                ${combo.price.toLocaleString()}
              </h4>
            </div>
            {/* description combo */}
            <p className="text-lg text-gray-600 mt-1">{combo.description}</p>
          </div>

          {/* shop details  */}
          <figure className="border-t border-b border-gray-200 py-4 my-4">
            {/* shop name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Vendido por:
            </h3>

            {/* shop details */}
            <div className="flex items-center">
              {/* shop img */}
              <img
                src={combo.shop.logo_image}
                alt={`${combo.shop.name} logo`}
                className="w-16 h-16 rounded-full border-2 object-cover border-gray-200"
              />

              {/* shop info */}
              <div className="ml-4">
                {/* shop name */}
                <p className="text-lg font-bold text-gray-900">
                  {combo.shop.name}
                </p>
                {/* shop address */}
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <p className="text-sm">{combo.shop.address}</p>
                </div>

                {/* shop score */}
                <div className="flex items-center text-orange-500 mt-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1 font-bold">{combo.shop.score}</span>
                </div>
              </div>
            </div>
          </figure>

          {/* footer */}
          <footer className="mt-6 flex justify-between items-center">
            {/* close modal */}

            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              onClick={() => navigate(`/${combo.shop.tag}`)}
            >
              Ir a la tienda
            </button>
            <div>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg mr-4 transition-colors"
              >
                Cerrar
              </button>

              {/* add to cart */}
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Agregar al Carrito
              </button>
            </div>
          </footer>
        </figure>
      </aside>
    </dialog>
  );
};

export default FoodDetailsModal;
