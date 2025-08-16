// Importaciones de librerías y componentes
import { User, Star, Clock } from "lucide-react";
import ItemCard from "./ItemCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import getShopDetails from "../services/getShopDetails";
import FoodDetailsModal from "./FoodDetailsModal";

const ShopMenu = ({ user, isLoggedIn }) => {
  // Estados
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Hooks de Navegación
  const location = useLocation();
  const navigate = useNavigate();

  // Obtiene el identificador de la tienda desde la URL
  const tag_shop = location.pathname.split("/")[1];

  // Se ejecuta al cargar el componente para obtener los datos de la tienda
  useEffect(() => {
    getShopDetails(setShop, setCategories, tag_shop);
  }, [tag_shop]);

  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleComboClick = (item) => {
    setSelectedCombo(item);
  };

  const handleCloseModal = () => {
    setSelectedCombo(null);
  };

  return (
    <section className="min-h-screen bg-white background">
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                ← Volver
              </button>
              <h1 className="text-xl font-bold text-gray-900">{shop.name}</h1>
            </div>

              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  Ruben
                </span>
              </div>
          </div>
        </div>
      </header>

      <main>
        {/* Banner de la tienda con imagen y datos */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={shop.logo_image}
            alt={`Logo de ${shop.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center space-x-4 mb-2">
              {/* Puntuación */}
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-bold text-sm">{shop.score}</span>
              </div>
            </div>
            {/* Dirección de la tienda */}
            <p className="text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {shop.address}
            </p>
          </div>
        </div>

        {/* Filtros de categorías */}
        <nav className="px-4 sm:px-6 lg:px-8 py-4 sticky top-[68px] bg-white z-40">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {/* Botón para mostrar todas las categorías */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todas
            </button>
            {/* Mapeo de los botones de cada categoría */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Lista de productos por categoría */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {categories.map(
            (category) =>
              // Muestra la categoría solo si está seleccionada o si se eligen "Todas"
              (selectedCategory === "all" ||
                selectedCategory === category.id) && (
                <section key={category.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category.name}
                  </h2>
                  {/* Grid de productos */}
                  {category.items && category.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {category.items.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onItemClick={handleComboClick}
                        />
                      ))}
                    </div>
                  ) : (
                    // Mensaje si no hay productos
                    <div className="text-center py-16">
                      <div className="text-gray-400 text-5xl mb-4">🍽️</div>
                      <h3 className="text-xl font-medium text-gray-900">
                        No hay productos disponibles
                      </h3>
                      <p className="text-orange-950">
                        Esta categoría no tiene productos por el momento.
                      </p>
                    </div>
                  )}
                </section>
              )
          )}
        </div>
      </main>
      {selectedCombo && (
        <FoodDetailsModal
          combo={{ ...selectedCombo, shop: shop }}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default ShopMenu;
