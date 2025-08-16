import { ShoppingCart, User, Star, Clock } from "lucide-react";
import ItemCard from "./ItemCard";

const ShopMenu = ({
  shop,
  items,
  user,
  isLoggedIn,
  cart,
  addToCart,
  cartTotal,
  onBack,
}) => {
  const shopItems = items.filter(
    (item) => item.shop_id === shop.id && item.is_available
  );

  return (
    <div className="min-h-screen bg-white from-white to-orange-50/30 via-orange-100/50">
      {/* Header del restaurante */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => onBack(null)}
                className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {shop.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 capitalize">
                  {shop.tag}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {cart.length > 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl shadow-lg">
                  <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-1 sm:mr-2" />
                  <span className="font-bold text-sm sm:text-base">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Usuario en vista de restaurante */}
              {isLoggedIn && (
                <div className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-orange-200">
                  <User className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Imagen del restaurante */}
      <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
        <img
          src={shop.logo_image}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-1 sm:mb-2">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-bold text-sm sm:text-base">
                {shop.score}
              </span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
              <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
              <span className="text-sm sm:text-base">{shop.deliveryTime}</span>
            </div>
          </div>
          <p className="text-orange-200 text-sm sm:text-base">{shop.address}</p>
        </div>
      </div>

      {/* Combos disponibles */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
          Combos Disponibles
        </h2>

        {shopItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {shopItems.map((item) => (
              <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4 sm:mb-6">
              🍽️
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2">
              No hay combos disponibles
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Este restaurante no tiene combos disponibles en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMenu;
