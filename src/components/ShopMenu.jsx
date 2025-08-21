//lucide react
import { User, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
//components
import ItemCard from "./ItemCard";
import FoodDetailsModal from "./FoodDetailsModal";
import Loader from "./Loader";
//services
import getShopDetails from "../services/getShopDetails";
//react
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getDecryptedItem } from "../utils/encryptionUtilities";

const ShopMenu = () => {
  // Estados
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const carouselRef = useRef(null);
  const [userData, setUserData] = useState({})


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

  //Carousel filtering
  const scrollCarouselFiltering = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        carouselRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  //user data
  useEffect(() => {
    const user_session = 'user_session';
    const user_data = getDecryptedItem(user_session)
    setUserData(user_data)
  }, [])

  return (
    <div>
      <section className="min-h-screen bg-white background">
        {/* header */}
        <header className="bg-white shadow-lg sticky top-0 z-40 border-b">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* return */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/")}
                  className="text-orange-500 hover:text-orange-600 font-semibold sm:text-2xl"
                >
                  ← Volver
                </button>
                <h1 className="hidden sm:block text-2xl font-bold text-gray-900">{shop.name}</h1>
              </div>

              {/* user */}
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                <User className="w-5 h-5 text-orange-600" />
                <span className="text-base sm:text-xl font-medium text-gray-700">{
                  userData.data?.name
                }</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* banner shop*/}
          <div className="relative sm:h-[40em] overflow-hidden">
            <img
              src={shop.logo_image}
              alt={`Logo de ${shop.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-3 sm:left-6 text-white px-2">
              <div className="flex items-center space-x-4 mb-2">
                {/* score */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full">
                  <Star className="w-4 h-4 sm:w-7 sm:h-7 text-yellow-400 fill-current mr-2" />
                  <span className="font-bold sm:text-2xl">{shop.score}</span>
                </div>
              </div>
              {/* address shop */}
              <p className="text-white bg-white/20 sm:text-2xl backdrop-blur-sm px-3 py-1 rounded-full">
                {shop.address}
              </p>
            </div>
          </div>

          {/* filtering categories */}
          <nav className="sm:px-6 lg:px-8 py-7 sticky top-[68px] bg-white z-30">
            {/* button move carousel filtering */}
            <button
              onClick={() => scrollCarouselFiltering("left")}
              className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg absolute left-2 z-30 bottom-7 sm:left-4"
            >
              <ChevronLeft className="w-8 sm:w-5 h-8 sm:h-5 text-gray-600 hover:text-orange-600" />
            </button>

            {/* buttons actions */}
            <div className="relative flex space-x-2 overflow-x-auto px-12"
              ref={carouselRef}>
              {/* button all categories */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 text-lg font-medium rounded-full transition-colors ${selectedCategory === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Todas
              </button>

              {/* map buttons categories */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-xl font-medium rounded-full transition-colors whitespace-nowrap ${selectedCategory === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {category.name}
                </button>
              ))}

            </div>
            {/* button move carousel filtering */}
            <button
              onClick={() => scrollCarouselFiltering("right")}
              className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg absolute top-6 right-2 sm:right-4"
            >
              <ChevronRight className="w-8 sm:w-6 h-8 sm:h-6 text-gray-600 hover:text-orange-600" />
            </button>
          </nav>

          {/* list categories*/}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-5">
            {categories.map(
              (category) =>
                // Muestra la categoría solo si está seleccionada o si se eligen "Todas"
                (selectedCategory === "all" ||
                  selectedCategory === category.id) && (
                  <section key={category.id} className="mb-8">
                    {/* name category */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-5 mt-10">
                      {category.name}
                    </h2>

                    {/* products */}
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
                      // mmessage not products
                      <div className="text-center py-16">
                        <div className="text-gray-400 text-7xl sm:text-9xl mb-4">🍽️</div>
                        <h3 className="text-2xl sm:text-4xl mb-3 font-medium text-gray-900">
                          No hay productos disponibles
                        </h3>
                        <p className="text-orange-950 text-xl sm:text-2xl">
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
    </div>
  );
};

export default ShopMenu;
