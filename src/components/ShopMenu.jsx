//lucide react / icons
import { Star, ChevronLeft, ChevronRight, Plus, ArrowLeft } from "lucide-react";
//components
import ItemCard from "./ItemCard";
import FoodDetailsModal from "./FoodDetailsModal";
import SessionModal from "./SessionCustomer/SessionModal";
import WelcomeCustomerModal from "./WelcomeCustomerModal";
import UserMenu from "./UserMenu";
//store/hooks
import useCartStore from "../store/cartStore";
import useNumberFormat from "../hooks/useNumberFormat";
import useOnLoginStore from "../store/onLoginStore";
//services
import getShopDetails from "../services/getShopDetails";
//utils
import { getDecryptedItem } from "../utils/encryptionUtilities";
//react
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ShopMenu = () => {
  // Estados
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const carouselRef = useRef(null);
  const [userData, setUserData] = useState({})

  //onLogin
  const { openLoginModal } = useOnLoginStore()

  /* prev cart items */
  const { cart } = useCartStore();
  const { formatNumber } = useNumberFormat();
  const shopCartItems = cart.filter(item => item.shopInfo?.id === shop.id);

  const shopTotal = shopCartItems.reduce((sum, item) => {
    const isMultiSelect = item.rules?.some(r => r.rule_key === 'max_flavors' && r.selector_type === 'multi_select');
    const flavorCount = item.flavors?.reduce((sum, f) => sum + (f.quantity || 1), 0) || 0;
    const quantity = isMultiSelect && flavorCount > 0 ? flavorCount : item.quantity || 1;

    const additionalsPricePerUnit = (item.additionals || []).reduce((addSum, additional) => addSum + (additional.price || 0), 0);

    const subtotal = isMultiSelect
      ? (item.price * quantity) + additionalsPricePerUnit
      : (item.price + additionalsPricePerUnit) * quantity;
    return sum + subtotal;
  }, 0);

  const totalItems = shopCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Hooks de Navegación
  const location = useLocation();
  const navigate = useNavigate();

  // Obtiene el identificador de la tienda desde la URL
  const tag_shop = location.pathname.split("/")[1];

  // Se ejecuta al cargar el componente para obtener los datos de la tienda
  useEffect(() => {
    getShopDetails(setShop, setCategories, tag_shop);
  }, [tag_shop]);

  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodClick = (item) => {
    setSelectedFood(item);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
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
    const user_session = import.meta.env.VITE_USER_SESSION
    const user_data = getDecryptedItem(user_session)
    setUserData(user_data)
  }, [])

  // Filtrar categorías que sí tienen productos
  const validCategories = categories.filter(
    (category) => Array.isArray(category.items) && category.items.length > 0
  );

  return (
    <div className="min-h-dvh w-full background">
      <section className="w-full">
        {/* header */}
        <header className="bg-white shadow-lg sticky top-0 z-40 border-b">
          <div className="w-full px-3 sm:px-4 lg:px-7 py-3">
            <div className="flex items-center justify-between">
              {/* return */}
              <div className="flex items-center"
                onClick={() => navigate("/")}
              >
                <button
                  className="text-orange-500 hover:text-orange-600 font-semibold text-lg sm:text-xl py-2 px-4 flex items-center gap-2 rounded-lg"
                >
                  <ArrowLeft className="size-5" />
                  Volver
                </button>
              </div>
              {
                userData?.session ?
                  <UserMenu userData={userData} handleNavigate={navigate} />
                  :
                  /* login */
                  <button
                    onClick={openLoginModal}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:text-2xl"
                  >
                    Iniciar Sesión
                  </button>
              }


            </div>
          </div>
        </header>

        <main className="pb-14">
          {/* banner shop*/}
          <div className="relative sm:h-[40em] overflow-hidden">
            <img
              src={shop.banner}
              alt={`Logo de ${shop.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-3 sm:left-6 text-white px-2">
              <div className="flex items-center space-x-4 mb-2">
                {/* score */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="size-3 sm:size-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-bold text-xs sm:text-xl">{shop.score}</span>
                </div>
              </div>
              {/* address shop */}
              <p className="text-white bg-white/20 sm:text-xl text-sm backdrop-blur-sm px-3 py-1 rounded-full">
                {shop.address}
              </p>
            </div>
          </div>

          {/* filtering categories */}
          {validCategories.length > 0 && (
            <nav className="py-4 sticky top-[68px] bg-white z-30">
              {/* button move carousel filtering */}
              <button
                onClick={() => scrollCarouselFiltering("left")}
                className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg absolute left-2 z-30 top-4 sm:left-3"
              >
                <ChevronLeft className="size-5 text-gray-600 hover:text-orange-600" />
              </button>

              {/* buttons actions */}
              <div className="relative flex space-x-2 overflow-x-auto px-12 sm:px-16 no-scrollbar"
                ref={carouselRef}>
                {/* button all categories */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 sm:text-lg font-medium rounded-full transition-colors ${selectedCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Todas
                </button>

                {/* map buttons categories */}
                {validCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 sm:text-lg font-medium rounded-full transition-colors whitespace-nowrap ${selectedCategory === category.id
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
                className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg absolute top-4 right-2 sm:right-4"
              >
                <ChevronRight className="size-5 text-gray-600 hover:text-orange-600" />
              </button>
            </nav>
          )}

          {/* list categories*/}
          <div className="w-full px-3 pb-12 sm:px-6 lg:px-8">
            {validCategories.map(
              (category) =>
                // Muestra la categoría solo si está seleccionada o si se eligen "Todas"
                (selectedCategory === "all" ||
                  selectedCategory === category.id) && (
                  <section key={category.id} className="mb-8">
                    {/* name category */}
                    <h2 className="text-3xl font-bold text-white mb-4 mt-10">
                      {category.name}
                    </h2>

                    {/* products */}
                    {category.items && category.items.length > 0 ? (
                      <>
                        {/* Vista en GRID → solo en sm en adelante */}
                        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {category.items.map((item) => (
                            <ItemCard
                              key={item.id}
                              item={item}
                              onItemClick={handleFoodClick}
                            />
                          ))}
                        </div>

                        {/* Vista en LISTA → solo en móviles */}
                        <ul className="flex flex-col gap-y-3 sm:hidden">
                          {category.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex gap-2 p-3 bg-white rounded-xl shadow relative h-1/3"
                              onClick={() => handleFoodClick(item)}
                            >
                              {/* info */}
                              <article className="flex-1 flex flex-col justify-between gap-2">
                                <div className="space-y-1">
                                  {/* name */}
                                  <h3 className="text-lg font-semibold">{item.name}</h3>
                                  {/* description */}
                                  <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                                </div>
                                {/* price & score */}
                                <div className="flex w-full items-center justify-between">
                                  <p className="font-bold text-orange-600 text-lg">
                                    ${formatNumber(item.price, "es-CO")}
                                  </p>
                                  <div className="flex items-center pr-2">
                                    {/* star icon */}
                                    <Star className="size-3 text-orange-500 fill-current mr-1" />
                                    {/* score */}
                                    <span className="text-sm font-bold text-gray-900">
                                      {item.score}
                                    </span>
                                  </div>
                                </div>

                              </article>

                              {/* imagen */}
                              <figure className="relative h-full w-28 rounded-md justify-end">
                                <img
                                  src={item.image}
                                  alt={`${item.name} - ${item.description}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button className="absolute bottom-2 right-2 bg-orange-500 text-white text-xl size-full px-3 py-1 w-8 h-8 rounded-full flex justify-center items-center">
                                  <span><Plus className="size-5" /></span>
                                </button>
                              </figure>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </section>
                )
            )}
          </div>
        </main>
        {selectedFood && (
          <FoodDetailsModal
            food={{ ...selectedFood, shop: shop }}
            onClose={handleCloseModal}
          />
        )}
      </section>

      {shopCartItems.length > 0 && !selectedFood && (
        <footer className="fixed bottom-0 sm:right-5 w-full sm:w-auto bg-white sm:size-m sm:rounded-md shadow-orange-700 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 sm:gap-x-6 py-3">
            <div>
              <h2 className="text-lg sm:text-xl">Monto Total:</h2>
              <h3 className="text-orange-600 font-extrabold text-2xl sm:text-3xl">
                ${formatNumber(shopTotal, "es-CO")}
              </h3>
            </div>
            <button
              onClick={() => navigate("/shopping_cart")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold shadow hover:shadow-md transition"
            >
              Ver carrito
              <span className="size-full px-3 py-1 rounded-full ml-3 font-bold bg-white text-orange-950">
                {totalItems}
              </span>
            </button>
          </div>
        </footer>
      )}

      {/* modals */}
      <SessionModal />
      <WelcomeCustomerModal />
    </div>
  );
};

export default ShopMenu;
