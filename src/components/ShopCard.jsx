//lucide-react
import { MapPin, Star, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShopCard = ({ shop, favorites, onToggleFavorite }) => {
  /* type restaurant */
  const typeRestaurat = {
    restaurant: "Restaurante",
  };

  /* navigate */
  const navigate = useNavigate();

  return (
    <section
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
      onClick={() => navigate(`/${shop.tag}`)}
    >
      {/* header */}
      <header className="relative">
        {/* img */}

        <div className="w-full h-[180px] flex justify-center overflow-hidden">
          <img
            src={shop.logo}
            alt={shop.name}
            className="w-full h-[300px] object-cover  group-hover:scale-105 transition-transform duration-300"
          />

        </div>

        {/* heart */}
        {/*  <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(shop.id);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-6 h-6 sm:w-4 sm:h-4 ${favorites.has(shop.id)
              ? "fill-orange-500 text-orange-500"
              : "text-gray-600"
              }`}
          />
        </button> */}

        {/* shop status */}
        {!shop.opened && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm sm:text-lg font-semibold">
              Cerrado
            </span>
          </div>
        )}
        {shop.opened && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm sm:text-lg font-medium">
              Abierto
            </span>
          </div>
        )}
      </header>

      {/* shop details */}
      <div className="p-4">
        {/* shop name */}
        <figure className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex-1">
            {shop.name}
          </h3>
          {/* shop score */}
          <div className="flex items-center bg-gradient-to-r from-orange-100 to-orange-50 px-2 sm:px-3 py-1 rounded-full border border-orange-200 ml-2">
            <Star className="size-4 sm:size-5 text-orange-500 fill-current mr-1" />
            <span className="sm:text-xl font-bold text-gray-900">
              {parseFloat(shop.score.toFixed(1))}
            </span>
          </div>
        </figure>

        {/* shop type */}
        <p className="text-lg sm:text-xl text-gray-600 mb-2 sm:mb-3 capitalize font-medium">
          {typeRestaurat[shop.type]}
        </p>

        {/* footer */}
        {/* shop address */}
        <footer className="flex items-center text-lg sm:text-xl text-gray-500 mb-3">
          <MapPin className="size-6 sm:size-8 mr-1 sm:mr-2 text-orange-500" />
          <span className="truncate">{shop.address}</span>
        </footer>
      </div>
    </section>
  );
};

export default ShopCard;
