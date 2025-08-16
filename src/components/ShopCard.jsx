import { MapPin, Star, Clock, Heart } from "lucide-react";

const ShopCard = ({ shop, favorites, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100">
      <div className="relative">
        <img
          src={shop.logo_image}
          alt={shop.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(shop.id);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-4 h-4 ${
              favorites.has(shop.id)
                ? "fill-orange-500 text-orange-500"
                : "text-gray-600"
            }`}
          />
        </button>
        {!shop.opened && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Cerrado
            </span>
          </div>
        )}
        {shop.opened && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Abierto
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex-1">
            {shop.name}
          </h3>
          <div className="flex items-center bg-gradient-to-r from-orange-100 to-orange-50 px-2 sm:px-3 py-1 rounded-full border border-orange-200 ml-2">
            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1" />
            <span className="text-xs sm:text-sm font-bold text-gray-900">
              {shop.score}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2 sm:mb-3 capitalize font-medium">
          {shop.tag}
        </p>

        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-orange-500" />
          <span className="truncate">{shop.address}</span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center text-gray-700">
            <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-orange-500" />
            <span className="font-medium">{shop.deliveryTime}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">Mín: {shop.minOrder}</div>
            <div
              className={`font-bold ${
                shop.deliveryFee === "Gratis"
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
            >
              {shop.deliveryFee === "Gratis"
                ? "Envío gratis"
                : `Envío ${shop.deliveryFee}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
