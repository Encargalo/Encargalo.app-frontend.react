//lucide react / icons
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Star, Tag } from "lucide-react";
//components
import SessionModal from "../../auth/components/SessionModal";
import UserMenu from "../../../components/UserMenu.jsx";
import WelcomeCustomerModal from "../../auth/components/WelcomeCustomerModal";
import FoodDetailsModal from "../../products/components/FoodDetailsModal";
import ItemCard from "../../products/components/ItemCard";
//store/hooks
import useNumberFormat from "../../../hooks/useNumberFormat";
import useOnLoginStore from "../../../store/onLoginStore";
import useCartStore from "../../cart/store/cartStore";
//services
import getShopDetails from "../services/getShopDetails.js";
//utils
import { getDecryptedItem } from "../../../utils/encryptionUtilities";
//react
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getBestSellingFoods from "../services/getBestSellingFoods.js";
import RequestLocationModal from "../../../components/RequestLocationModal.jsx";
import ShopNotFound from "./ShopNotFound.jsx";

const ShopMenu = () => {
  // Estados
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const carouselRef = useRef(null);
  const bestSellingCarouselRefMobile = useRef(null);
  const discountedCarouselRef = useRef(null);
  const discountedCarouselRefMobile = useRef(null);
  const bestSellingCarouselRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [toggleShopNotFound, setToggleShopNotFound] = useState(false);

  //onLogin
  const { openLoginModal } = useOnLoginStore()

  /* prev cart items */
  const { cart } = useCartStore();
  const { formatNumber } = useNumberFormat();
  const shopCartItems = cart.filter(item => item.shopInfo?.id === shop.id);

  // Calcula el subtotal para un item del carrito, incluyendo adicionales.
  const calculateItemSubtotal = (item) => {
    const additionalsPrice = (item.additionals || []).reduce((sum, add) => sum + (add.price || 0), 0);
    return (item.price + additionalsPrice) * (item.quantity || 1);
  };

  const shopTotal = shopCartItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);

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
    getShopDetails(setShop, setCategories, tag_shop, setToggleShopNotFound);
  }, [tag_shop]);

  // Obtiene los productos más vendidos cuando la tienda está cargada
  const [bestSellingFoods, setBestSellingFoods] = useState([]);
  useEffect(() => {
    if (shop.id) {
      getBestSellingFoods(setBestSellingFoods, shop.id);
    }
  }, [shop.id]);

  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodClick = (item) => {
    // Busca el item completo en las categorías para asegurar que tenga las 'rules'
    const fullItem = categories
      .flatMap(category => category.items || [])
      .find(i => i.id === item.id);

    // Si se encuentra el item completo (con rules), se usa. Si no, se usa el item original.
    const itemToShow = fullItem || item;
    setSelectedFood(itemToShow);
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

  const scrollBestSellingCarousel = (direction) => {
    const scrollAmount = 336; // Ancho de tarjeta PC + gap
    [bestSellingCarouselRef, bestSellingCarouselRefMobile].forEach(ref => {
      const carousel = ref.current;
      if (carousel) {
        const currentScrollAmount = carousel === bestSellingCarouselRefMobile.current ? 208 : scrollAmount;
        const newScrollLeft =
          carousel.scrollLeft +
          (direction === "left" ? -currentScrollAmount : currentScrollAmount);
        carousel.scrollLeft +
          (direction === "left" ? -scrollAmount : scrollAmount);

        carousel.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    });
  };

  const scrollDiscountedCarousel = (direction) => {
    const scrollAmount = 336; // Ancho de tarjeta PC + gap
    [discountedCarouselRef, discountedCarouselRefMobile].forEach(ref => {
      const carousel = ref.current;
      if (carousel) {
        const currentScrollAmount = carousel === discountedCarouselRefMobile.current ? 208 : scrollAmount;
        const newScrollLeft =
          carousel.scrollLeft +
          (direction === "left" ? -currentScrollAmount : currentScrollAmount);
        carousel.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    });
  };

  //user data
  useEffect(() => {
    const user_session = import.meta.env.VITE_USER_SESSION
    const user_data = getDecryptedItem(user_session)
    setUserData(user_data)
  }, [])

  // Filtrar categorías que sí tienen productos
  const validCategories = useMemo(() => categories.filter(
    (category) => Array.isArray(category.items) && category.items.length > 0
  ), [categories]);

  const discountedItems = useMemo(() =>
    categories
      .flatMap(category => category.items || [])
      .filter(item => item.rules?.some(rule => rule.rule_key === 'discount'))
    , [categories]);

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

        <main className="pb-14 sm:pb-0 relative">
          {/* banner shop*/}
          <div className="relative sm:h-[40em] h-[17em] overflow-hidden">
            <img
              src={shop.banner || shop.logo}
              alt={`Imagen de ${shop.name}`}
              className="w-full h-full object-cover object-center"
            />
            {/* overlay negro actual */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* nuevo overlay anaranjado con blur si el local está cerrado */}
            {shop && shop.opened === false && (
              <>
                <div className="absolute inset-0 bg-orange-400/30 backdrop-blur-sm pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-red-600 text-white px-5 py-2 rounded-full font-bold shadow-lg text-lg">
                    Cerrado
                  </span>
                </div>
              </>
            )}

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

                {/* Botón de Descuentos */}
                {discountedItems.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory("discounts")}
                    className={`relative flex items-center gap-2 px-4 py-2 sm:text-lg font-medium rounded-full transition-all whitespace-nowrap group ${selectedCategory === "discounts"
                      ? "bg-red-600 text-white"
                      : "bg-white text-red-600 border border-red-300 hover:bg-red-50"
                      }`}
                  >
                    <Tag className="size-4" />
                    Descuentos
                  </button>
                )}

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

          {/* Discounted Items Section (when 'all' is selected) */}
          {selectedCategory === 'all' && discountedItems.length > 0 && (
            <section className="px-3 sm:px-6 lg:px-8 pt-8">
              <header className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  ¡Tu Descuento Ideal!
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollDiscountedCarousel("left")}
                    className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronLeft className="size-4 text-gray-600 hover:text-orange-600" />
                  </button>
                  <button
                    onClick={() => scrollDiscountedCarousel("right")}
                    className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ChevronRight className="size-4 text-gray-600 hover:text-orange-600" />
                  </button>
                </div>
              </header>
              {/* Vista para Móviles (diseño compacto) */}
              <div ref={discountedCarouselRefMobile} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 sm:hidden">
                {discountedItems.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-48">
                    <article onClick={() => handleFoodClick(item)} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group h-full flex flex-col">

                      {/* header */}
                      <header className="relative">
                        {/* image */}
                        <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />

                        {/* score */}
                        <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                          <Star className="size-3 text-orange-500 fill-current mr-1" /><span className="text-xs font-bold">{item.score}</span>
                        </div>

                        {/* rules */}
                        {item.rules?.find(r => r.rule_key === 'discount') && (
                          <div className="absolute bottom-0 left-0 right-0 background_discount text-white text-center py-1 text-xs font-bold">
                            {`Descuento ${item.rules.find(r => r.rule_key === 'discount').rule_value}%`}
                          </div>
                        )}
                      </header>

                      {/* body */}
                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600">{item.name}</h3>
                        <p className="text-sm text-gray-600 truncate flex-grow">{item.description}</p>

                        {/* footer */}
                        <footer className="flex items-center justify-between mt-2">
                          {/* price */}
                          <p className="text-base font-bold text-orange-600">${formatNumber(item.price)}</p>
                          {/* button */}
                          <button className="bg-orange-500 text-white p-1.5 rounded-full shadow-md hover:bg-orange-600"><Plus className="size-4" /></button>
                        </footer>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Vista para PC (diseño con ItemCard) */}
              <div ref={discountedCarouselRef} className="hidden sm:flex gap-4 overflow-x-auto no-scrollbar pb-4">
                {discountedItems.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-72 sm:w-80">
                    <ItemCard item={item} onItemClick={handleFoodClick} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Best Selling Foods */}
          {selectedCategory === "all" && bestSellingFoods.length > 0 && (
            <div className="w-full px-3 pt-7 sm:px-6 lg:px-8">
              <section className="relative">
                <header className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    ¡Los más vendido!
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => scrollBestSellingCarousel("left")}
                      className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ChevronLeft className="size-4 text-gray-600 hover:text-orange-600" />
                    </button>
                    <button
                      onClick={() => scrollBestSellingCarousel("right")}
                      className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ChevronRight className="size-4 text-gray-600 hover:text-orange-600" />
                    </button>
                  </div>
                </header>

                {/* Vista para Móviles (diseño compacto) */}
                <div ref={bestSellingCarouselRefMobile} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 sm:hidden">
                  {bestSellingFoods.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-48">
                      <article onClick={() => handleFoodClick(item)} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group h-full flex flex-col">

                        {/* header */}
                        <header className="relative">
                          {/* image */}
                          <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />

                          {/* score */}
                          <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                            <Star className="size-3 text-orange-500 fill-current mr-1" /><span className="text-xs font-bold">{item.score}</span>
                          </div>

                          {/* rules */}
                          {item.rules?.find(r => r.rule_key === 'discount') && (
                            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-xs font-bold">
                              {`Descuento ${item.rules.find(r => r.rule_key === 'discount').rule_value}%`}
                            </div>
                          )}
                        </header>

                        {/* body */}
                        <div className="p-3 flex flex-col flex-grow">
                          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600">{item.name}</h3>
                          <p className="text-sm text-gray-600 truncate flex-grow">{item.description}</p>

                          {/* footer */}
                          <footer className="flex items-center justify-between mt-2">
                            {/* price */}
                            <p className="text-base font-bold text-orange-600">${formatNumber(item.price)}</p>
                            {/* button */}
                            <button className="bg-orange-500 text-white p-1.5 rounded-full shadow-md hover:bg-orange-600"><Plus className="size-4" /></button>
                          </footer>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>

                {/* Vista para PC (diseño con ItemCard) */}
                <div ref={bestSellingCarouselRef} className="hidden sm:flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {bestSellingFoods.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-72 sm:w-80">
                      <ItemCard item={item} onItemClick={handleFoodClick} />
                    </div>
                  ))}
                </div>

              </section>
            </div>
          )}

          {/* list categories*/}
          <div className="w-full px-3 pb-12 sm:px-6 lg:px-8">
            {validCategories.map(
              (category) =>
                // Muestra la categoría solo si está seleccionada o si se eligen "Todas"
                (selectedCategory === "all" ||
                  selectedCategory === "discounts" && discountedItems.some(dItem => category.items.some(cItem => cItem.id === dItem.id)) ||
                  selectedCategory === category.id) && (
                  <section key={category.id} className="mb-8">
                    {/* name category */}
                    <h2 className="text-2xl font-bold text-white mb-4 mt-10">
                      {category.name}
                    </h2>

                    {/* products */}
                    {category.items?.length > 0 ? (
                      <>
                        {/* Vista en GRID → solo en sm en adelante */}
                        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {(selectedCategory === 'discounts' ? discountedItems.filter(dItem => category.items.some(cItem => cItem.id === dItem.id)) : category.items)
                            .map((item) => (
                              <ItemCard
                                key={item.id}
                                item={item}
                                onItemClick={handleFoodClick}
                              />
                            ))}
                        </div>

                        {/* Vista en LISTA → solo en móviles */}
                        <ul className="flex flex-col gap-y-3 sm:hidden">
                          {(selectedCategory === 'discounts' ? discountedItems.filter(dItem => category.items.some(cItem => cItem.id === dItem.id)) : category.items)
                            .map((item) => (
                              <li
                                key={item.id}
                                className="flex gap-2 p-3 bg-white rounded-xl shadow"
                                onClick={() => handleFoodClick(item)}
                              >
                                {/* info */}
                                <article className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                                  <div className="space-y-1 mb-2">
                                    {/* name */}
                                    <h3 className="text-base font-semibold truncate">{item.name}</h3>
                                    {/* description */}
                                    <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">{item.description}</p>

                                    {/* discount */}
                                    {item.rules?.find(r => r.rule_key === 'discount') && (
                                      <div className="w-max px-2 background_discount text-white text-center py-0.5 text-sm font-bold rounded-md ">
                                        {`Descuento del ${item.rules.find(r => r.rule_key === 'discount').rule_value}%`}
                                      </div>
                                    )}
                                  </div>

                                  {/* price & score */}
                                  <div className="flex w-full items-center justify-between">
                                    <p className="font-bold text-orange-600 text-base">
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
                                <figure className="relative h-full w-24 flex-shrink-0">
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

          <ShopNotFound toggleShopNotFound={toggleShopNotFound} />
        </main>

        {/* modals */}
        {selectedFood && (
          <FoodDetailsModal
            food={{ ...selectedFood, shop: shop }}
            onClose={handleCloseModal}
          />
        )}
      </section>

      {
        shopCartItems.length > 0 && !selectedFood && (
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
        )
      }

      {/* modals */}
      <SessionModal />
      <WelcomeCustomerModal />
      <RequestLocationModal />
    </div >
  );
};

export default ShopMenu;
